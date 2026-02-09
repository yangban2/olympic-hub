// 실제 Olympic 데이터 fetch

import type { CountryMedal } from "@/types";

export interface OlympicData {
  lastUpdated: string;
  completedEvents: number;
  totalEvents: number;
  medals: CountryMedal[];
}

/**
 * Public JSON 파일에서 실제 메달 데이터 로드
 * (서버사이드 or 클라이언트사이드 모두 가능)
 */
export async function fetchMedalData(): Promise<OlympicData | null> {
  try {
    const response = await fetch("/data/medals.json", {
      cache: "no-store", // 항상 최신 데이터
    });
    
    if (!response.ok) {
      console.error("Failed to fetch medal data");
      return null;
    }
    
    const data: OlympicData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching medal data:", error);
    return null;
  }
}

/**
 * 한국 메달 찾기
 */
export function findKoreaMedal(medals: CountryMedal[]): CountryMedal | null {
  return medals.find((m) => m.countryCode === "KR" || m.countryCode === "KOR") || null;
}

/**
 * 뉴스 데이터 타입
 */
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  publishedAt: string;
  category: string;
}

export interface NewsData {
  lastUpdated: string;
  articles: NewsArticle[];
}

/**
 * 뉴스 데이터 fetch
 */
export async function fetchNewsData(): Promise<NewsData | null> {
  try {
    const response = await fetch("/data/news.json", {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
}

/**
 * 하이라이트 데이터 타입
 */
export interface MedalHighlight {
  sport: string;
  event: string;
  winner: string;
  country: string;
  countryCode: string;
  flag: string;
  result?: string;
  time: string;
}

export interface HighlightsData {
  lastUpdated: string;
  highlights: MedalHighlight[];
}

/**
 * 하이라이트 데이터 fetch
 */
export async function fetchHighlightsData(): Promise<HighlightsData | null> {
  try {
    const response = await fetch("/data/highlights.json", {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching highlights data:", error);
    return null;
  }
}

/**
 * 일정 데이터 타입
 */
export interface ScheduleEvent {
  time: string;
  sport: string;
  event: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
}

export interface ScheduleData {
  lastUpdated: string;
  events: ScheduleEvent[];
}

/**
 * 일정 데이터 fetch
 */
export async function fetchScheduleData(): Promise<ScheduleData | null> {
  try {
    const response = await fetch("/data/schedule.json", {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return null;
  }
}
