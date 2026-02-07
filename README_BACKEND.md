# Olympic Hub - Backend Setup

## 🚀 Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 또는 새로 생성
3. Project ID: `ozoepivxhtqndzaqvygj` (이미 있다면 사용)

### 2. 데이터베이스 스키마 생성
1. Supabase Dashboard → SQL Editor
2. `supabase/schema.sql` 파일 내용 복사 & 실행
3. 테이블 생성 확인:
   - `users` - 유저 정보
   - `events` - 올림픽 이벤트
   - `predictions` - 메달 예측
   - `leaderboard` (View) - 실시간 순위

### 3. API 키 복사
1. Supabase Dashboard → Settings → API
2. `Project URL` 복사
3. `anon` `public` 키 복사

### 4. 환경 변수 설정
`.env.local` 파일 생성:

```bash
# Google AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-5715489344967596

# Kakao
NEXT_PUBLIC_KAKAO_JS_KEY=dce4c34f7c1678888e63843105ff0d9b

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ozoepivxhtqndzaqvygj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Site URL
NEXT_PUBLIC_SITE_URL=https://olympic-hub.naroo.app
```

### 5. 초기 데이터 입력 (선택)
올림픽 이벤트 데이터를 `events` 테이블에 입력:

```sql
INSERT INTO events (id, sport, event_name, event_date, venue, status)
VALUES 
  ('evt-003', 'Speed Skating', 'Women''s 3000m Final', '2026-02-07 16:00:00+01', 'PalaItalia Santa Giulia', 'upcoming'),
  ('evt-004', 'Ski Jumping', 'Women''s Normal Hill Final', '2026-02-07 17:45:00+01', 'Cortina Ski Jump', 'upcoming'),
  ('evt-005', 'Snowboarding', 'Men''s Big Air Final', '2026-02-07 19:30:00+01', 'Milan Big Air', 'upcoming'),
  ('evt-009', 'Figure Skating', 'Team Event - Men''s Short Program', '2026-02-07 19:45:00+01', 'Mediolanum Forum', 'upcoming');
```

## 📡 API Endpoints

### User Management
- `POST /api/user/create` - 새 유저 생성
  ```json
  { "nickname": "올림픽팬" }
  ```

- `GET /api/user/[nickname]` - 유저 정보 조회

### Predictions
- `POST /api/predictions/submit` - 예측 제출
  ```json
  {
    "user_id": "uuid",
    "event_id": "evt-003",
    "predicted_gold": "Irene Schouten 🇳🇱",
    "predicted_silver": "Miho Takagi 🇯🇵",
    "predicted_bronze": "Isabelle Weidemann 🇨🇦"
  }
  ```

### Leaderboard
- `GET /api/leaderboard?limit=100` - 상위 100명 조회

## 🎮 포인트 시스템

### 점수 계산
- **완벽 예측** (금-은-동 모두 맞음): 100점
- **금메달 정확**: 50점
- **은메달 정확**: 30점
- **동메달 정확**: 20점
- **금메달 틀린 자리**: 25점
- **은메달 틀린 자리**: 15점
- **동메달 틀린 자리**: 10점

### 배지 시스템
- 🌱 초보 예측가: 첫 예측 성공
- 🔥 연속 적중: 5개 연속 성공
- 💯 완벽 예측: 완벽 예측 달성
- 👑 예측왕: 10개 이상 정확히 예측

## 🔄 개발 순서

1. ✅ DB 스키마 생성 (`schema.sql`)
2. ✅ API Routes 구현
3. 🔄 프론트엔드 연동 (진행 중)
4. ⏳ 실시간 리더보드
5. ⏳ 배지 시스템
6. ⏳ 결과 검증 자동화

## 🐛 트러블슈팅

### Supabase 연결 오류
- `.env.local` 파일 존재 확인
- API 키 정확성 확인
- Row Level Security 정책 확인

### CORS 에러
- Next.js는 자동으로 API routes를 프록시함
- 직접 Supabase를 호출하는 경우 CORS 설정 필요

## 📚 참고 자료
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
