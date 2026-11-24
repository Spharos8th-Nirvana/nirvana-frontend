"use client";

import type { MouseEvent } from "react";

type SectionNavItem = {
  /** 이동할 섹션의 id */
  id: string;
  label: string;
};

type ProgramSectionNavProps = {
  items: SectionNavItem[];
};

/**
 * 프로그램 상세의 페이지 내 이동 메뉴.
 * 누르면 해당 섹션으로 스크롤만 하고 브라우저 방문 기록은 남기지 않습니다.
 * (기록이 쌓이면 뒤로 가기를 눌렀을 때 이전 페이지가 아니라 메뉴 위치로 돌아갑니다.)
 */
export default function ProgramSectionNav({ items }: ProgramSectionNavProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    // 섹션의 scroll-margin(scroll-mt)과 전역 smooth 스크롤 설정을 그대로 따릅니다.
    target.scrollIntoView({ block: "start" });
  };

  return (
    <nav aria-label="프로그램 상세 메뉴" className="border-b border-border">
      <div className="flex items-center justify-start gap-8 overflow-x-auto px-4 py-5 md:gap-14 md:px-6">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
            // 헤더 메뉴와 같은 효과: 글자색 변경 + 가운데에서 펼쳐지는 밑줄 (키보드 포커스에도 적용)
            className="relative shrink-0 py-1 text-sm font-semibold text-ink transition-colors after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 after:ease-out hover:text-primary hover:after:left-0 hover:after:w-full focus-visible:text-primary focus-visible:outline-none focus-visible:after:left-0 focus-visible:after:w-full"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
