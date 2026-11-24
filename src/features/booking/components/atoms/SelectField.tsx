import type { SelectHTMLAttributes } from "react";
import { inputClassName } from "@/features/booking/components/atoms/FormField";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** 감싸는 영역에 줄 클래스 (너비 등) */
  wrapperClassName?: string;
};

/**
 * 화살표 위치를 맞춘 선택박스.
 * 브라우저 기본 화살표는 오른쪽 끝에 붙어 위치를 조절할 수 없어서,
 * 기본 화살표를 숨기고 안쪽 여백을 둔 아이콘을 대신 그립니다.
 */
export default function SelectField({
  wrapperClassName = "",
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`${inputClassName} cursor-pointer appearance-none truncate pr-9 ${className}`}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
