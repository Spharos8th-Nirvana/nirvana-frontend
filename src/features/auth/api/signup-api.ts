import type { SignupRequest, SignupResult } from "@/features/auth/types/signup";

/**
 * 회원가입 API (임시 동작).
 * 함수 이름·입력·결과는 백엔드 명세와 같습니다.
 * API Gateway 경로가 확정되면 이 파일의 함수 안쪽만 실제 요청으로 바꾸고, 화면 코드는 그대로 둡니다.
 * 지금은 실제로 메일을 보내거나 가입하지 않습니다.
 */

const MOCK_DELAY_MS = 500;
const RESEND_WAIT_MS = 60 * 1000;
/** 인증번호 유효시간: 발송 후 5분 */
const CODE_VALID_MS = 5 * 60 * 1000;
/** 가입 토큰 유효시간: 인증 성공 후 30분 */
const SIGNUP_TOKEN_VALID_MS = 30 * 60 * 1000;

/** 오류 화면을 확인하기 위한 임시 값 */
export const MOCK_TAKEN_EMAIL = "taken@nirvana.test";
export const MOCK_WRONG_CODE = "000000";

/** 이메일별 마지막 발송 시각 (임시 동작 전용) */
const sentAtByEmail = new Map<string, number>();
/** 발급한 가입 토큰 → 인증된 이메일과 발급 시각 (임시 동작 전용. 실제로는 백엔드가 Redis에 저장) */
const verifiedByToken = new Map<string, { email: string; verifiedAt: number }>();

function waitForMockResponse() {
  return new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

/** POST /signup/email-verification/send → 204 */
export async function sendVerificationCode(email: string): Promise<SignupResult<null>> {
  await waitForMockResponse();

  if (email === MOCK_TAKEN_EMAIL) {
    return {
      ok: false,
      error: { code: "EMAIL_ALREADY_USED", message: "이미 가입된 이메일입니다." },
    };
  }

  const lastSentAt = sentAtByEmail.get(email);
  if (lastSentAt && Date.now() - lastSentAt < RESEND_WAIT_MS) {
    return {
      ok: false,
      error: { code: "EMAIL_RESEND_TOO_SOON", message: "잠시 후 다시 요청해 주세요." },
    };
  }

  sentAtByEmail.set(email, Date.now());
  return { ok: true, data: null };
}

/** POST /signup/email-verification/verify → 200 · data.verificationToken */
export async function verifyCode(
  email: string,
  code: string,
): Promise<SignupResult<{ verificationToken: string }>> {
  await waitForMockResponse();

  const sentAt = sentAtByEmail.get(email);
  const expired = !sentAt || Date.now() - sentAt > CODE_VALID_MS;

  if (expired || code === MOCK_WRONG_CODE) {
    return {
      ok: false,
      error: { code: "INVALID_EMAIL_VERIFICATION_CODE", message: "유효하지 않은 인증번호입니다." },
    };
  }

  const verificationToken = crypto.randomUUID();
  verifiedByToken.set(verificationToken, { email, verifiedAt: Date.now() });
  return { ok: true, data: { verificationToken } };
}

/**
 * POST /signup → 202 Accepted · data.userUuid
 * 닉네임은 보내지 않습니다. 계정 저장 후 백엔드가 랜덤 닉네임을 만들어 Kafka로 Member 프로필에 저장합니다. (그래서 "접수됨" 202)
 */
export async function signup(request: SignupRequest): Promise<SignupResult<{ userUuid: string }>> {
  await waitForMockResponse();

  // 가입 토큰은 인증 성공 후 30분 동안, 인증한 이메일로 한 번만 쓸 수 있습니다.
  const verified = verifiedByToken.get(request.verificationToken);
  const tokenExpired = !verified || Date.now() - verified.verifiedAt > SIGNUP_TOKEN_VALID_MS;

  if (!verified || verified.email !== request.email || tokenExpired) {
    return {
      ok: false,
      error: {
        code: "INVALID_EMAIL_VERIFICATION_TOKEN",
        message: "이메일 인증이 만료되었습니다.",
      },
    };
  }

  verifiedByToken.delete(request.verificationToken);
  return { ok: true, data: { userUuid: crypto.randomUUID() } };
}
