import type {
  ProfileFormErrors,
  ProfileFormValues,
  MyProfile,
} from "@/features/member/types/profile";
import { countCharacters, validateName, validatePhone } from "@/shared/utils/validate-user";

/** DB userProfiles.nickname VARCHAR(30) */
export const NICKNAME_MAX_LENGTH = 30;

/** 화면 검사 (최종 검증은 Backend가 합니다). 이름·휴대폰은 회원가입과 같은 규칙 */
export function validateProfile(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  const nameError = validateName(values.name, values.countryCode);
  if (nameError) {
    errors.name = nameError;
  }

  const nickname = values.nickname.trim();
  if (!nickname) {
    errors.nickname = "닉네임을 입력해 주세요.";
  } else if (countCharacters(nickname) > NICKNAME_MAX_LENGTH) {
    errors.nickname = `닉네임은 ${NICKNAME_MAX_LENGTH}자까지 입력할 수 있어요.`;
  }

  const phoneError = validatePhone(values.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  return errors;
}

/** 저장된 내 정보 → 입력 칸 값 */
export function toProfileFormValues(profile: MyProfile): ProfileFormValues {
  return {
    name: profile.name,
    nickname: profile.nickname,
    countryCode: profile.countryCode ?? "KR",
    gender: profile.gender ?? "",
    phone: profile.phone,
  };
}

/** 입력값이 저장된 값과 같은지 (같으면 저장 버튼 비활성) */
export function isSameProfile(a: ProfileFormValues, b: ProfileFormValues): boolean {
  return (
    a.name.trim() === b.name.trim() &&
    a.nickname.trim() === b.nickname.trim() &&
    a.countryCode === b.countryCode &&
    a.gender === b.gender &&
    a.phone === b.phone
  );
}

/** "2026-11-27T14:20:00" → "2026.11.27" */
export function formatConsentDate(dateTime: string): string {
  return dateTime.slice(0, 10).replaceAll("-", ".");
}
