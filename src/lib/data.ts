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
    sport: "Alpine Skiing",
    event: "Men's Downhill Final 🥇",
    date: "2026-02-07T11:30:00+01:00",
    venue: "Bormio Ski Area",
    status: "completed",
  },
  {
    id: "evt-002",
    sport: "Cross-Country Skiing",
    event: "Women's 10km + 10km Skiathlon 🥇",
    date: "2026-02-07T13:00:00+01:00",
    venue: "Tesero Cross-Country Stadium",
    status: "completed",
  },
  {
    id: "evt-003",
    sport: "Speed Skating",
    event: "Women's 3000m Final 🥇",
    date: "2026-02-07T16:00:00+01:00",
    venue: "PalaItalia Santa Giulia",
    status: "upcoming",
  },
  {
    id: "evt-004",
    sport: "Ski Jumping",
    event: "Women's Normal Hill Final 🥇",
    date: "2026-02-07T17:45:00+01:00",
    venue: "Cortina Ski Jump",
    status: "upcoming",
  },
  {
    id: "evt-005",
    sport: "Snowboarding",
    event: "Men's Big Air Final 🥇",
    date: "2026-02-07T19:30:00+01:00",
    venue: "Milan Big Air",
    status: "upcoming",
  },
  {
    id: "evt-006",
    sport: "Ice Hockey",
    event: "Women's Group A - USA vs Finland",
    date: "2026-02-07T16:40:00+01:00",
    venue: "PalaItalia",
    status: "upcoming",
  },
  {
    id: "evt-007",
    sport: "Curling",
    event: "Mixed Doubles - KOR vs USA",
    date: "2026-02-07T14:35:00+01:00",
    venue: "Cortina Curling Stadium",
    status: "upcoming",
  },
  {
    id: "evt-008",
    sport: "Luge",
    event: "Men's Singles - Runs 1-2",
    date: "2026-02-07T17:00:00+01:00",
    venue: "Cortina Sliding Centre",
    status: "upcoming",
  },
  {
    id: "evt-009",
    sport: "Figure Skating",
    event: "Team Event - Men's Short Program",
    date: "2026-02-07T19:45:00+01:00",
    venue: "Mediolanum Forum",
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
    title: "🎿 밀라노-코르티나 개막식, 역사상 첫 이중 개최지 성료",
    description: "밀라노와 코르티나에서 동시 개최된 개막식. 마라이어 캐리, 안드레아 보첼리 공연으로 화려한 막 올림!",
    sport: "Opening Ceremony",
    date: "2026-02-06T20:00:00+01:00",
    link: "https://www.nbcnews.com/sports/olympics/live-blog/winter-olympics-2026-opening-ceremony-milan-live-updates-rcna257178",
  },
  {
    id: "hl-002",
    title: "🥇 스위스, 첫 금메달 획득!",
    description: "남자 알파인스키 활강에서 스위스가 첫 금메달을 차지했습니다. 이탈리아는 은메달과 동메달로 홈 관중을 열광시켰습니다.",
    sport: "Alpine Skiing",
    date: "2026-02-07T13:30:00+01:00",
    link: "https://www.olympics.com/en/milano-cortina-2026/medals",
  },
  {
    id: "hl-003",
    title: "🇰🇷 황대헌·최민정, 쇼트트랙 금메달 사냥 시작",
    description: "한국 쇼트트랙의 에이스들이 메달 레이스에 나섭니다. 첫 경기는 2월 7일 저녁!",
    sport: "Short Track",
    date: "2026-02-07T14:00:00+01:00",
    link: "https://www.olympics.com/en/milano-cortina-2026/schedule",
  },
  {
    id: "hl-004",
    title: "🏒 여자 아이스하키 예선 시작",
    description: "오늘부터 여자 아이스하키 예선 라운드가 본격 시작됩니다. 한국 대표팀도 출전합니다.",
    sport: "Ice Hockey",
    date: "2026-02-07T10:00:00+01:00",
    link: "https://apnews.com/hub/milan-cortina-2026-winter-olympics",
  },
  {
    id: "hl-005",
    title: "🕊️ 교황, 올림픽 평화 메시지 전달",
    description: "교황 레오 14세가 올림픽 선수들에게 축복 메시지를 전하고 세계 평화를 촉구했습니다.",
    sport: "Overall",
    date: "2026-02-06T18:00:00+01:00",
    link: "https://www.nbcolympics.com/news/live/opening-ceremony-live-updates-2026-winter-olympics-milan",
  },
  {
    id: "hl-006",
    title: "📺 역대 최대 규모 방송 중계",
    description: "OBS와 삼성전자가 협력하여 사상 최초로 다중 장소 개막식을 전 세계에 생중계했습니다.",
    sport: "Broadcasting",
    date: "2026-02-06T19:00:00+01:00",
    link: "https://www.olympics.com/ioc/milano-cortina-2026",
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
