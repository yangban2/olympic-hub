import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json(
        { error: '닉네임은 최소 2자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (nickname.length > 50) {
      return NextResponse.json(
        { error: '닉네임은 최대 50자까지 가능합니다.' },
        { status: 400 }
      );
    }

    // Check if nickname already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 닉네임입니다.' },
        { status: 409 }
      );
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nickname: nickname.trim(),
          total_points: 0,
          correct_predictions: 0,
          total_predictions: 0,
          badges: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '유저 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
