import type { ReactNode, SVGProps } from "react";

/**
 * 공통 선 아이콘 (lucide 스타일)
 * 여러 기능에서 함께 쓰는 아이콘만 둡니다. 한 기능에서만 쓰는 아이콘은 그 기능 안에 둡니다.
 *
 * 사용 예:
 *   <SearchIcon size={21} className="text-primary" />   // 크기 21px, 딥 그린
 *   <CalendarIcon className="h-4 w-4 text-muted" />      // Tailwind로 크기 지정
 */
type IconProps = SVGProps<SVGSVGElement> & {
  /** 가로·세로 크기(px). className으로 h-·w-를 주면 그쪽이 우선합니다. */
  size?: number;
};

/** 모든 공통 아이콘이 함께 쓰는 틀: 24×24 그림, 선 굵기 2, 색은 글자색(currentColor)을 따름 */
function IconBase({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** 검색(돋보기) */
export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </IconBase>
  );
}

/** 달력 */
export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </IconBase>
  );
}

/** 사람(인원) */
export function UsersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}
