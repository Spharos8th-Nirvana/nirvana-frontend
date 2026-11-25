import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/shared/components/ui/Icons";

/**
 * 공통 선택박스 (서비스 표준: 화살표를 오른쪽 끝이 아니라 안쪽에 둠)
 * 브라우저 기본 화살표는 위치를 조절할 수 없어서 숨기고, 공통 아이콘으로 대신 그립니다.
 *
 * 사용 예:
 *   <SelectField value={v} onChange={…}>…</SelectField>                     // 흰 바탕 입력칸 (기본)
 *   <SelectField surface="subtle" …>…</SelectField>                          // 폼 안의 연한 바탕 입력칸
 *   <SelectField variant="bare" className="text-muted" …>…</SelectField>     // 검색바 안 (테두리·배경 없음)
 */
type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** 모양: box(테두리 있는 입력칸, 기본) / bare(검색바 안, 테두리·배경 없음) */
  variant?: "box" | "bare";
  /** box 모양의 바탕색: white(흰색, 기본) / subtle(폼 안의 연한 바탕) */
  surface?: "white" | "subtle";
  /** 선택박스를 감싸는 영역에 줄 클래스 (너비, 여백 등) */
  wrapperClassName?: string;
};

/** 두 모양이 함께 쓰는 기본 스타일 */
const baseClassName =
  "w-full min-w-0 cursor-pointer appearance-none truncate text-sm outline-none disabled:cursor-not-allowed";

/** box: 테두리 있는 입력칸 (오른쪽 pr-9는 화살표 자리) */
const boxClassName =
  "h-12 rounded-md border border-border px-3 pr-9 text-ink transition-colors focus:border-primary aria-[invalid=true]:border-error disabled:bg-subtle disabled:text-muted";

/** box의 바탕색 */
const surfaceClassNames = {
  white: "bg-white",
  subtle: "bg-background",
};

/** bare: 테두리·배경 없음 (글자색은 쓰는 쪽에서 className으로) */
const bareClassName = "bg-transparent pr-7";

export default function SelectField({
  variant = "box",
  surface = "white",
  wrapperClassName = "",
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  const variantClassName =
    variant === "box" ? `${boxClassName} ${surfaceClassNames[surface]}` : bareClassName;

  return (
    <div className={`relative ${wrapperClassName}`}>
      <select {...props} className={`${baseClassName} ${variantClassName} ${className}`}>
        {children}
      </select>
      <ChevronDownIcon
        size={16}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
          variant === "box" ? "right-3" : "right-0"
        }`}
      />
    </div>
  );
}
