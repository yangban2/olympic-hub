"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, ArrowLeft, Medal, TrendingUp, Award, Target, Star } from "lucide-react";
import { upcomingEvents } from "@/lib/data";
import type { Event } from "@/types";

interface PredictionData {
  eventId: string;
  gold: string;
  silver: string;
  bronze: string;
}

interface Athlete {
  name: string;
  country: string;
  flag: string;
  favoriteLevel: "high" | "medium" | "low";
}

interface EventAthletes {
  eventId: string;
  sport: string;
  event: string;
  athletes: Athlete[];
}

interface AthletesData {
  events: Record<string, EventAthletes>;
  lastUpdated: string;
  source: string;
}

export default function Predict() {
  const [predictions, setPredictions] = useState<Record<string, PredictionData>>({});
  const [userPoints, setUserPoints] = useState(0);
  const [predictionsMade, setPredictionsMade] = useState(0);
  const [athletesData, setAthletesData] = useState<AthletesData | null>(null);
  const [loading, setLoading] = useState(true);

  // 선수 데이터 로드
  useEffect(() => {
    async function loadAthletes() {
      try {
        const response = await fetch('/data/athletes.json');
        const data = await response.json();
        setAthletesData(data);
      } catch (error) {
        console.error('Failed to load athletes data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAthletes();
  }, []);

  const handlePrediction = (eventId: string, medal: "gold" | "silver" | "bronze", athlete: string) => {
    setPredictions(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        eventId,
        [medal]: athlete,
      } as PredictionData,
    }));
  };

  const submitPrediction = (eventId: string) => {
    const prediction = predictions[eventId];
    if (prediction?.gold && prediction?.silver && prediction?.bronze) {
      // 예측 저장 (실제로는 API 호출)
      alert(`예측이 저장되었습니다!\n🥇 ${prediction.gold}\n🥈 ${prediction.silver}\n🥉 ${prediction.bronze}`);
      setPredictionsMade(prev => prev + 1);
    } else {
      alert("금, 은, 동메달을 모두 예측해주세요!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Medal Predictor
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6" />
                <span className="text-3xl font-bold">{userPoints}</span>
              </div>
              <p className="text-purple-100">누적 포인트</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6" />
                <span className="text-3xl font-bold">{predictionsMade}</span>
              </div>
              <p className="text-purple-100">예측 완료</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-6 h-6" />
                <span className="text-3xl font-bold">0</span>
              </div>
              <p className="text-purple-100">적중 횟수</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* How to Play */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-purple-600" />
            게임 방법
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">1️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">종목 선택</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                예측하고 싶은 경기를 선택하세요
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">2️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">메달 예측</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                금-은-동 메달 수상자를 예측하세요
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">포인트 획득</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                정확히 맞추면 포인트를 얻어요!
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Cards */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Medal className="w-8 h-8 text-yellow-500" />
          오늘의 예측 가능 경기
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">선수 데이터 로딩 중...</p>
          </div>
        ) : (
          <div className="grid gap-6 mb-12">
            {upcomingEvents
              .filter(event => athletesData?.events[event.id]) // 선수 데이터가 있는 경기만 표시
              .slice(0, 4)
              .map((event) => {
                const eventAthletes = athletesData?.events[event.id];
                if (!eventAthletes) return null;
                
                const prediction = predictions[event.id];

                return (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">
                            {event.sport}
                          </span>
                          <h3 className="text-2xl font-bold mb-2">{event.event}</h3>
                          <p className="text-purple-100 text-sm">
                            📍 {event.venue} • 🕐 {new Date(event.date).toLocaleString("ko-KR")}
                          </p>
                        </div>
                        <Trophy className="w-12 h-12 opacity-50" />
                      </div>
                    </div>

                    {/* Prediction Form */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Gold */}
                        <div>
                          <label className="block mb-3 flex items-center gap-2">
                            <span className="text-2xl">🥇</span>
                            <span className="font-semibold text-gray-900 dark:text-white">금메달</span>
                          </label>
                          <select
                            className="w-full p-3 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg bg-yellow-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            value={prediction?.gold || ""}
                            onChange={(e) => handlePrediction(event.id, "gold", e.target.value)}
                          >
                            <option value="">선택하세요</option>
                            {eventAthletes.athletes.map((athlete) => (
                              <option key={`${athlete.name}-${athlete.country}`} value={`${athlete.name} ${athlete.flag}`}>
                                {athlete.flag} {athlete.name} ({athlete.country})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Silver */}
                        <div>
                          <label className="block mb-3 flex items-center gap-2">
                            <span className="text-2xl">🥈</span>
                            <span className="font-semibold text-gray-900 dark:text-white">은메달</span>
                          </label>
                          <select
                            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={prediction?.silver || ""}
                            onChange={(e) => handlePrediction(event.id, "silver", e.target.value)}
                          >
                            <option value="">선택하세요</option>
                            {eventAthletes.athletes.map((athlete) => (
                              <option key={`${athlete.name}-${athlete.country}`} value={`${athlete.name} ${athlete.flag}`}>
                                {athlete.flag} {athlete.name} ({athlete.country})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Bronze */}
                        <div>
                          <label className="block mb-3 flex items-center gap-2">
                            <span className="text-2xl">🥉</span>
                            <span className="font-semibold text-gray-900 dark:text-white">동메달</span>
                          </label>
                          <select
                            className="w-full p-3 border-2 border-orange-300 dark:border-orange-600 rounded-lg bg-orange-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={prediction?.bronze || ""}
                            onChange={(e) => handlePrediction(event.id, "bronze", e.target.value)}
                          >
                            <option value="">선택하세요</option>
                            {eventAthletes.athletes.map((athlete) => (
                              <option key={`${athlete.name}-${athlete.country}`} value={`${athlete.name} ${athlete.flag}`}>
                                {athlete.flag} {athlete.name} ({athlete.country})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={() => submitPrediction(event.id)}
                        className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-5 h-5" />
                        예측 제출하기
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            실시간 리더보드
          </h2>
          <div className="space-y-4">
            {[
              { rank: 1, name: "올림픽마스터", points: 1250, badge: "👑" },
              { rank: 2, name: "메달헌터", points: 1100, badge: "💎" },
              { rank: 3, name: "예측왕", points: 980, badge: "⭐" },
              { rank: 4, name: "스포츠팬", points: 850, badge: "🔥" },
              { rank: 5, name: "초보예측가", points: 720, badge: "🌱" },
            ].map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400 w-8">{user.rank}</span>
                  <span className="text-2xl">{user.badge}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                    {user.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
