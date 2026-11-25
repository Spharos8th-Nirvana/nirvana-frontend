/**
 * 홈 시안(app.js)에 있는 예시 문구와 사진만 모았습니다.
 * 목록·상세가 쓰는 programs.ts 는 바꾸지 않습니다.
 */

export const homeImages = {
  c1: "/images/photo-d3efcceb6769df7e.jpg",
  c2: "/images/photo-007650ba3dc369ab.jpg",
  c3: "/images/photo-4e626f2ed623aa2e.jpg",
  c4: "/images/photo-a9b04c62aadea91c.jpg",
  t1: "/images/photo-fe525463d346dbd5.jpg",
  t2: "/images/photo-d32fe5eecc35c02c.jpg",
  t3: "/images/photo-f35e5aa698c99a8a.jpg",
  a1: "/images/photo-84d4d4aa801678ba.jpg",
  a2: "/images/photo-30d00b5d0872922b.jpg",
  a3: "/images/photo-ce906328efd56856.jpg",
  tea: "/images/photo-1f2cd05c6f795126.jpg",
  event: "/images/photo-19aa895269a397a6.jpg",
} as const;

export const homeCategories = ["전체", "템플스테이", "사찰음식", "선무도", "명상"] as const;

export type HomeProgram = {
  id: number;
  cat: string;
  title: string;
  desc: string;
  temple: string;
  region: string;
  price: number;
  favoriteCount: number;
  badge: string;
  img: string;
};

/** 시안 PROGRAMS. 홈은 찜 수 상위 3개만 보여 줍니다. */
export const homePrograms: HomeProgram[] = [
  {
    id: 1,
    cat: "템플스테이",
    title: "마음 비우기 2박 3일 템플스테이",
    desc: "고요한 산사에서 온전히 나를 마주하는 쉼의 시간",
    temple: "해인사",
    region: "경남 합천",
    price: 120000,
    favoriteCount: 128,
    badge: "2박 3일",
    img: homeImages.c1,
  },
  {
    id: 2,
    cat: "사찰음식",
    title: "사찰음식 체험 클래스",
    desc: "자연의 맛으로 마음을 다스리는 사찰음식 만들기",
    temple: "금산사",
    region: "전북 김제",
    price: 45000,
    favoriteCount: 96,
    badge: "당일 체험",
    img: homeImages.c2,
  },
  {
    id: 3,
    cat: "선무도",
    title: "몸과 마음을 깨우는 선무도",
    desc: "호흡과 움직임으로 균형을 찾는 전통 수행 체험",
    temple: "화엄사",
    region: "전남 구례",
    price: 60000,
    favoriteCount: 181,
    badge: "1박 2일",
    img: homeImages.c3,
  },
  {
    id: 4,
    cat: "명상",
    title: "고요한 집중, 명상 리트릿",
    desc: "차분한 호흡으로 일상의 번잡함을 내려놓는 명상",
    temple: "불국사",
    region: "경북 경주",
    price: 80000,
    favoriteCount: 64,
    badge: "1박 2일",
    img: homeImages.c4,
  },
  {
    id: 5,
    cat: "템플스테이",
    title: "숲길 걷기와 다도, 반나절 쉼",
    desc: "숲길을 천천히 걷고 차 한 잔으로 마무리하는 당일 쉼",
    temple: "해인사",
    region: "경남 합천",
    price: 40000,
    favoriteCount: 72,
    badge: "당일 체험",
    img: homeImages.tea,
  },
  {
    id: 6,
    cat: "템플스테이",
    title: "새벽 예불과 함께하는 1박 2일",
    desc: "새벽 예불의 고요함을 경험하는 사찰의 하루",
    temple: "불국사",
    region: "경북 경주",
    price: 70000,
    favoriteCount: 146,
    badge: "1박 2일",
    img: homeImages.t2,
  },
  {
    id: 7,
    cat: "명상",
    title: "지리산 품에서 쉬어 가기",
    desc: "정해진 일정 없이 머무르며 나만의 속도로 쉬는 시간",
    temple: "화엄사",
    region: "전남 구례",
    price: 65000,
    favoriteCount: 110,
    badge: "1박 2일",
    img: homeImages.t3,
  },
  {
    id: 8,
    cat: "사찰음식",
    title: "제철 나물로 차리는 발우공양",
    desc: "발우공양의 의미를 배우고 제철 음식을 함께 나눠요",
    temple: "금산사",
    region: "전북 김제",
    price: 55000,
    favoriteCount: 55,
    badge: "당일 체험",
    img: homeImages.c2,
  },
  {
    id: 9,
    cat: "선무도",
    title: "가족과 함께하는 선무도 입문",
    desc: "아이와 함께 기본 동작을 배우는 가족 체험",
    temple: "불국사",
    region: "경북 경주",
    price: 50000,
    favoriteCount: 83,
    badge: "당일 체험",
    img: homeImages.c3,
  },
];

