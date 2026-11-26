import { useRef } from "react";
import { useEmailVerification } from "@/features/auth/hooks/useEmailVerification";
import Button from "@/shared/components/ui/Button";
import FormField, { inputClassName } from "@/shared/components/ui/FormField";

type EmailVerificationStepProps = {
  initialEmail: string;
  onVerified: (email: string, verificationToken: string) => void;
  onBack: () => void;
};

/** 도움말 안 보조 버튼 (인증번호 다시 받기, 다른 이메일로 변경) */
const helpButtonClass =
  "h-11 flex-1 rounded-md border border-border bg-white px-4 text-sm font-bold text-ink transition-colors hover:border-primary hover:bg-subtle disabled:cursor-not-allowed disabled:text-muted disabled:hover:border-border disabled:hover:bg-white";

/** 이전 단계로 돌아가기 (예약 화면과 같은 모양) */
const backActionClass =
  "inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:bg-subtle";

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

/**
 * ② 이메일 인증.
 * 발송 전: 이메일 입력 → 인증번호 받기 / 발송 후: 이메일 고정, 인증번호 입력 → 다음
 * 재발송·이메일 변경은 "인증 메일을 받지 못하셨나요?" 안에 둡니다.
 */
export default function EmailVerificationStep({
  initialEmail,
  onVerified,
  onBack,
}: EmailVerificationStepProps) {
  const verification = useEmailVerification({ initialEmail, onVerified });
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isSending = verification.status === "sending";
  const isVerifying = verification.status === "verifying";
  const { isSent } = verification;

  function handleChangeEmail() {
    verification.resetEmail();
    emailInputRef.current?.focus();
  }

  return (
    <section aria-labelledby="signup-email-title">
      <h3 id="signup-email-title" className="text-2xl font-bold text-ink">
        이메일 인증
      </h3>
      <p className="mt-2 text-sm text-muted">
        {isSent
          ? "이메일로 받은 인증번호를 입력해 주세요."
          : "가입할 이메일로 인증번호를 보내 드려요. 이 이메일로 로그인하게 돼요."}
      </p>

      {/* 발송·재발송 안내를 화면 낭독기가 읽도록 */}
      <p className="sr-only" role="status">
        {verification.notice}
      </p>

      <div className="mt-8 space-y-8">
        <FormField label="이메일" htmlFor="signup-email" required error={verification.emailError}>
          <input
            ref={emailInputRef}
            id="signup-email"
            type="email"
            autoComplete="email"
            value={verification.email}
            onChange={(event) => verification.changeEmail(event.target.value)}
            readOnly={isSent}
            placeholder="이메일을 입력해 주세요"
            aria-invalid={Boolean(verification.emailError)}
            aria-describedby={verification.emailError ? "signup-email-error" : undefined}
            className={`${inputClassName} read-only:bg-subtle read-only:text-muted`}
          />
        </FormField>

        {isSent && (
          <FormField
            label="인증번호"
            htmlFor="signup-code"
            required
            error={verification.codeError}
            hint={verification.notice}
          >
            <div className="relative">
              <input
                id="signup-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={verification.code}
                onChange={(event) => verification.changeCode(event.target.value)}
                placeholder="숫자 6자리"
                aria-invalid={Boolean(verification.codeError)}
                aria-describedby={verification.codeError ? "signup-code-error" : undefined}
                className={`${inputClassName} pr-16`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-error">
                <span aria-hidden="true">{formatTimer(verification.remainingSeconds)}</span>
                <span className="sr-only">
                  남은 시간 {Math.floor(verification.remainingSeconds / 60)}분{" "}
                  {verification.remainingSeconds % 60}초
                </span>
              </span>
            </div>
          </FormField>
        )}
      </div>

      {isSent ? (
        <Button
          onClick={verification.confirmCode}
          disabled={isVerifying || verification.code.length !== 6}
          className="mt-8 w-full"
        >
          {isVerifying ? "확인 중…" : "다음"}
          {!isVerifying && <span aria-hidden="true">→</span>}
        </Button>
      ) : (
        <Button onClick={verification.requestCode} disabled={isSending} className="mt-8 w-full">
          {isSending ? "발송 중…" : "인증번호 받기"}
        </Button>
      )}

      {/* 재발송·이메일 변경 도움말 (카카오 방식, 팝업 대신 펼침) */}
      {isSent && (
        <details className="group mt-8 rounded-lg border border-border bg-white px-5 py-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-ink hover:text-primary">
            인증 메일을 받지 못하셨나요? <span className="group-open:hidden">▾</span>
            <span className="hidden group-open:inline">▴</span>
          </summary>

          <ul className="mt-4 space-y-2 text-xs leading-5 text-muted">
            <li>• 인증을 요청한 이메일 주소가 맞는지 확인해 주세요.</li>
            <li>• 메일이 늦게 올 수 있어요. 스팸함, 프로모션함도 확인해 주세요.</li>
          </ul>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={verification.requestCode}
              disabled={isSending || isVerifying || verification.resendWaitSeconds > 0}
              className={helpButtonClass}
            >
              {isSending ? "발송 중…" : "인증번호 다시 받기"}
            </button>
            <button type="button" onClick={handleChangeEmail} className={helpButtonClass}>
              다른 이메일로 변경
            </button>
          </div>

          {verification.resendWaitSeconds > 0 && (
            <p className="mt-2 text-xs text-muted/70">
              {verification.resendWaitSeconds}초 후 다시 받을 수 있어요.
            </p>
          )}
        </details>
      )}

      <button type="button" onClick={onBack} className={`mt-8 ${backActionClass}`}>
        ← 약관 동의로 돌아가기
      </button>
    </section>
  );
}
