"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Medal, Calendar, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import { koreaInitialData, expectedMedalStandings } from "@/lib/data";
import { formatDate, getMedalEmoji } from "@/lib/utils";
import { fetchMedalData, findKoreaMedal, fetchNewsData, fetchHighlightsData, fetchScheduleData } from "@/lib/fetch-data";
import type { NewsArticle, MedalHighlight, ScheduleEvent } from "@/lib/fetch-data";
import type { CountryMedal } from "@/types";

// 애니메이션 variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [medalStandings, setMedalStandings] = useState<CountryMedal[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [highlights, setHighlights] = useState<MedalHighlight[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);

  // 실제 메달 데이터 fetch
  useEffect(() => {
    async function loadData() {
      const [medalsData, newsData, highlightsData, scheduleData] = await Promise.all([
        fetchMedalData(),
        fetchNewsData(),
        fetchHighlightsData(),
        fetchScheduleData(),
      ]);
      
      if (medalsData?.medals) setMedalStandings(medalsData.medals);
      if (newsData?.articles) setNews(newsData.articles);
      if (highlightsData?.highlights) setHighlights(highlightsData.highlights);
      if (scheduleData?.events) setSchedule(scheduleData.events);
      
      setLoading(false);
    }
    loadData();
  }, []);

  // 한국 메달 현황
  const koreaStats = findKoreaMedal(medalStandings) || koreaInitialData;
  
  // 메달이 아직 없는지 체크
  const noMedalsYet = medalStandings.length === 0;
  
  // 표시할 순위 (메달 없으면 예상 순위)
  const displayStandings = noMedalsYet ? expectedMedalStandings : medalStandings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
            variants={fadeInUp}
          >
            🎿 2026년 2월 6일 ~ 22일
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
            variants={fadeInUp}
          >
            Olympic Hub
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100"
            variants={fadeInUp}
          >
            밀라노-코르티나 동계올림픽 실시간 대시보드
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={fadeInUp}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              실시간 대시보드
            </Link>
            <Link
              href="/predict"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-400 transition-all transform hover:scale-105 shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              메달 예측 게임
            </Link>
          </motion.div>
        </div>
        
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 text-8xl">⛷️</div>
          <div className="absolute top-20 right-20 text-6xl">🏂</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">⛸️</div>
          <div className="absolute bottom-20 right-1/3 text-5xl">🥌</div>
        </div>
      </motion.section>

      {/* 한국 메달 현황 */}
      <motion.section
        className="max-w-6xl mx-auto px-4 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl border-2 border-blue-200 dark:border-gray-600">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{koreaStats?.flag}</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              대한민국 메달 현황
            </h2>
          </div>
          
          {noMedalsYet && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-semibold mb-1">🏅 메달 경기가 곧 시작됩니다!</p>
                <p>올림픽 개막 직후로 아직 메달이 수여되지 않았습니다. 첫 메달 경기는 오늘 저녁부터 시작됩니다!</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <div className="text-4xl mb-2">{getMedalEmoji("gold")}</div>
              <div className="text-3xl font-bold text-yellow-500">{koreaStats?.gold}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">금메달</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <div className="text-4xl mb-2">{getMedalEmoji("silver")}</div>
              <div className="text-3xl font-bold text-gray-400">{koreaStats?.silver}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">은메달</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <div className="text-4xl mb-2">{getMedalEmoji("bronze")}</div>
              <div className="text-3xl font-bold text-orange-600">{koreaStats?.bronze}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">동메달</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-md">
              <Trophy className="w-10 h-10 mx-auto mb-2" />
              <div className="text-3xl font-bold">{koreaStats?.total}</div>
              <div className="text-sm">총 메달</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            {noMedalsYet ? (
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full font-semibold">
                🎯 목표: 금메달 3개 이상, 종합 순위 TOP 10
              </span>
            ) : (
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full font-semibold">
                종합 순위 {koreaStats?.rank}위
              </span>
            )}
          </div>
        </div>
      </motion.section>

      {/* 메달 순위 TOP 10 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Medal className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              메달 순위 TOP 10
            </h2>
          </div>
          {noMedalsYet && (
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
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
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">순위</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">국가</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">🥇</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">🥈</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">🥉</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">합계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayStandings.map((country) => (
                  <tr
                    key={country.countryCode}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      country.countryCode === "KR" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      {country.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {country.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-yellow-600">
                      {country.gold > 0 ? country.gold : noMedalsYet ? "-" : "0"}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-gray-400">
                      {country.silver > 0 ? country.silver : noMedalsYet ? "-" : "0"}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-orange-600">
                      {country.bronze > 0 ? country.bronze : noMedalsYet ? "-" : "0"}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-blue-600 dark:text-blue-400">
                      {country.total > 0 ? country.total : noMedalsYet ? "-" : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 최신 올림픽 뉴스 */}
      <motion.section
        className="max-w-6xl mx-auto px-4 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📰 최신 올림픽 뉴스
          </h2>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            뉴스를 불러오는 중...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 6).map((article) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                variants={fadeInUp}
              >
                {article.image && (
                  <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {article.category}
                    </span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString('ko-KR', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </motion.section>

      {/* 오늘의 메달리스트 */}
      {highlights.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto px-4 py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              🏅 오늘의 메달리스트
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.slice(0, 4).map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border-2 border-yellow-200 dark:border-yellow-700"
                variants={fadeInUp}
              >
                <div className="text-4xl mb-4">{highlight.flag}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {highlight.winner}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {highlight.sport}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {highlight.event}
                </p>
                {highlight.result && (
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {highlight.result}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 오늘/내일 주요 경기 */}
      {schedule.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto px-4 py-12 pb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              📅 오늘/내일 주요 경기
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {schedule.slice(0, 8).map((event, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
                variants={fadeInUp}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.sport}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {event.event}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'live' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : event.status === 'finished'
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {event.status === 'live' ? '🔴 진행 중' : event.status === 'finished' ? '완료' : '예정'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>⏰ {event.time}</span>
                  <span>📍 {event.venue}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-2">Olympic Hub</h3>
            <p className="text-gray-400">2026 밀라노-코르티나 동계올림픽</p>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              대시보드
            </Link>
            <Link href="/predict" className="hover:text-white transition-colors">
              예측 게임
            </Link>
            <a href="https://www.olympics.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              공식 사이트
            </a>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            Made with 🐋 by 고래등
          </div>
        </div>
      </footer>
    </div>
  );
}
