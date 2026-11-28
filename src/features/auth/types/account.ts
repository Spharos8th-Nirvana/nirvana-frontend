/** 비밀번호 변경 입력값 */
export type PasswordChangeValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type PasswordChangeField = keyof PasswordChangeValues;

export type PasswordChangeErrors = Partial<Record<PasswordChangeField, string>>;

/** 비밀번호 변경 결과. wrong-current: 지금 비밀번호가 틀림 */
export type PasswordChangeResult = { ok: true } | { ok: false; reason: "wrong-current" | "error" };

/** 회원 탈퇴 신청 결과. 신청하면 계정이 WITHDRAWN_PENDING(탈퇴 대기)이 됩니다. */
export type WithdrawalResult = { ok: true; requestedAt: string } | { ok: false };
