import type { ReactNode } from "react";

/** 예약 입력 칸 공통 스타일 */
export const inputClassName =
  "h-12 w-full rounded-md border border-border bg-background px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-primary aria-[invalid=true]:border-error disabled:cursor-not-allowed disabled:bg-subtle disabled:text-muted";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/** 라벨, 필수 표시, 안내 문구, 오류 문구를 묶은 입력 칸 */
export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-label-13 font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-muted/70">(선택)</span>
        )}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted/70">{hint}</p>
      )}
    </div>
  );
}
