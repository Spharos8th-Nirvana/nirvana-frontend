import type { SignupRequest, SignupResult } from "@/features/auth/types/signup";

/**
 * 회원가입 API (임시 동작).
 * 함수 이름·입력·결과는 백엔드 명세와 같습니다.
 * API Gateway 경로가 확정되면 이 파일의 함수 안쪽만 실제 요청으로 바꾸고, 화면 코드는 그대로 둡니다.
 * 지금은 실제로 메일을 보내거나 가입하지 않습니다.
 */

const MOCK_DELAY_MS = 500;
const RESEND_WAIT_MS = 60 * 1000;
const CODE_VALID_MS = 5 * 60 * 1000;

/** 오류 화면을 확인하기 위한 임시 값 */
export const MOCK_TAKEN_EMAIL = "taken@nirvana.test";
export const MOCK_TAKEN_NICKNAME = "nirvana";
export const MOCK_WRONG_CODE = "000000";

/** 이메일별 마지막 발송 시각 (임시 동작 전용) */
const sentAtByEmail = new Map<string, number>();

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

  return { ok: true, data: { verificationToken: crypto.randomUUID() } };
}

/** POST /profiles/nickname-availability → 200 · data.available */
export async function checkNicknameAvailability(
  nickname: string,
): Promise<SignupResult<{ available: boolean }>> {
  await waitForMockResponse();
  return { ok: true, data: { available: nickname.trim() !== MOCK_TAKEN_NICKNAME } };
}

/** POST /signup → 201 · data.userUuid */
export async function signup(request: SignupRequest): Promise<SignupResult<{ userUuid: string }>> {
  await waitForMockResponse();

  if (request.nickname === MOCK_TAKEN_NICKNAME) {
    return {
      ok: false,
      error: { code: "NICKNAME_TAKEN", message: "이미 사용 중인 닉네임입니다." },
    };
  }

  return { ok: true, data: { userUuid: crypto.randomUUID() } };
}
