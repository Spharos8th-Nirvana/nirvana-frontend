import type { SignupFormValues, SignupRequest } from "@/features/auth/types/signup";
import {
  validateName,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
} from "@/shared/utils/validate-user";

/**
 * 회원가입 입력값 검사(화면용).
 * 기준: 백엔드 연동 문서·API 명세. 최종 검증은 Backend가 합니다.
 * 이름·휴대폰·비밀번호 규칙은 회원정보 수정과 함께 쓰므로 src/shared/utils/validate-user.ts에 있습니다.
 */

export const EMAIL_MAX_LENGTH = 255;
export const VERIFICATION_CODE_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "이메일을 입력해 주세요.";
  }

  if (trimmed.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(trimmed)) {
    return "이메일 형식을 확인해 주세요.";
  }

  return undefined;
}

export function validateVerificationCode(value: string): string | undefined {
  return CODE_PATTERN.test(value)
    ? undefined
    : `인증번호 숫자 ${VERIFICATION_CODE_LENGTH}자리를 입력해 주세요.`;
}

export type SignupFormField = "password" | "passwordConfirmation" | "name" | "phone";

export type SignupFormErrors = Partial<Record<SignupFormField, string>>;

/** ③ 정보 입력 검사 */
export function validateSignupForm(values: SignupFormValues): SignupFormErrors {
  const errors: SignupFormErrors = {};

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmationError = validatePasswordConfirmation(
    values.password,
    values.passwordConfirmation,
  );
  if (confirmationError) {
    errors.passwordConfirmation = confirmationError;
  }

  const nameError = validateName(values.name, values.countryCode);
  if (nameError) {
    errors.name = nameError;
  }

  const phoneError = validatePhone(values.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  return errors;
}

export function hasSignupErrors(errors: SignupFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** 화면 입력값 + ②에서 보관한 이메일·토큰 → 가입 요청. 고르지 않은 선택 항목은 넣지 않습니다. */
export function buildSignupRequest(
  values: SignupFormValues,
  email: string,
  verificationToken: string,
): SignupRequest {
  return {
    email,
    verificationToken,
    password: values.password,
    passwordConfirmation: values.passwordConfirmation,
    name: values.name.trim(),
    phone: values.phone,
    requiredTermsAgreed: true,
    ...(values.gender && { gender: values.gender }),
    ...(values.countryCode && { countryCode: values.countryCode }),
    ...(values.emailMarketingAgree !== null && { emailMarketingAgree: values.emailMarketingAgree }),
    ...(values.smsMarketingAgree !== null && { smsMarketingAgree: values.smsMarketingAgree }),
  };
}
