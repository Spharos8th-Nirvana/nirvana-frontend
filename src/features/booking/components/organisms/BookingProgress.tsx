import Link from "next/link";

const steps = ["날짜·인원 선택", "예약 정보 입력", "결제 확인"];

type BookingProgressProps = {
  /** 현재 단계 (1부터) */
  currentStep: number;
  /** 끝난 단계로 돌아가는 주소. 키는 단계 번호 */
  stepHrefs?: Partial<Record<number, string>>;
};

/** 예약 진행 단계 (01 · 02 · 03). 끝난 단계는 눌러서 돌아갈 수 있습니다. */
export default function BookingProgress({ currentStep, stepHrefs = {} }: BookingProgressProps) {
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="예약 진행 단계">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isDone = step < currentStep;
        const href = isDone ? stepHrefs[step] : undefined;
        const number = String(step).padStart(2, "0");

        const content = (
          <>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] ${
                isCurrent ? "bg-action text-primary" : isDone ? "bg-primary text-white" : "bg-subtle text-ink"
              }`}
            >
              {isDone ? <span aria-hidden="true">✓</span> : number}
            </span>
            <span className="flex-1">
              {isDone && <span className="sr-only">{number} 완료: </span>}
              {label}
            </span>
            {href && (
              <span className="flex items-center gap-1 text-xs font-medium text-muted transition-colors group-hover:text-primary">
                <span aria-hidden="true">←</span>
                변경
              </span>
            )}
          </>
        );

        const baseClass =
          "flex h-[52px] items-center gap-3 rounded-full border px-4 text-sm font-bold";

        return (
          <li key={label} aria-current={isCurrent ? "step" : undefined}>
            {href ? (
              <Link
                href={href}
                className={`group ${baseClass} border-border bg-subtle text-ink transition-colors hover:border-primary hover:bg-white`}
              >
                {content}
              </Link>
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
