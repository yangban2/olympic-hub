import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

export default function Predict() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Olympic Hub
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Coming Soon Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            메달 예측 게임
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            곧 공개됩니다! 🎯
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="text-5xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              메달 예측 투표
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              각 종목의 금-은-동 메달 수상자를 예측하고 포인트를 획득하세요!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              실시간 리더보드
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              예측 정확도 순위를 실시간으로 확인하고 다른 사용자와 경쟁하세요!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="text-5xl mb-4">🎖️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              배지 시스템
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              연속 적중, 완벽 예측 등 다양한 배지를 수집하세요!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              💡 메달 경기가 본격 시작되면 예측 게임이 오픈됩니다!
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              그 동안 대시보드에서 실시간 메달 현황을 확인하세요.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full font-bold hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
