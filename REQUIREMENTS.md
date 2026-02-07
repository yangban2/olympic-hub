# Olympic Hub - 통합 요구사항 문서

## 🎯 프로젝트 개요

**2026 밀라노-코르티나 동계올림픽 통합 웹앱**

3가지 핵심 기능을 모두 통합한 Gold 퀄리티 올림픽 웹사이트

- **Olympic Pulse**: 실시간 올림픽 대시보드
- **Medal Race**: 메달 예측 게임
- **Olympic Now**: 심플한 정보 페이지

---

## 📅 대회 정보

- **기간**: 2026년 2월 6일~22일 (17일간)
- **장소**: 이탈리아 밀라노-코르티나
- **한국 출전 종목**: 12개
  - 빙상: 쇼트트랙, 스피드스케이팅, 피겨스케이팅
  - 설상: 루지, 바이애슬론, 봅슬레이, 스노보드, 스켈레톤, 알파인 스키, 컬링, 크로스컨트리 스키, 프리스타일 스키
- **한국 목표**: 금메달 3개 이상, 종합 순위 TOP 10

---

## 🎨 디자인 목표: **Gold 퀄리티**

### ✅ 필수 요소 (Silver → Gold)
- ✅ 모바일/태블릿/데스크톱 완벽 반응형
- ✅ 깔끔한 디자인 (Tailwind 잘 활용)
- ✅ 기본 에러 처리 (404, 에러 메시지)
- ✅ 로딩 상태 표시
- ✅ 일관된 색상/폰트 시스템
- ✅ 직관적인 UX
- ✅ 빠른 로딩 (< 3초)
- ✅ **마이크로 인터랙션** (호버, 클릭 애니메이션)
- ✅ **멋진 전환 효과** (부드러운 fade, slide)
- ✅ **다크모드 지원**
- ✅ **접근성** (키보드 네비게이션, aria-labels)
- ✅ **SEO 최적화** (메타 태그, OG 이미지)
- ✅ **성능 최적화** (이미지 lazy loading, 코드 스플리팅)
- ✅ **디테일한 UX** (툴팁, 피드백, 가이드)

### 🎯 목표 반응
"오, 잘 만들었네?" - 성공한 SaaS 제품 페이지 수준

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (선택사항)
- **Real-time**: Supabase Realtime (예측 투표용)

### Deployment
- **Hosting**: Vercel
- **Domain**: *.naroo.app (서브도메인 활용)

### Data Sources
- **공식 데이터**: olympics.com 웹스크래핑 (또는 API)
- **Google Trends**: Google Trends API (선택사항)
- **Mock 데이터**: 개발 초기 단계용

---

## 🎯 핵심 기능 명세

### 1️⃣ Olympic Pulse - 실시간 대시보드

**페이지**: `/dashboard`

**주요 기능:**

1. **실시간 메달 집계**
   - 국가별 메달 순위 (금-은-동-합계)
   - 종목별 메달 현황
   - 애니메이션 카운터 효과
   - 실시간 업데이트 (WebSocket or 폴링)

2. **Google Trends 연동** (선택사항)
   - 지금 가장 핫한 선수/종목
   - 검색량 급상승 키워드
   - 시각화 차트

3. **오늘의 하이라이트**
   - 주요 경기 결과 (금메달 경기 중심)
   - 기록 경신, 이변 발생 등
   - 썸네일 이미지 + 간단한 설명

4. **한국 선수 스포트라이트**
   - 오늘의 한국 선수 경기 일정
   - 한국 메달 현황
   - 주요 한국 선수 프로필

**UI/UX:**
- 카드형 레이아웃
- 실시간 업데이트 표시 (펄스 애니메이션)
- 다크모드 지원
- 모바일 최적화 (지하철에서 보기 좋게)

---

### 2️⃣ Medal Race - 메달 예측 게임

**페이지**: `/predict`

**주요 기능:**

1. **메달 예측 투표**
   - 종목별 메달 예측 (금-은-동)
   - 사용자 투표 시스템
   - 투표 마감 시간 표시
   - 투표 후 결과 공개 여부 토글

2. **실시간 리더보드**
   - 예측 정확도 순위
   - 포인트 시스템 (정확도 가중치)
   - 사용자 랭킹 (닉네임)
   - 실시간 순위 변동

