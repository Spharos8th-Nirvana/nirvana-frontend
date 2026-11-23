export type Temple = {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  introduction: string;
  directions: string;
  tags: string[];
};

export const temples: Temple[] = [
  {
    id: 1,
    name: "해인사",
    description: "가야산 자락에 자리한 고즈넉한 사찰에서 특별한 시간을 보내세요.",
    address: "",
    phone: "",
    introduction: "가야산 자락에 자리한 해인사에 대한 상세 소개글입니다.",
    directions: "",
    tags: ["명상 체험", "템플스테이", "힐링"],
  },
  {
    id: 2,
    name: "불국사",
    description: "한국 전통 건축의 아름다움과 사찰의 여유를 경험해 보세요.",
    address: "",
    phone: "",
    introduction: "한국 전통 건축의 아름다움을 간직한 불국사에 대한 상세 소개글입니다.",
    directions: "",
    tags: ["문화 체험", "역사 체험", "유적"],
  },
  {
    id: 3,
    name: "화엄사",
    description: "지리산의 풍경과 함께 자연 속에서 마음의 여유를 찾아보세요.",
    address: "",
    phone: "",
    introduction: "지리산 자락에 자리한 화엄사에 대한 상세 소개글입니다.",
    directions: "",
    tags: ["자연 체험", "명상", "휴식"],
  },
];
