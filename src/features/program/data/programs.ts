/**
 * 프로그램 분류 코드. DB nirvana_program.programs.category 와 같은 값입니다.
 * 숙박형(OVERNIGHT)은 참가자 성별을 필수로 받습니다.
 */
export type ProgramCategoryCode = "OVERNIGHT" | "DAY" | "EXPERIENCE" | "REST";

/**
 * 하루 일정표 한 줄 (운영자 입력)
 * DB에 아직 없는 항목입니다. Backend에 programTimetables 테이블로 요청한 모양과 같습니다.
 * - 숙박형 등 시각이 정해진 일정: startTime(+ endTime)
 * - 하루 여러 회차인 당일형: 회차마다 시작 시각이 달라 startTime 없이 durationMinutes
 */
export type ProgramTimetableItem = {
  /** 몇째 날 (1부터). 당일 프로그램은 1 */
  dayNo: number;
  /** 같은 날 안에서의 순서 */
  sortOrder: number;
  /** 시작 시각 (HH:mm) */
  startTime?: string;
  /** 끝 시각 (HH:mm) */
  endTime?: string;
  /** 걸리는 시간(분) */
  durationMinutes?: number;
  /** 함께하는 일 */
  activity: string;
};

/**
 * 프로그램 (임시 데이터)
 *
 * 아래 항목 대부분은 사찰 운영자가 운영자 페이지에서 입력하는 정보입니다.
 * - DB에 있는 항목은 DB 컬럼 이름을 주석에 적었습니다.
 * - "DB에 없음"으로 표시한 항목은 Backend에 컬럼 추가를 요청해야 합니다.
 */
export type Program = {
  id: number;
  templeId: number;
  /** 화면 표시용 분류 이름 (예: 템플스테이) */
  category: string;
  categoryCode: ProgramCategoryCode;
  temple: string;
  name: string;
  /** 성인 1인 금액(원). DB programs.adultPrice */
  adultPrice: number;
  /** 청소년 1인 금액(원). DB programs.youthPrice */
  youthPrice: number;
  /**
   * 청소년 참여 허용 여부. 사찰이 프로그램마다 설정합니다.
   * 백엔드에 컬럼 추가를 요청한 상태라, 필드명은 API 확정 후 맞춥니다.
   */
  youthAllowed: boolean;
  /** 박수. 0이면 당일. DB programs.nights */
  nights: number;
  /** 대표 사진(썸네일). 목록 카드 등에 사용합니다. */
  image: string;
  /**
   * 상세 사진 목록. DB programMedia(sortOrder 순서)를 참고했습니다.
   * 첫 번째가 대표 사진이며, 상세 상단에 최대 3장을 보여줍니다.
   */
  gallery: string[];
  /** 외국어 지원 여부 (운영자 입력). DB programs.languageSupport */
  languageSupport: boolean;
  date: string;
  /** 사진 위 한 줄 소개 (운영자 입력). DB에 없음 */
  summary: string;
  /** 담당자 이메일 (운영자 입력). DB에 없음 */
  contactEmail: string;
  /** 사찰 주소. DB temples.address */
  templeAddress: string;
  /** 사찰 전화번호. DB temples.contactNumber */
  templePhone: string;
  /** 프로그램 소개 (운영자 입력). DB programs.description */
  description: string;
  /** 이용 규칙 (운영자 입력). DB programs.rules (필수) */
  rules: string;
  /** 준비물 (운영자 입력). DB에 없음 → Backend 요청 필요 */
  preparation: string;
  /** 하루 일정표 (운영자 입력). DB에 없음 → Backend 요청 필요 */
  timetable: ProgramTimetableItem[];
};

