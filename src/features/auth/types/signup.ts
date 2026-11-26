/**
 * 회원가입 타입.
 * 백엔드 회원가입 연동 문서와 API 명세 기준입니다.
 * - POST /signup/email-verification/send, POST /signup/email-verification/verify, POST /signup (Auth)
 * - POST /profiles/nickname-availability (Member)
 */

/** DB ENUM('MALE', 'FEMALE') */
export type SignupGender = "MALE" | "FEMALE";

/** 진행 단계. 1 약관 동의, 2 이메일 인증, 3 정보 입력, 4 가입 완료 */
export type SignupStep = 1 | 2 | 3 | 4;

/** 필수 약관. 문구는 프론트에서 관리합니다. (버전 저장 없음) */
export type SignupTerm = {
  id: string;
  title: string;
  content: string;
};

/** ③ 정보 입력 화면의 입력값. 입력 칸과 연결되므로 문자열로 다룹니다. */
export type SignupFormValues = {
  password: string;
  passwordConfirmation: string;
  /** 필수. 공백만 불가, 최대 100자 */
  name: string;
  /** 필수. 공백만 불가, 최대 30자 */
  nickname: string;
  /** 필수. 숫자와 맨 앞 + 만, 최대 20자 */
  phone: string;
  /** 선택. "" 은 선택 안 함 */
  gender: SignupGender | "";
  /** 선택. ISO 국가 코드 2자리, 기본 KR */
  countryCode: string;
  /** 선택. null 은 고르지 않음 → 요청에 넣지 않음 (서버가 false 처리) */
  emailMarketingAgree: boolean | null;
  smsMarketingAgree: boolean | null;
};

/** 가입 요청 (POST /signup) */
export type SignupRequest = {
  email: string;
  verificationToken: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  nickname: string;
  phone: string;
  requiredTermsAgreed: true;
  gender?: SignupGender;
  countryCode?: string;
  emailMarketingAgree?: boolean;
  smsMarketingAgree?: boolean;
};

/** 백엔드 오류 코드 (연동 문서 기준) */
export type SignupErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_JSON"
  | "EMAIL_ALREADY_USED"
  | "NICKNAME_TAKEN"
  | "INVALID_EMAIL_VERIFICATION_CODE"
  | "INVALID_EMAIL_VERIFICATION_TOKEN"
  | "EMAIL_RESEND_TOO_SOON"
  | "EMAIL_DELIVERY_FAILED"
  | "INTERNAL_SERVER_ERROR";

/** 400 INVALID_REQUEST 일 때 입력란별 오류 */
export type SignupErrorDetail = {
  field: string;
  message: string;
};

export type SignupError = {
  code: SignupErrorCode;
  message: string;
  details?: SignupErrorDetail[];
};

/** API 호출 결과. 성공이면 data, 실패면 error */
export type SignupResult<T> = { ok: true; data: T } | { ok: false; error: SignupError };