export type HomeTemple = {
  id: number;
  name: string;
  region: string;
  desc: string;
  img: string;
  fav: number;
  tags: string[];
};

/** 시안 추천 사찰. 관심 수 상위 3곳만 홈에 나옵니다. */
export const homeTemples: HomeTemple[] = [
  {
    id: 1,
    name: "해인사",
    region: "경남 합천",
    desc: "팔만대장경의 보금자리이자, 깊은 수행의 정신이 살아 있는 사찰입니다.",
    img: homeImages.t1,
    fav: 204,
    tags: ["팔만대장경", "숙박형"],
  },
  {
    id: 2,
    name: "불국사",
    region: "경북 경주",
    desc: "천년의 역사와 아름다운 문화유산이 어우러진 신라의 대표 사찰입니다.",
    img: homeImages.t2,
    fav: 287,
    tags: ["세계유산", "새벽 예불"],
  },
  {
    id: 3,
    name: "화엄사",
    region: "전남 구례",
    desc: "지리산의 품에 안긴, 화엄사상의 깊이를 느낄 수 있는 사찰입니다.",
    img: homeImages.t3,
    fav: 176,
    tags: ["지리산", "휴식형"],
  },
];

export const homeReviews = [
  {
    id: 1,
    quote: "조용한 산사에서 보낸 이틀이 생각보다 더 큰 쉼이 되었어요. 마음이 한결 가벼워졌습니다.",
    name: "김OO",
    prog: "템플스테이 (해인사)",
    rate: 5,
    img: homeImages.a1,
  },
  {
    id: 2,
    quote: "사찰음식을 직접 만들어보고 그 의미도 들을 수 있어 정말 뜻깊은 경험이었습니다.",
    name: "박OO",
    prog: "사찰음식 체험 (금산사)",
    rate: 5,
    img: homeImages.a2,
  },
  {
    id: 3,
    quote: "아침 예불과 명상 시간에 오랜만에 온전히 나에게 집중할 수 있어서 마음이 편안했어요.",
    name: "이OO",
    prog: "명상 리트릿 (불국사)",
    rate: 5,
    img: homeImages.a3,
  },
];

export const homeNotices = [
  { id: 1, tag: "중요", title: "연말 사찰 프로그램 운영 일정 안내", date: "2026.11.20" },
  { id: 2, tag: "공지", title: "겨울철 사찰 방문 시 유의사항 안내", date: "2026.11.15" },
  { id: 3, tag: "공지", title: "2027년 상반기 템플스테이 예약 오픈 안내", date: "2026.11.10" },
  { id: 4, tag: "안내", title: "NirVaNa 서비스 이용 안내", date: "2026.11.01" },
];

export const homeFaqs = [
  {
    q: "한국어를 못해도 참여할 수 있나요?",
    a: "외국어 안내를 지원하는 사찰과 프로그램이 있어요. 프로그램 상세 화면의 '외국어 지원' 표시를 확인해 주세요.",
  },
  {
    q: "요금에는 무엇이 포함되어 있나요?",
    a: "프로그램마다 달라요. 보통 숙박, 공양(식사), 체험 활동이 포함되며 상세 화면의 '참가비용' 탭에서 확인할 수 있어요.",
  },
  {
    q: "무엇을 준비해야 하나요?",
    a: "편한 옷과 개인 세면도구를 챙겨 주세요. 수련복은 대부분 사찰에서 빌려줘요.",
  },
  {
    q: "예약을 변경하거나 취소할 수 있나요?",
    a: "마이페이지의 예약 내역에서 할 수 있어요. 이용일까지 남은 기간에 따라 환불 비율이 달라져요.",
  },
];
