import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('nickname', decodeURIComponent(nickname))
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
