import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { user_id, event_id, predicted_gold, predicted_silver, predicted_bronze } =
      await request.json();

    // Validation
    if (!user_id || !event_id || !predicted_gold || !predicted_silver || !predicted_bronze) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Check if same athlete predicted for multiple medals
    if (
      predicted_gold === predicted_silver ||
      predicted_gold === predicted_bronze ||
      predicted_silver === predicted_bronze
    ) {
      return NextResponse.json(
        { error: '같은 선수를 여러 메달에 예측할 수 없습니다.' },
        { status: 400 }
      );
    }

    // Check if event exists and is still upcoming
    const { data: event } = await supabase
      .from('events')
      .select('status')
      .eq('id', event_id)
      .single();

    if (!event) {
      return NextResponse.json(
        { error: '존재하지 않는 경기입니다.' },
        { status: 404 }
      );
    }

    if (event.status !== 'upcoming') {
      return NextResponse.json(
        { error: '이미 시작되었거나 종료된 경기입니다.' },
        { status: 400 }
      );
    }

    // Upsert prediction (insert or update if exists)
    const { data, error } = await supabase
      .from('predictions')
      .upsert(
        {
          user_id,
          event_id,
          predicted_gold,
          predicted_silver,
          predicted_bronze,
          points_earned: 0,
          is_verified: false,
        },
        {
          onConflict: 'user_id,event_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '예측 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // Update total_predictions count
    await supabase.rpc('increment_total_predictions', { user_uuid: user_id });

    return NextResponse.json(
      {
        prediction: data,
        message: '예측이 성공적으로 저장되었습니다!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
