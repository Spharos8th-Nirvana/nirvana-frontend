import { MOCK_LOGIN_PASSWORD } from "@/features/auth/api/login-api";
import type { PasswordChangeResult, WithdrawalResult } from "@/features/auth/types/account";

/**
 * 계정 API (임시 동작). 비밀번호 변경·회원 탈퇴는 계정(Auth)이 처리합니다.
 * 경로와 응답은 [백엔드 확인]. API가 연결되면 함수 안쪽만 실제 요청으로 바꿉니다.
 */

const MOCK_DELAY_MS = 600;

function waitForMockResponse() {
  return new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

/** 비밀번호 변경. 임시 동작에서는 로그인 확인용 비밀번호가 "지금 비밀번호"입니다. */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<PasswordChangeResult> {
  await waitForMockResponse();
  void newPassword;
  if (currentPassword !== MOCK_LOGIN_PASSWORD) {
    return { ok: false, reason: "wrong-current" };
  }
  return { ok: true };
}

/** 회원 탈퇴 신청 */
export async function requestWithdrawal(): Promise<WithdrawalResult> {
  await waitForMockResponse();
  return { ok: true, requestedAt: new Date().toISOString() };
}
