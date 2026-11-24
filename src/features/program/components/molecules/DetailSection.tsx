import type { ReactNode } from "react";

type DetailSectionProps = {
  /** 페이지 내 이동 메뉴가 찾아갈 id */
  id?: string;
  /** 제목 위 작은 머리글 (예: 가격) */
  eyebrow: string;
  /** 큰 제목 (예: 참가비용) */
  title: string;
  /** 제목 바로 옆에 붙는 요소 (예: 후기 개수 말풍선) */
  titleAddon?: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

/** 섹션 사이 점선 구분선 (5px 선 + 6px 간격, 가운데에 폭 90%) */
export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px w-[90%] bg-[repeating-linear-gradient(90deg,var(--color-sage-03)_0_5px,transparent_5px_11px)]"
    />
  );
}

/**
 * 프로그램 상세의 정보 섹션 (와이어프레임 기준)
 * 작은 머리글 → 큰 제목 → 설명 순서로, 카드 없이 글자 크기와 여백으로 섹션을 나눕니다.
 */
export default function DetailSection({
  id,
  eyebrow,
  title,
  titleAddon,
  description,
  children,
}: DetailSectionProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24">
      {/* 작은 머리글: 상단 분류 칩과 같은 라임 칩 */}
      <p className="inline-flex rounded-full bg-action px-3 py-1 text-xs font-bold text-primary">
        {eyebrow}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <h2 id={headingId} className="text-3xl font-bold text-ink">
          {title}
        </h2>
        {titleAddon}
      </div>
      <div className="mt-3 text-sm leading-6 text-ink/80">{description}</div>

      <div className="mt-10">{children}</div>
    </section>
  );
}