3. **통계 시각화**
   - 예측 vs 실제 비교 차트
   - 사용자 예측 분포
   - 예측 정확도 추이

4. **배지 시스템**
   - 정확도 높으면 배지 획득
   - 연속 적중, 완벽 예측 등
   - 수집형 배지 갤러리

**UI/UX:**
- 인터랙티브 투표 UI
- 애니메이션 피드백
- 소셜 공유 기능 (결과 공유)
- 게임화 요소 (진행률 바, 업적)

**Database Schema (Supabase):**

```sql
-- 예측 테이블
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  predicted_gold TEXT,
  predicted_silver TEXT,
  predicted_bronze TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT NOT NULL,
  total_points INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 이벤트 테이블
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  actual_gold TEXT,
  actual_silver TEXT,
  actual_bronze TEXT,
  is_completed BOOLEAN DEFAULT FALSE
);
```

---

### 3️⃣ Olympic Now - 심플한 정보 페이지

**페이지**: `/` (홈)

**주요 기능:**

1. **초고속 로딩**
   - 최소한의 JS 번들
   - 이미지 최적화 (Next.js Image)
   - 정적 생성 (ISR)
   - 목표: < 1초 로딩

2. **핵심 정보만**
   - 메달 순위 TOP 10
   - 오늘의 주요 일정
   - 최신 뉴스 3개
   - 한국 메달 현황

3. **깔끔한 디자인**
   - 미니멀 디자인
   - 명확한 계층 구조
   - 올림픽 브랜드 컬러 활용

4. **자동 업데이트**
   - 새로고침 없이 데이터 업데이트
   - 업데이트 알림 표시
   - 백그라운드 데이터 fetching

**UI/UX:**
- 심플한 레이아웃
- 빠른 네비게이션
- CTA 버튼 (Dashboard, Predict 이동)

---

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* 올림픽 테마 */
--primary: #0066CC (올림픽 블루)
--secondary: #FFD700 (금메달)
--accent: #E74C3C (레드)
--success: #27AE60 (그린)
--background: #FFFFFF / #1A1A1A (라이트/다크)
--text: #2C3E50 / #ECF0F1 (라이트/다크)

