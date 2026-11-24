import type { ReactNode } from "react";

type RefundRule = {
  deadlineDaysBefore: number;
  refundRate: number;
};

type ProgramGuideProps = {
  /** 이용 규칙 (운영자 입력, DB programs.rules) */
  rules: string;
  /** 준비물 (운영자 입력, DB에 없음) */
  preparation: string;
  /** 외국어 지원 여부 (운영자 입력, DB programs.languageSupport) */
  languageSupport: boolean;
  /** 사찰 취소·환불 규정 (운영자 입력, DB temple.cancellationPolicyRules) */
  refundRules: RefundRule[];
};

/** 운영자가 아직 입력하지 않은 항목에 보여줄 문구 */
const NOT_REGISTERED = "아직 등록되지 않았어요.";

/** 선 아이콘 공통 속성 (lucide 스타일) */
function GuideIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 shrink-0 text-ink"
    >
      {children}
    </svg>
  );
}

/** 사찰 지붕 */
const TempleIcon = () => (
  <GuideIcon>
    <path d="M2 9c3 0 6-2.5 10-6 4 3.5 7 6 10 6" />
    <path d="M5 9v3h14V9" />
    <path d="M3 15c3 0 5-1.5 9-3 4 1.5 6 3 9 3" />
    <path d="M6 15v6M18 15v6M10 21v-4h4v4M4 21h16" />
  </GuideIcon>
);

/** 옷 */
const ShirtIcon = () => (
  <GuideIcon>
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
  </GuideIcon>
);

/** 언어 */
const LanguagesIcon = () => (
  <GuideIcon>
    <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
  </GuideIcon>
);

/** 달력 (취소·환불) */
const CalendarIcon = () => (
  <GuideIcon>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M10 14l4 4M14 14l-4 4" />
  </GuideIcon>
);

type GuideItem = {
  key: string;
  icon: ReactNode;
  title: string;
  content: ReactNode;
};

function formatRefundRules(rules: RefundRule[]): string {
  return [...rules]
    .sort((a, b) => b.deadlineDaysBefore - a.deadlineDaysBefore)
    .map((rule) => {
      const when = rule.deadlineDaysBefore === 0 ? "이용일 당일" : `${rule.deadlineDaysBefore}일 전까지`;
      return `${when} ${rule.refundRate}% 환불`;
    })
    .join(" · ");
}

/**
 * 예약 전 확인 목록 (와이어프레임: 아이콘 + 굵은 제목 + 설명)
 * 내용은 모두 사찰 운영자가 입력하는 정보이며, 화면은 받은 값을 그리기만 합니다.
 */
export default function ProgramGuide({
  rules,
  preparation,
  languageSupport,
  refundRules,
}: ProgramGuideProps) {
  const items: GuideItem[] = [
    {
      key: "rules",
      icon: <TempleIcon />,
      title: "체험 규칙",
      content: rules.trim() || NOT_REGISTERED,
    },
    {
      key: "preparation",
      icon: <ShirtIcon />,
      title: "준비물",
      content: preparation.trim() || NOT_REGISTERED,
    },
    ...(languageSupport
      ? [
          {
            key: "language",
            icon: <LanguagesIcon />,
            title: "언어 지원",
            content: "외국어 안내가 제공됩니다. 지원 언어는 사찰에 문의해 주세요.",
          },
        ]
      : []),
    {
      key: "refund",
      icon: <CalendarIcon />,
      title: "취소 및 환불",
      content:
        refundRules.length > 0 ? formatRefundRules(refundRules) : "취소 및 환불 규정은 준비 중입니다.",
    },
  ];

  return (
    // 항목 사이 얇은 구분선 + 넉넉한 위아래 여백으로 항목을 나눕니다.
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li
          key={item.key}
          className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <div className="flex shrink-0 items-center gap-3 sm:w-44">
            {item.icon}
            <h3 className="text-lg font-bold text-ink">{item.title}</h3>
          </div>
          <p className="flex-1 whitespace-pre-line text-sm leading-6 text-ink/80">{item.content}</p>
        </li>
      ))}
    </ul>
  );
}
