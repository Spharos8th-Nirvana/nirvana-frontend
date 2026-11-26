import { useEffect, useState } from "react";
import { sendVerificationCode, verifyCode } from "@/features/auth/api/signup-api";
import type { SignupErrorCode } from "@/features/auth/types/signup";
import {
  VERIFICATION_CODE_LENGTH,
  validateEmail,
  validateVerificationCode,
} from "@/features/auth/utils/validate-signup";

/** 인증번호 유효시간 5분, 재발송 대기 1분 (백엔드 정책) */
const CODE_VALID_SECONDS = 5 * 60;
const RESEND_WAIT_SECONDS = 60;
const COMMON_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";

type VerificationStatus = "idle" | "sending" | "sent" | "verifying";

function getSendErrorMessage(code: SignupErrorCode): string {
  switch (code) {
    case "EMAIL_ALREADY_USED":
      return "이미 가입된 이메일이에요. 다른 이메일을 입력하거나 로그인해 주세요.";
    case "EMAIL_RESEND_TOO_SOON":
      return "인증번호는 1분 후에 다시 받을 수 있어요.";
    case "INVALID_REQUEST":
      return "이메일 형식을 확인해 주세요.";
    case "EMAIL_DELIVERY_FAILED":
      return "인증 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.";
    default:
      return COMMON_ERROR_MESSAGE;
  }
}

type UseEmailVerificationParams = {
  /** ③에서 이메일 변경으로 돌아왔을 때 채워 둘 값 */
  initialEmail: string;
  onVerified: (email: string, verificationToken: string) => void;
};

/** ② 이메일 인증: 인증번호 발송·재발송·확인과 남은 시간 계산 */
export function useEmailVerification({ initialEmail, onVerified }: UseEmailVerificationParams) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [emailError, setEmailError] = useState<string>();
  const [codeError, setCodeError] = useState<string>();
  /** 발송·재발송 결과 안내 (화면 낭독기도 읽음) */
  const [notice, setNotice] = useState("");
  /** 마지막으로 발송한 시각. null 이면 아직 보내지 않음 */
  const [sentAt, setSentAt] = useState<number | null>(null);
  /** 1초마다 갱신되는 현재 시각 (남은 시간 계산용) */
  const [now, setNow] = useState(0);

  const isSent = sentAt !== null;

  useEffect(() => {
    if (sentAt === null) return;
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [sentAt]);

  const elapsedSeconds = sentAt === null ? 0 : Math.floor((now - sentAt) / 1000);
  const remainingSeconds = Math.max(0, CODE_VALID_SECONDS - elapsedSeconds);
  const resendWaitSeconds = Math.max(0, RESEND_WAIT_SECONDS - elapsedSeconds);

  function changeEmail(value: string) {
    setEmail(value);
    setEmailError(undefined);
  }

  function changeCode(value: string) {
    setCode(value.replace(/\D/g, "").slice(0, VERIFICATION_CODE_LENGTH));
    setCodeError(undefined);
  }

  /** "다른 이메일로 변경": 보낸 인증번호를 버리고 이메일 입력으로 돌아갑니다. */
  function resetEmail() {
    setSentAt(null);
    setCode("");
    setCodeError(undefined);
    setEmailError(undefined);
    setNotice("");
    setStatus("idle");
  }

  /** 처음 발송과 재발송에 함께 씁니다. */
  async function requestCode() {
    const trimmedEmail = email.trim();
    const error = validateEmail(trimmedEmail);
    if (error) {
      setEmailError(error);
      return;
    }

    const isResend = isSent;
    setStatus("sending");
    const result = await sendVerificationCode(trimmedEmail);

    if (!result.ok) {
      setEmailError(getSendErrorMessage(result.error.code));
      setStatus(isResend ? "sent" : "idle");
      return;
    }

    const sentTime = Date.now();
    setSentAt(sentTime);
    setNow(sentTime);
    setCode("");
    setCodeError(undefined);
    setEmailError(undefined);
    setNotice(
      isResend
        ? "인증번호를 다시 보냈어요. 5분 안에 입력해 주세요."
        : "인증번호를 보냈어요. 5분 안에 입력해 주세요.",
    );
    setStatus("sent");
  }

  async function confirmCode() {
    const error = validateVerificationCode(code);
    if (error) {
      setCodeError(error);
      return;
    }

    if (remainingSeconds === 0) {
      setCodeError("인증 시간이 지났어요. 인증번호를 다시 받아 주세요.");
      return;
    }

    setStatus("verifying");
    const trimmedEmail = email.trim();
    const result = await verifyCode(trimmedEmail, code);

    if (!result.ok) {
      // 오입력·만료·5회 실패가 모두 같은 코드로 오므로 재발송을 함께 안내합니다.
      setCodeError(
        result.error.code === "INVALID_EMAIL_VERIFICATION_CODE"
          ? "인증번호가 맞지 않거나 만료됐어요. 계속 안 되면 인증번호를 다시 받아 주세요."
          : COMMON_ERROR_MESSAGE,
      );
      setStatus("sent");
      return;
    }

    onVerified(trimmedEmail, result.data.verificationToken);
  }

  return {
    email,
    code,
    status,
    emailError,
    codeError,
    notice,
    isSent,
    remainingSeconds,
    resendWaitSeconds,
    changeEmail,
    changeCode,
    resetEmail,
    requestCode,
    confirmCode,
  };
}
