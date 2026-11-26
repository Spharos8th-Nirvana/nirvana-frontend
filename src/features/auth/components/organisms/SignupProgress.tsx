const steps = ["약관 동의", "이메일 인증", "정보 입력"];

type SignupProgressProps = {
  /** 현재 단계 (1부터) */
  currentStep: number;
};

/** 회원가입 진행 단계 (01 · 02 · 03). 표시 전용입니다. */
export default function SignupProgress({ currentStep }: SignupProgressProps) {
  return (
    <ol className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="회원가입 진행 단계">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isDone = step < currentStep;
        const number = String(step).padStart(2, "0");

        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className={`flex h-12 items-center gap-3 rounded-full border px-3 text-xs font-bold sm:gap-5 sm:px-4 sm:text-sm ${
              isCurrent
                ? "border-primary bg-primary text-white"
                : isDone
                  ? "border-subtle bg-subtle text-ink"
                  : "border-border bg-white text-muted"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                isCurrent
                  ? "bg-action text-primary"
                  : isDone
                    ? "bg-primary text-white"
                    : "bg-subtle text-ink"
              }`}
            >
              {isDone ? <span aria-hidden="true">✓</span> : number}
            </span>
            <span className="truncate">
              {isDone && <span className="sr-only">{number} 완료: </span>}
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
