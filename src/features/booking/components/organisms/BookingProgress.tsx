import Link from "next/link";

const steps = ["날짜·인원 선택", "예약 정보 입력", "결제 확인"];

type BookingProgressProps = {
  /** 현재 단계 (1부터) */
  currentStep: number;
  /** 끝난 단계로 돌아가는 주소. 키는 단계 번호 */
  stepHrefs?: Partial<Record<number, string>>;
  /** 이전 단계로 이동하기 전에 확인창을 표시합니다. */
  onBeforeNavigate?: () => boolean;
  /** 주소 없이 화면 안에서 이전 단계로 돌아갈 때 (예: 3단계 → 2단계) */
  onStepClick?: (step: number) => void;
};

/** 예약 진행 단계 (01 · 02 · 03). 끝난 단계는 눌러서 돌아갈 수 있습니다. */
export default function BookingProgress({
  currentStep,
  stepHrefs = {},
  onBeforeNavigate,
  onStepClick,
}: BookingProgressProps) {
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="예약 진행 단계">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isDone = step < currentStep;
        // 바로 이전 단계만 돌아갈 수 있습니다. (주소가 있으면 링크, 없으면 화면 안 버튼)
        const isPrevious = step === currentStep - 1;
        const href = isPrevious ? stepHrefs[step] : undefined;
        const canClick = isPrevious && !href && Boolean(onStepClick);
        const number = String(step).padStart(2, "0");

        const content = (
          <>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] ${
                isCurrent
                  ? "bg-action text-primary"
                  : isDone
                    ? "bg-primary text-white"
                    : "bg-subtle text-ink"
              }`}
            >
              {isDone ? <span aria-hidden="true">✓</span> : number}
            </span>
            <span className="flex-1">
              {isDone && <span className="sr-only">{number} 완료: </span>}
              {label}
            </span>
            {(href || canClick) && (
              <span className="text-xs font-medium text-muted transition-colors group-hover:text-primary">
                변경
              </span>
            )}
          </>
        );

        const baseClass =
          "flex h-[52px] items-center gap-3 rounded-full border px-4 text-sm font-bold";

        const clickableClass = `group ${baseClass} w-full border-border bg-subtle text-left text-ink transition-colors hover:border-primary hover:bg-white`;

        return (
          <li key={label} aria-current={isCurrent ? "step" : undefined}>
            {href ? (
              <Link
                href={href}
                onClick={(event) => {
                  // 확인창에서 취소를 누르면 이전 화면으로 이동하지 않음
                  if (onBeforeNavigate && !onBeforeNavigate()) {
                    event.preventDefault();
                  }
                }}
                className={clickableClass}
              >
                {content}
              </Link>
            ) : canClick ? (
              <button type="button" onClick={() => onStepClick?.(step)} className={clickableClass}>
                {content}
              </button>
            ) : (
              <div
                className={`${baseClass} ${
                  isCurrent
                    ? "border-primary bg-primary text-white"
                    : isDone
                      ? "border-subtle bg-subtle text-ink"
                      : "border-border bg-white text-muted"
                }`}
              >
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
