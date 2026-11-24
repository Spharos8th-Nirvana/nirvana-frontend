/**
 * 프로그램 분류 코드. DB nirvana_program.programs.category 와 같은 값입니다.
 * 숙박형(OVERNIGHT)은 참가자 성별을 필수로 받습니다.
 */
export type ProgramCategoryCode = "OVERNIGHT" | "DAY" | "EXPERIENCE" | "REST";

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
  image: string;
  languageSupport: boolean;
  date: string;
  summary: string;
  contactEmail: string;
  templeAddress: string;
  templePhone: string;
  description: string;
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
    languageSupport: true,
    date: "매주 토요일",
    summary: "새벽 예불과 명상을 통해 바쁜 일상에서 벗어나 마음의 평화를 찾아보는 시간입니다.",
    contactEmail: "haeinsa@example.com",
    templeAddress: "경상남도 합천군 가야면 (임시 주소)",
    templePhone: "055-000-0001",
    description: "새벽 숲길을 걸으며 명상과 휴식을 경험하는 프로그램입니다.",
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
    languageSupport: false,
    date: "매주 토요일",
    summary: "사찰음식을 직접 만들고 맛보며 자연의 재료가 가진 소중함을 경험합니다.",
    contactEmail: "bulguksa@example.com",
    templeAddress: "경상북도 경주시 진현동 (임시 주소)",
    templePhone: "054-000-0002",
    description: "사찰음식의 의미를 배우고 직접 만들어 보는 체험 프로그램입니다.",
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
    languageSupport: true,
    date: "매주 토요일",
    summary: "몸의 움직임과 호흡을 통해 몸과 마음의 균형을 찾아가는 프로그램입니다.",
    contactEmail: "hwasomsa@example.com",
    templeAddress: "전라남도 구례군 마산면 (임시 주소)",
    templePhone: "061-000-0003",
    description: "호흡과 동작을 익히며 몸과 마음을 수련하는 선무도 체험 프로그램입니다.",
  },
];
