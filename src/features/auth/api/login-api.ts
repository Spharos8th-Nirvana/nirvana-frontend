import type { LoginRequest, LoginResult } from "@/features/auth/types/login";

/**
 * 로그인 API (임시 동작).
 * 함수 이름·입력·결과는 백엔드와 정한 흐름(B안)에 맞췄습니다. API가 연결되면 함수 안쪽만 실제 요청으로 바꿉니다.
 * 실제 연결 후에는 토큰을 백엔드가 HttpOnly 쿠키로 넣으므로, 프론트는 토큰을 다루지 않습니다.
 */

const MOCK_DELAY_MS = 500;

/** 임시 동작에서 로그인에 성공하는 계정 (화면 확인용) */
export const MOCK_LOGIN_EMAIL = "test@nirvana.test";
export const MOCK_LOGIN_PASSWORD = "nirvana12!";

function waitForMockResponse() {
  return new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

/** GET /api/auth/csrf → 상태를 바꾸는 요청(로그인 등)에 X-CSRF-Token 헤더로 보낼 값 */
export async function getCsrfToken(): Promise<string> {
  await waitForMockResponse();
  return crypto.randomUUID();
}

/** POST /api/auth/login (헤더 X-CSRF-Token) */
export async function login(request: LoginRequest, csrfToken: string): Promise<LoginResult> {
  await waitForMockResponse();

  if (!csrfToken) {
    return { ok: false, reason: "error" };
  }

  const matched = request.email === MOCK_LOGIN_EMAIL && request.password === MOCK_LOGIN_PASSWORD;
  return matched ? { ok: true } : { ok: false, reason: "invalid" };
}
