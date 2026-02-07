import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) return "진행 완료";
  if (diffMins < 60) return `${diffMins}분 후`;
  if (diffHours < 24) return `${diffHours}시간 후`;
  return `${diffDays}일 후`;
}

export function getMedalEmoji(position: "gold" | "silver" | "bronze"): string {
  const medals = {
    gold: "🥇",
    silver: "🥈",
    bronze: "🥉",
  };
  return medals[position];
}
