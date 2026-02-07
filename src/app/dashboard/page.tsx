"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Medal, Calendar, TrendingUp, ExternalLink, RefreshCw, Clock } from "lucide-react";
import { upcomingEvents, highlights, koreaInitialData, expectedMedalStandings, koreanAthletes } from "@/lib/data";
import { formatDate, getMedalEmoji, getRelativeTime } from "@/lib/utils";
import { fetchMedalData } from "@/lib/fetch-data";
import type { CountryMedal } from "@/types";

export default function Dashboard() {
  const [medals, setMedals] = useState<CountryMedal[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(false);

  // 메달이 아직 없는지 체크
  const noMedalsYet = medals.length === 0;
  
  // 표시할 순위 (메달 없으면 예상 순위)
  const displayStandings = noMedalsYet ? expectedMedalStandings : medals;
  
  // 한국 메달 현황
  const koreaStats = displayStandings.find((c) => c.countryCode === "KR") || koreaInitialData;

  // 실제 메달 데이터 로드
  const loadMedalData = async () => {
    setLoading(true);
    try {
      const data = await fetchMedalData();
      if (data && data.medals.length > 0) {
        setMedals(data.medals);
        setLastUpdate(data.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to load medals:", error);
    } finally {
      setLoading(false);
    }
  };

  // 메달 데이터 새로고침 (새로운 데이터 fetch)
  const refreshMedals = async () => {
    await loadMedalData();
  };

  // 초기 로드
  useEffect(() => {
    loadMedalData();
  }, []);

  // 자동 새로고침 (5분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      loadMedalData();
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Olympic Hub
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshMedals}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">새로고침</span>
              </button>
              <Link
                href="/predict"
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-semibold"
              >
                예측 게임
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 마지막 업데이트 시간 */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>마지막 업데이트: {new Date(lastUpdate).toLocaleString("ko-KR")}</span>
        </div>

        {/* 메달 순위 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Medal className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                실시간 메달 순위
              </h2>
            </div>
            {noMedalsYet && (
              <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                예상 순위
              </span>
            )}
          </div>

          {noMedalsYet && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📊 아직 메달 경기가 없어 과거 대회 성적 기반 예상 순위를 표시합니다. 첫 메달이 나오면 실시간으로 업데이트됩니다!
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">순위</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">국가</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">🥇 금</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">🥈 은</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">🥉 동</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">합계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayStandings.map((country, index) => (
                    <tr
                      key={country.countryCode}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        country.countryCode === "KR" ? "bg-blue-50 dark:bg-blue-900/20 font-bold" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-lg font-bold text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{country.flag}</span>
                          <span className="text-lg font-medium text-gray-900 dark:text-white">
                            {country.country}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xl font-bold text-yellow-600">
                        {country.gold > 0 ? country.gold : noMedalsYet ? "-" : "0"}
                      </td>
                      <td className="px-6 py-4 text-center text-xl font-bold text-gray-400">
                        {country.silver > 0 ? country.silver : noMedalsYet ? "-" : "0"}
                      </td>
                      <td className="px-6 py-4 text-center text-xl font-bold text-orange-600">
                        {country.bronze > 0 ? country.bronze : noMedalsYet ? "-" : "0"}
                      </td>
                      <td className="px-6 py-4 text-center text-xl font-bold text-blue-600 dark:text-blue-400">
                        {country.total > 0 ? country.total : noMedalsYet ? "-" : "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 한국 선수 스포트라이트 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🇰🇷</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              한국 선수 스포트라이트
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {koreanAthletes.map((athlete) => (
              <div
                key={athlete.name}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {athlete.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm font-semibold">
                    {athlete.sport}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {athlete.bio}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">출전 종목:</p>
                  {athlete.events.map((event) => (
                    <div key={event} className="text-sm text-gray-700 dark:text-gray-300">
                      • {event}
                    </div>
                  ))}
                </div>
                {athlete.medals && (athlete.medals.gold > 0 || athlete.medals.silver > 0 || athlete.medals.bronze > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4 justify-center">
                      {athlete.medals.gold > 0 && (
                        <div className="text-center">
                          <div className="text-2xl">🥇</div>
                          <div className="text-lg font-bold text-yellow-600">{athlete.medals.gold}</div>
                        </div>
                      )}
                      {athlete.medals.silver > 0 && (
                        <div className="text-center">
                          <div className="text-2xl">🥈</div>
                          <div className="text-lg font-bold text-gray-400">{athlete.medals.silver}</div>
                        </div>
                      )}
                      {athlete.medals.bronze > 0 && (
                        <div className="text-center">
                          <div className="text-2xl">🥉</div>
                          <div className="text-lg font-bold text-orange-600">{athlete.medals.bronze}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 오늘의 경기 일정 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              오늘의 주요 일정
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold">
                    {event.sport}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {event.event}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {getRelativeTime(event.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 오늘의 하이라이트 & 뉴스 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              오늘의 하이라이트 & 뉴스
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((news) => (
              <div
                key={news.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-600"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {news.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {news.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{news.sport}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(news.date).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <a
                    href="https://www.olympics.com/en/milano-cortina-2026/live-updates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    <span>자세히 보기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 추가 뉴스 링크 */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <a
              href="https://sports.jtbc.co.kr/olympics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📺</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">JTBC 올림픽 중계</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">실시간 중계 및 하이라이트</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>

            <a
              href="https://www.olympics.com/en/milano-cortina-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏅</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Olympics.com 공식</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">공식 올림픽 웹사이트</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>

            <a
              href="https://www.bbc.com/korean/articles/c368ggl5963o"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📰</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">BBC 뉴스 코리아</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">한국 출전 종목 및 뉴스</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>

            <a
              href="https://namu.wiki/w/2026%20%EB%B0%80%EB%9D%BC%EB%85%B8%C2%B7%EC%BD%94%EB%A5%B4%ED%8B%B0%EB%82%98%EB%8B%B4%ED%8E%98%EC%B4%88%20%EB%8F%99%EA%B3%84%EC%98%AC%EB%A6%BC%ED%94%BD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">나무위키 백과</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">상세 정보 및 기록</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
