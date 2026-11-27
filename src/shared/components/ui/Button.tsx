import type { ButtonHTMLAttributes } from "react";

/**
 * 라임 주요 버튼 (Figma action/primary)
 * 한 화면에서 가장 중요한 행동 하나(다음 단계로, 결제하기 등)에만 씁니다.
 *
 * 사용 예:
 *   <Button onClick={handleNext} disabled={!canNext} className="mt-6 w-full">
 *     다음 단계 <span aria-hidden="true">→</span>
 *   </Button>
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** 주요 버튼 모양. 링크(<Link>)를 버튼처럼 보이게 할 때도 씁니다. */
export const primaryButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full bg-action px-6 py-4 font-bold text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40";

export default function Button({ type = "button", className = "", ...props }: ButtonProps) {
  return <button type={type} className={`${primaryButtonClassName} ${className}`} {...props} />;
}
