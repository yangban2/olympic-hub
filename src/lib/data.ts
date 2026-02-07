// 실제 Olympic 데이터 + Mock 데이터
// 실제 메달 데이터는 /public/data/medals.json에서 로드

import type { CountryMedal, Event, KoreanAthlete, Highlight, Badge } from "@/types";

// 🎯 실제 메달 데이터는 fetchMedalData() 사용
// 이 파일은 fallback & 기타 데이터만 제공
export const medalStandings: CountryMedal[] = [];

// 한국 메달 초기값 (fallback)
export const koreaInitialData: CountryMedal = {
  rank: 0,
  country: "South Korea",
  countryCode: "KR",
  gold: 0,
  silver: 0,
  bronze: 0,
  total: 0,
  flag: "🇰🇷",
};

export const upcomingEvents: Event[] = [
  {
    id: "evt-001",
    sport: "Short Track",
    event: "Women's 1500m Final",
    date: "2026-02-07T19:30:00+01:00",
    venue: "Palazzo Italia",
    status: "upcoming",
  },
  {
    id: "evt-002",
    sport: "Figure Skating",
    event: "Men's Free Skating",
    date: "2026-02-08T10:00:00+01:00",
    venue: "Mediolanum Forum",
    status: "upcoming",
  },
  {
    id: "evt-003",
    sport: "Speed Skating",
    event: "Women's 1000m",
    date: "2026-02-08T15:00:00+01:00",
    venue: "PalaItalia",
    status: "upcoming",
  },
  {
    id: "evt-004",
    sport: "Ski Jumping",
    event: "Men's Large Hill Individual",
    date: "2026-02-09T11:00:00+01:00",
    venue: "Cortina Ski Jump",
    status: "upcoming",
  },
  {
    id: "evt-005",
    sport: "Cross-Country Skiing",
    event: "Women's 10km + 10km Skiathlon",
    date: "2026-02-07T21:00:00+01:00",
    venue: "Tesero Cross-Country Ski Stadium",
    status: "upcoming",
  },
  {
    id: "evt-006",
    sport: "Curling",
    event: "Mixed Doubles Round Robin - KOR vs CZE",
    date: "2026-02-07T22:35:00+01:00",
    venue: "Cortina Curling Olympic",
    status: "upcoming",
  },
];

export const completedEvents: Event[] = [
  // 아직 완료된 경기 없음
];

export const koreanAthletes: KoreanAthlete[] = [
  {
    name: "황대헌",
    sport: "Short Track",
    events: ["Men's 1500m", "Men's 1000m", "Men's Relay"],
    bio: "2022 베이징 올림픽 금메달리스트",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  {
    name: "최민정",
    sport: "Short Track",
    events: ["Women's 1500m", "Women's 1000m", "Women's Relay"],
    bio: "4회 연속 올림픽 출전, 다관왕 후보",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  {
    name: "차준환",
    sport: "Figure Skating",
    events: ["Men's Single"],
    bio: "한국 피겨 간판 선수",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  {
    name: "김민석",
    sport: "Speed Skating",
    events: ["Men's 1500m", "Men's Team Pursuit"],
    bio: "빙속 유망주",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  {
    name: "이의진",
    sport: "Cross-Country Skiing",
    events: ["Women's 10km + 10km Skiathlon"],
    bio: "크로스컨트리 국가대표",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  {
    name: "한다솜",
    sport: "Cross-Country Skiing",
    events: ["Women's 10km + 10km Skiathlon"],
    bio: "크로스컨트리 국가대표",
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
];

export const highlights: Highlight[] = [
  {
    id: "hl-001",
    title: "🎿 2026 밀라노-코르티나 동계올림픽 개막!",
    description: "17일간의 열전이 시작되었습니다. 한국 선수단의 목표는 금메달 3개 이상, 종합 순위 TOP 10!",
    sport: "Overall",
    date: "2026-02-06T20:00:00+01:00",
  },
  {
    id: "hl-002",
    title: "오늘(2/7) 첫 메달 경기 시작!",
    description: "크로스컨트리 여자 스키애슬론에서 첫 금메달이 나옵니다. 한국 선수 이의진, 한다솜 출전!",
    sport: "Cross-Country Skiing",
    date: "2026-02-07T12:00:00+01:00",
  },
  {
    id: "hl-003",
    title: "황대헌·최민정, 쇼트트랙 금메달 사냥 시작",
    description: "한국 쇼트트랙의 에이스들이 메달 레이스에 나섭니다. 첫 경기는 2월 7일 저녁!",
    sport: "Short Track",
    date: "2026-02-07T14:00:00+01:00",
  },
];

export const badges: Badge[] = [
  {
    id: "badge-001",
    name: "예측왕 👑",
    description: "10개 이상의 메달을 정확히 예측",
    icon: "👑",
    rarity: "legendary",
  },
  {
    id: "badge-002",
    name: "완벽 예측 💯",
    description: "금-은-동 모두 정확히 맞춤",
    icon: "💯",
    rarity: "epic",
  },
  {
    id: "badge-003",
    name: "연속 적중 🔥",
    description: "5개 연속 예측 성공",
    icon: "🔥",
    rarity: "rare",
  },
  {
    id: "badge-004",
    name: "초보 예측가 🌱",
    description: "첫 예측 성공",
    icon: "🌱",
    rarity: "common",
  },
  {
    id: "badge-005",
    name: "얼리버드 🐦",
    description: "개막 첫날 예측 참여",
    icon: "🐦",
    rarity: "rare",
  },
];

// 예상 메달 순위 (과거 대회 기반)
export const expectedMedalStandings: CountryMedal[] = [
  { rank: 1, country: "Norway", countryCode: "NO", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇳🇴" },
  { rank: 2, country: "Germany", countryCode: "DE", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇩🇪" },
  { rank: 3, country: "United States", countryCode: "US", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇺🇸" },
  { rank: 4, country: "Sweden", countryCode: "SE", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇸🇪" },
  { rank: 5, country: "Austria", countryCode: "AT", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇦🇹" },
  { rank: 6, country: "South Korea", countryCode: "KR", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇰🇷" },
  { rank: 7, country: "Canada", countryCode: "CA", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇨🇦" },
  { rank: 8, country: "Switzerland", countryCode: "CH", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇨🇭" },
  { rank: 9, country: "France", countryCode: "FR", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇫🇷" },
  { rank: 10, country: "Netherlands", countryCode: "NL", gold: 0, silver: 0, bronze: 0, total: 0, flag: "🇳🇱" },
];
