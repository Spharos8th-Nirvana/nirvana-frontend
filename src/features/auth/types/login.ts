/**
 * 로그인 타입.
 * 백엔드와 정한 방식(B안): 로그인에 성공하면 백엔드가 Set-Cookie로 Access·Refresh 토큰을 HttpOnly 쿠키에 넣습니다.
 * 프론트는 토큰을 읽거나 저장하지 않으므로, 결과에는 성공 여부만 담습니다.
 * - GET /api/auth/csrf → CSRF 토큰
 * - POST /api/auth/login (헤더 X-CSRF-Token)
 */

/** 로그인 요청 (POST /api/auth/login) */
export type LoginRequest = {
  email: string;
  password: string;
};

/** 로그인 화면의 입력값 */
export type LoginFormValues = LoginRequest;

/**
 * 로그인 실패 이유 (화면 안내용).
 * - invalid: 이메일 또는 비밀번호가 맞지 않음 (어느 쪽인지 알려 주지 않음)
 * - error: 그 밖의 오류 (서버 오류, 네트워크 등)
 * 백엔드 오류 코드가 확정되면 여기에 맞춰 나눕니다.
 */
export type LoginFailureReason = "invalid" | "error";

export type LoginResult = { ok: true } | { ok: false; reason: LoginFailureReason };
