"use client";

import { useEffect, useRef, useState } from "react";
import EmailVerificationStep from "@/features/auth/components/organisms/EmailVerificationStep";
import SignupProgress from "@/features/auth/components/organisms/SignupProgress";
import SignupTermsStep from "@/features/auth/components/organisms/SignupTermsStep";
import type { SignupStep, SignupTerm } from "@/features/auth/types/signup";

const stepTitles: Record<SignupStep, string> = {
  1: "1단계 약관 동의",
  2: "2단계 이메일 인증",
  3: "3단계 가입 정보 입력",
  4: "가입 완료",
};

type SignupFlowTemplateProps = {
  terms: SignupTerm[];
};

/**
 * 회원가입 전체 흐름 (① 약관 → ② 이메일 인증 → ③ 정보 입력 → ④ 완료).
 * 단계와 입력값은 화면 안 상태로만 관리합니다. (URL·브라우저 저장소에 두지 않음, 새로고침하면 처음부터)
 */
export default function SignupFlowTemplate({ terms }: SignupFlowTemplateProps) {
  const [step, setStep] = useState<SignupStep>(1);
  const [agreedTermIds, setAgreedTermIds] = useState<string[]>([]);
  // ②에서 인증에 성공한 이메일과 인증 토큰. ③에서는 읽기만 하고, 가입 요청에 함께 보냅니다.
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const flowTopRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  // 버튼으로 단계를 바꿀 때만 위로 이동합니다. (첫 화면에서는 이동하지 않음)
  const shouldFocusStepRef = useRef(false);

  useEffect(() => {
    if (!shouldFocusStepRef.current) return;
    shouldFocusStepRef.current = false;
    flowTopRef.current?.scrollIntoView({ block: "start" });
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function goToStep(nextStep: SignupStep) {
    shouldFocusStepRef.current = true;
    setStep(nextStep);
  }

  function handleToggleTerm(termId: string, checked: boolean) {
    setAgreedTermIds((prev) =>
      checked
        ? [...prev.filter((id) => id !== termId), termId]
        : prev.filter((id) => id !== termId),
    );
  }

  function handleToggleAllTerms(checked: boolean) {
    setAgreedTermIds(checked ? terms.map((term) => term.id) : []);
  }

  function handleEmailVerified(email: string, token: string) {
    setVerifiedEmail(email);
    setVerificationToken(token);
    goToStep(3);
  }

  return (
    <div ref={flowTopRef} className="scroll-mt-24 space-y-12">
      {/* 단계가 바뀌면 화면 낭독기가 읽도록 포커스를 받는 제목 */}
      <h2 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
        {stepTitles[step]}
      </h2>

      {step !== 4 && <SignupProgress currentStep={step} />}

      {step === 1 && (
        <SignupTermsStep
          terms={terms}
          agreedTermIds={agreedTermIds}
          onToggle={handleToggleTerm}
          onToggleAll={handleToggleAllTerms}
          onNext={() => goToStep(2)}
        />
      )}

      {step === 2 && (
        <EmailVerificationStep initialEmail={verifiedEmail} onVerified={handleEmailVerified} />
      )}

      {/* 다음 단계에서 정보 입력 화면으로 바꿉니다. */}
      {step === 3 && verificationToken && (
        <p className="text-sm text-muted">
          {verifiedEmail} 인증 완료. 정보 입력 화면은 다음 작업에서 만들어요.
        </p>
      )}
    </div>
  );
}
