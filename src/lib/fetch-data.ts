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
