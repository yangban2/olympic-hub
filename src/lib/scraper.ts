// 올림픽 메달 스크래퍼

import type { CountryMedal, Event } from "@/types";

/**
 * Olympics.com에서 메달 순위 스크래핑
 * 브라우저 자동화 필요 (API 차단됨)
 */
export async function scrapeMedalStandings(): Promise<CountryMedal[]> {
  // TODO: 브라우저 자동화로 실제 데이터 스크래핑
  // 현재는 빈 배열 반환 (메달 아직 없음)
  
  // 나중에 실제 데이터가 나오면 여기서 스크래핑
  // const response = await fetch('/api/scrape-medals');
  // const data = await response.json();
  // return data.standings;
  
  return [];
}

/**
 * 한국 메달 현황만 추출
 */
export function getKoreaMedals(standings: CountryMedal[]): CountryMedal | null {
  return standings.find((c) => c.countryCode === "KR") || null;
}

/**
 * 현재 메달 순위 생성 (임시 Mock 데이터)
 * 실제 데이터가 나오기 전까지 사용
 */
export function getMockMedalStandings(): CountryMedal[] {
  // 아직 메달 경기가 없으므로 빈 배열 반환
  // 또는 "예상 순위" 형태로 표시 가능
  return [];
}

/**
 * 올림픽 일정 스크래핑
 */
export async function scrapeSchedule(): Promise<Event[]> {
  // TODO: 실제 일정 스크래핑
  return [];
}

/**
 * 메달 데이터 캐싱 (로컬 스토리지 or 파일)
 */
export function cacheMedalData(data: CountryMedal[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("olympic-medals", JSON.stringify(data));
    localStorage.setItem("olympic-medals-timestamp", Date.now().toString());
  }
}

/**
 * 캐시된 메달 데이터 가져오기 (5분 이내면 캐시 사용)
 */
export function getCachedMedalData(): CountryMedal[] | null {
  if (typeof window === "undefined") return null;
  
  const cached = localStorage.getItem("olympic-medals");
  const timestamp = localStorage.getItem("olympic-medals-timestamp");
  
  if (!cached || !timestamp) return null;
  
  const age = Date.now() - parseInt(timestamp);
  const CACHE_TTL = 5 * 60 * 1000; // 5분
  
  if (age > CACHE_TTL) return null;
  
  return JSON.parse(cached);
}
