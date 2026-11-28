/**
 * 회원정보 수정 타입.
 * 내 정보는 백엔드와 정한 내 정보 필드(Auth 계정 + Member 프로필, 주소 /api/me 또는 /api/auth/me는 확인 중), 마케팅 수신은 DB marketingConsents 기준입니다.
 * 수정 요청·응답 모양은 API 확정 후 맞춥니다.
 */

/** DB ENUM('MALE', 'FEMALE'). null은 선택 안 함 */
export type ProfileGender = "MALE" | "FEMALE";

/** 내 정보 응답 (비밀번호는 오지 않음) */
export type MyProfile = {
  userUuid: string;
  /** 로그인 아이디. 바꿀 수 없음 */
  email: string;
  /** 국가번호 포함, 예: +821012345678 */
  phone: string;
  gender: ProfileGender | null;
  name: string;
  nickname: string;
  countryCode: string | null;
};

/** 내 정보 입력값. 입력 칸과 연결되므로 문자열로 다룹니다. */
export type ProfileFormValues = {
  name: string;
  nickname: string;
  countryCode: string;
  /** "" 은 선택 안 함 */
  gender: ProfileGender | "";
  phone: string;
};

export type ProfileFormField = "name" | "nickname" | "phone";

export type ProfileFormErrors = Partial<Record<ProfileFormField, string>>;

/** 마케팅 수신 설정. DB marketingConsents */
export type MarketingConsent = {
  emailAllowed: boolean;
  smsAllowed: boolean;
  /** 마지막 동의 시각. 동의한 적 없으면 null */
  emailConsentedAt: string | null;
  smsConsentedAt: string | null;
};

/** nickname-taken: 이미 쓰는 닉네임 / error: 그 밖의 오류 */
export type UpdateProfileResult =
  { ok: true; profile: MyProfile } | { ok: false; reason: "nickname-taken" | "error" };