export const programs: Program[] = [
  {
    id: 1,
    templeId: 1,
    category: "템플스테이",
    categoryCode: "OVERNIGHT",
    temple: "해인사",
    name: "새벽 숲, 나를 깨우는 시간",
    adultPrice: 80000,
    youthPrice: 60000,
    youthAllowed: true,
    nights: 1,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    languageSupport: true,
    date: "매주 토요일",
    summary: "새벽 예불과 명상을 통해 바쁜 일상에서 벗어나 마음의 평화를 찾아보는 시간입니다.",
    contactEmail: "haeinsa@example.com",
    templeAddress: "경상남도 합천군 가야면 (임시 주소)",
    templePhone: "055-000-0001",
    description: "새벽 숲길을 걸으며 명상과 휴식을 경험하는 프로그램입니다.",
    rules: "사찰 내에서는 정숙을 유지하고, 스님의 안내에 따라 주세요.",
    preparation: "편한 복장과 양말을 준비하세요. 새벽에는 기온이 낮으니 따뜻한 옷을 챙기세요.",
    timetable: [
      { dayNo: 1, sortOrder: 1, startTime: "14:00", endTime: "15:00", activity: "도착 및 사찰 안내" },
      { dayNo: 1, sortOrder: 2, startTime: "17:00", endTime: "18:00", activity: "저녁 공양과 예불" },
      { dayNo: 2, sortOrder: 1, startTime: "04:30", endTime: "06:00", activity: "새벽 예불 · 숲길 명상" },
      { dayNo: 2, sortOrder: 2, startTime: "07:00", endTime: "10:00", activity: "아침 공양 · 자유 휴식 · 회향" },
    ],
  },
  {
    id: 2,
    templeId: 2,
    category: "사찰음식",
    categoryCode: "DAY",
    temple: "불국사",
    name: "스님과 함께 빚는 사찰의 맛",
    adultPrice: 45000,
    youthPrice: 35000,
    youthAllowed: false,
    nights: 0,
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
    gallery: [
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    ],
    languageSupport: false,
    date: "매주 토요일",
    summary: "사찰음식을 직접 만들고 맛보며 자연의 재료가 가진 소중함을 경험합니다.",
    contactEmail: "bulguksa@example.com",
    templeAddress: "경상북도 경주시 진현동 (임시 주소)",
    templePhone: "054-000-0002",
    description: "사찰음식의 의미를 배우고 직접 만들어 보는 체험 프로그램입니다.",
    rules: "공양 중에는 대화를 줄이고, 음식을 남기지 않도록 해 주세요.",
    preparation: "앞치마와 머리끈을 준비하세요. 조리 도구는 사찰에서 제공합니다.",
    // 하루 여러 회차(10:00, 13:00)라 시작 시각 대신 걸리는 시간으로 적습니다.
    timetable: [
      { dayNo: 1, sortOrder: 1, durationMinutes: 30, activity: "사찰음식 이야기" },
      { dayNo: 1, sortOrder: 2, durationMinutes: 90, activity: "사찰음식 만들기" },
      { dayNo: 1, sortOrder: 3, durationMinutes: 30, activity: "공양과 차담" },
    ],
  },
  {
    id: 3,
    templeId: 3,
    category: "선무도",
    categoryCode: "OVERNIGHT",
    temple: "화엄사",
    name: "몸과 마음을 잇는 선무도",
    adultPrice: 160000,
    youthPrice: 120000,
    youthAllowed: true,
    nights: 2,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
    ],
    languageSupport: true,
    date: "매주 토요일",
    summary: "몸의 움직임과 호흡을 통해 몸과 마음의 균형을 찾아가는 프로그램입니다.",
    contactEmail: "hwasomsa@example.com",
    templeAddress: "전라남도 구례군 마산면 (임시 주소)",
    templePhone: "061-000-0003",
    description: "호흡과 동작을 익히며 몸과 마음을 수련하는 선무도 체험 프로그램입니다.",
    rules: "수련 중에는 지도 스님의 안내에 따라 무리하지 않는 범위에서 참여해 주세요.",
    preparation: "움직이기 편한 옷과 개인 물병을 준비하세요.",
    timetable: [],
  },
  // 시안 휴식형. 분류명 "휴식형"과 코드 REST가 같은 체험 id(4, 7)를 가리킵니다.
  {
    id: 4,
    templeId: 2,
    category: "휴식형",
    categoryCode: "REST",
    temple: "불국사",
    name: "고요한 집중, 명상 리트릿",
    adultPrice: 80000,
    youthPrice: 60000,
    youthAllowed: true,
    nights: 1,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    languageSupport: true,
    date: "금·토·일",
    summary: "차분한 호흡으로 일상의 번잡함을 내려놓는 명상",
    contactEmail: "bulguksa@example.com",
    templeAddress: "경상북도 경주시 진현동 (임시 주소)",
    templePhone: "054-000-0002",
    description: "차분한 호흡으로 일상의 번잡함을 내려놓는 명상 프로그램입니다.",
    rules: "휴대폰은 무음으로 바꿔 주세요. 명상 시간에는 대화를 삼가요.",
    preparation: "오래 앉아도 허리와 무릎이 편한 옷을 입어요.",
    timetable: [
      { dayNo: 1, sortOrder: 1, startTime: "14:00", activity: "입소 · 안내" },
      { dayNo: 1, sortOrder: 2, startTime: "15:00", activity: "자유롭게 쉬기" },
      { dayNo: 1, sortOrder: 3, startTime: "17:30", activity: "저녁 공양" },
      { dayNo: 1, sortOrder: 4, startTime: "18:30", activity: "저녁 예불 (선택)" },
      { dayNo: 2, sortOrder: 1, startTime: "07:00", activity: "아침 공양" },
      { dayNo: 2, sortOrder: 2, startTime: "10:00", activity: "퇴소" },
    ],
  },
  {
    id: 7,
    templeId: 3,
    category: "휴식형",
    categoryCode: "REST",
    temple: "화엄사",
    name: "지리산 품에서 쉬어 가기",
    adultPrice: 65000,
    youthPrice: 45000,
    youthAllowed: true,
    nights: 1,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
    ],
    languageSupport: false,
    date: "금·토·일",
    summary: "정해진 일정 없이 머무르며 나만의 속도로 쉬는 시간",
    contactEmail: "hwasomsa@example.com",
    templeAddress: "전라남도 구례군 마산면 (임시 주소)",
    templePhone: "061-000-0003",
    description: "정해진 일정 없이 머무르며 나만의 속도로 쉬는 시간입니다.",
    rules: "공양 시간만 지키면 자유롭게 쉬어요.",
    preparation: "산책하기 편한 옷과 기온에 따라 걸칠 겉옷을 준비해요.",
    timetable: [
      { dayNo: 1, sortOrder: 1, startTime: "14:00", activity: "입소 · 안내" },
      { dayNo: 1, sortOrder: 2, startTime: "15:00", activity: "자유롭게 쉬기" },
      { dayNo: 1, sortOrder: 3, startTime: "17:30", activity: "저녁 공양" },
      { dayNo: 1, sortOrder: 4, startTime: "18:30", activity: "저녁 예불 (선택)" },
      { dayNo: 2, sortOrder: 1, startTime: "07:00", activity: "아침 공양" },
      { dayNo: 2, sortOrder: 2, startTime: "10:00", activity: "퇴소" },
    ],
  },
];
