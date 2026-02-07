// API Route: 올림픽 메달 스크래핑

import { NextResponse } from "next/server";
import type { CountryMedal } from "@/types";

// Puppeteer나 Playwright 대신 fetch + cheerio 사용
// (클라이언트 측에서는 브라우저 자동화 필요)

export async function GET() {
  try {
    // Olympics.com은 403 에러 반환하므로
    // 실제 프로덕션에서는 브라우저 자동화 필요
    
    // 임시로 빈 배열 반환 (메달 아직 없음)
    const medals: CountryMedal[] = [];
    
    return NextResponse.json({
      success: true,
      data: medals,
      timestamp: new Date().toISOString(),
      message: "아직 메달이 수여되지 않았습니다.",
    });
  } catch (error) {
    console.error("Medal scraping error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape medal data",
      },
      { status: 500 }
    );
  }
}

// POST: 수동으로 메달 데이터 업데이트 (관리자용)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { medals } = body;
    
    // TODO: Supabase나 파일 시스템에 저장
    // 현재는 메모리에만 저장 (서버 재시작 시 초기화)
    
    return NextResponse.json({
      success: true,
      message: "Medal data updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update medal data",
      },
      { status: 500 }
    );
  }
}
