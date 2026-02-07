// 타입 정의

export interface CountryMedal {
  rank: number;
  country: string;
  countryCode: string; // KR, US, CN 등
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  flag: string; // emoji
}

export type EventStatus = "upcoming" | "live" | "completed";

export interface Event {
  id: string;
  sport: string; // "Figure Skating"
  event: string; // "Men's Single Free Skating"
  date: string; // ISO 8601
  venue: string;
  status: EventStatus;
  medalists?: {
    gold: string; // 선수명 또는 국가
    silver: string;
    bronze: string;
  };
}

export interface KoreanAthlete {
  name: string;
  sport: string;
  events: string[];
  photo?: string;
  bio?: string;
  medals?: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export interface Prediction {
  id: string;
  userId: string;
  eventId: string;
  predictedGold: string;
  predictedSilver: string;
  predictedBronze: string;
  createdAt: string;
}

export interface User {
  id: string;
  nickname: string;
  totalPoints: number;
  badges: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  sport: string;
  date: string;
  link?: string;
}
