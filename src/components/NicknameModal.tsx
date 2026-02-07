"use client";

import { useState } from "react";
import { Trophy, X } from "lucide-react";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => Promise<void>;
}

export default function NicknameModal({ isOpen, onClose, onSubmit }: NicknameModalProps) {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (nickname.trim().length < 2) {
      setError("닉네임은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (nickname.length > 50) {
      setError("닉네임은 최대 50자까지 가능합니다.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(nickname.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "닉네임 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            닉네임 입력
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            예측 게임에 참여하려면 닉네임이 필요해요!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="멋진 닉네임을 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
              autoFocus
              maxLength={50}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || nickname.trim().length < 2}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "생성 중..." : "시작하기"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          닉네임은 나중에 변경할 수 없으니 신중하게 선택하세요!
        </p>
      </div>
    </div>
  );
}
