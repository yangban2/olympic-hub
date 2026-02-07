import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(Math.min(limit, 1000));

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '리더보드 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leaderboard: data || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