/* 메달 색상 */
--gold: linear-gradient(135deg, #FFD700, #FFA500)
--silver: linear-gradient(135deg, #C0C0C0, #A8A8A8)
--bronze: linear-gradient(135deg, #CD7F32, #A0522D)
```

### 타이포그래피
- **Heading**: Inter (Bold)
- **Body**: Inter (Regular/Medium)
- **Mono**: Fira Code (코드, 숫자)

### 컴포넌트
- 버튼 (Primary, Secondary, Ghost)
- 카드 (Info, Stats, Event)
- 배지 (Medal, Rank, Achievement)
- 차트 (Line, Bar, Pie)
- 모달 (예측 투표, 상세 정보)

---

## 📊 데이터 구조

### Mock 데이터 (개발 초기)

**국가별 메달**
```typescript
interface CountryMedal {
  rank: number;
  country: string;
  countryCode: string; // KR, US, CN 등
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  flag: string; // emoji 또는 이미지 URL
}
```

**종목별 일정**
```typescript
interface Event {
  id: string;
  sport: string; // "Figure Skating"
  event: string; // "Men's Single Free Skating"
  date: string; // ISO 8601
  venue: string;
  status: "upcoming" | "live" | "completed";
  medalists?: {
    gold: string; // 선수명 또는 국가
    silver: string;
    bronze: string;
  };
}
```

**한국 선수**
```typescript
interface KoreanAthlete {
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
```

---

## 🚀 개발 우선순위

### Phase 1: MVP (1주)
1. ✅ Next.js 프로젝트 생성
2. ✅ 디자인 시스템 구축 (Tailwind 설정)
3. ✅ Olympic Now (홈) 페이지
4. ✅ Mock 데이터 생성
5. ✅ 기본 메달 집계 표시

### Phase 2: 핵심 기능 (1주)
1. ✅ Olympic Pulse 대시보드
2. ✅ 실시간 메달 카운터
3. ✅ 한국 선수 스포트라이트
4. ✅ 반응형 디자인

### Phase 3: 게임화 (추가)
1. ✅ Medal Race 예측 게임
2. ✅ Supabase 연동
3. ✅ 투표 시스템
4. ✅ 리더보드

### Phase 4: 폴리싱 (Gold 퀄리티)
1. ✅ 다크모드
2. ✅ 애니메이션 (Framer Motion)
3. ✅ SEO 최적화
4. ✅ 성능 최적화
5. ✅ 접근성
6. ✅ OG 이미지 생성 (나노바나나)

---

## 🎨 이미지 요구사항 (나노바나나)

### 필요한 이미지:

1. **OG 이미지** (1200x630)
   - 올림픽 로고 + "Olympic Hub" 타이틀
   - 밀라노-코르티나 랜드마크
   - 동계 스포츠 이미지

2. **히어로 이미지** (1920x1080)
   - 올림픽 스타디움
   - 스키, 스케이트 등 동계 스포츠

3. **종목 아이콘** (512x512, 16개)
   - 쇼트트랙, 스피드스케이팅, 피겨, 루지, 봅슬레이 등

4. **배지 이미지** (256x256, 10개)
   - 예측왕, 연속 적중, 완벽 예측 등

**생성 방식:**
- 브라우저 가능 → nano-banana-web (무료)
- API 필요 → nano-banana-pro API

---

## 📱 반응형 브레이크포인트

```css
/* Mobile First */
- xs: 320px (모바일)
- sm: 640px (큰 모바일)
- md: 768px (태블릿)
- lg: 1024px (작은 데스크톱)
- xl: 1280px (데스크톱)
- 2xl: 1536px (큰 데스크톱)
```

---

## 🔒 보안 & 성능

### 보안
- [ ] 환경변수 관리 (.env.local)
- [ ] CORS 설정
- [ ] Rate Limiting (API 호출)
- [ ] Input Validation (투표 시스템)

### 성능
- [ ] 이미지 최적화 (Next.js Image)
- [ ] Code Splitting
- [ ] Lazy Loading
- [ ] Caching (ISR)
- [ ] Lighthouse 점수 90+ 목표

---

## 📈 성공 지표

### 기술적 지표
- **로딩 속도**: < 1초 (FCP)
- **Lighthouse 점수**: 90+ (모든 카테고리)
- **반응형**: 100% (모든 디바이스)
- **접근성**: WCAG 2.1 AA

### 사용자 지표
- **일일 방문자**: 1,000+ (목표)
- **체류 시간**: 3분+ (평균)
- **투표 참여율**: 30%+
- **공유율**: 10%+

### 바이럴 가능성
- **소셜 공유 버튼**: ✅
- **재미 요소 (게임)**: ✅
- **실시간 업데이트**: ✅
- **한국 선수 집중**: ✅ (국내 타겟)

---

## 🛠️ 개발 환경 설정

### 필수 도구
- Node.js 18+
- pnpm (패키지 매니저)
- Supabase CLI
- Vercel CLI

### 환경변수
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google Trends (선택사항)
GOOGLE_TRENDS_API_KEY=

# 기타
NEXT_PUBLIC_SITE_URL=https://olympic-hub.naroo.app
```

---

## 📦 배포 체크리스트

- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 없음
- [ ] 모든 페이지 테스트 완료
- [ ] 모바일 테스트 완료
- [ ] 다크모드 테스트 완료
- [ ] SEO 메타 태그 확인
- [ ] OG 이미지 확인
- [ ] robots.txt, sitemap.xml 생성
- [ ] 환경변수 설정 (Vercel)
- [ ] 도메인 연결 (*.naroo.app)
- [ ] SSL 인증서 확인
- [ ] 성능 최적화 (Lighthouse)

---

## 🎯 최종 목표

**"오, 잘 만들었네?"**

사용자가 첫 방문에서 이렇게 생각하도록:
1. 빠르다 (< 1초)
2. 예쁘다 (Gold 디자인)
3. 편하다 (직관적 UX)
4. 재밌다 (예측 게임)
5. 유용하다 (실시간 정보)

---

**문서 작성일**: 2026-02-07
**작성자**: 고래등 🐋
**목표 완료일**: 2026-02-14 (1주 이내)
