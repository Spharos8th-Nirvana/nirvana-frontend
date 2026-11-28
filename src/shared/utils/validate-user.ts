/**
 * 회원 정보 입력 검사(화면용): 이름·휴대폰·비밀번호.
 * 회원가입(features/auth)과 회원정보 수정(features/member)이 함께 씁니다. 최종 검증은 Backend가 합니다.
 */

export const NAME_MAX_LENGTH = 100;
export const PHONE_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
/** 영문 대문자·영문 소문자·숫자·특수문자 네 종류 중 몇 종류 이상 */
export const PASSWORD_REQUIRED_KINDS = 3;
/** 비밀번호 해시(BCrypt) 입력 한도. UTF-8 기준 */
export const PASSWORD_MAX_BYTES = 72;
export const PASSWORD_SPECIAL_CHARACTERS = "!@#$%^&*";

/** 숫자와 맨 앞 + 만 허용 */
const PHONE_PATTERN = /^\+?\d+$/;
/** 대한민국 이름: 한글 음절만 (띄어쓰기·기호 불가) */
const KOREAN_NAME_PATTERN = /^[가-힣]+$/;
/** 한글 (음절·자모 모두) */
const HANGUL_PATTERN = /\p{Script=Hangul}/u;
/** 그 외 국가 이름: 문자·결합 부호로 시작하고, 안쪽에 공백과 - ' ’ . 허용 (숫자·이모지 불가) */
const FOREIGN_NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} \-'’.]*$/u;

/** 글자 수. 이모지처럼 두 칸을 쓰는 글자도 1자로 셉니다. */
export function countCharacters(value: string): number {
  return [...value].length;
}

function countBytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** 비밀번호에 쓰는 문자 종류 네 가지. 이 중 PASSWORD_REQUIRED_KINDS 종류 이상을 섞어야 합니다. */
const passwordCharacterKinds = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*]/];

/** 비밀번호에 들어간 문자 종류 수 (0~4) */
export function countPasswordKinds(value: string): number {
  return passwordCharacterKinds.filter((pattern) => pattern.test(value)).length;
}

/** 비밀번호 규칙. 화면의 체크 목록과 검사에 함께 씁니다. */
export const passwordRules = [
  {
    id: "length",
    label: `${PASSWORD_MIN_LENGTH}자 이상`,
    test: (value: string) => countCharacters(value) >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "kinds",
    label: `영문 대문자·소문자·숫자·특수문자(${PASSWORD_SPECIAL_CHARACTERS}) 중 ${PASSWORD_REQUIRED_KINDS}가지 이상`,
    test: (value: string) => countPasswordKinds(value) >= PASSWORD_REQUIRED_KINDS,
  },
] as const;

/** 휴대폰 입력에서 숫자와 맨 앞 + 만 남깁니다. (하이픈·공백 자동 제거) */
export function normalizePhoneInput(value: string): string {
  const trimmed = value.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

/** 필수 글자 칸: 비었는지, 너무 긴지 */
function validateRequiredText(value: string, label: string, maxLength: number): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label}을(를) 입력해 주세요.`;
  }

  if (countCharacters(trimmed) > maxLength) {
    return `${label}은(는) ${maxLength}자까지 입력할 수 있어요.`;
  }

  return undefined;
}

/** 이름 칸 안내 문구. 선택한 국가에 따라 규칙이 다릅니다. */
export function getNameHint(countryCode: string): string {
  return countryCode === "KR"
    ? "한글로 띄어쓰기 없이 (예: 김민수)"
    : "여권에 적힌 이름 그대로 (As on passport)";
}

/**
 * 이름 검사. 선택한 국가에 따라 두 가지 규칙을 씁니다. (백엔드 가입 API와 같은 규칙)
 * - 대한민국: 한글 음절만
 * - 그 외 국가: 한글 불가, 다른 언어 문자·결합 부호·안쪽 공백·- ' ’ . 허용
 * - 공통: 숫자·이모지 불가
 */
export function validateName(value: string, countryCode: string): string | undefined {
  const requiredError = validateRequiredText(value, "이름", NAME_MAX_LENGTH);
  if (requiredError) {
    return requiredError;
  }

  const name = value.trim();

  if (countryCode === "KR") {
    return KOREAN_NAME_PATTERN.test(name)
      ? undefined
      : "한글로 띄어쓰기 없이 입력해 주세요. (숫자·기호 불가)";
  }

  if (HANGUL_PATTERN.test(name)) {
    return "대한민국 외 국가를 선택하면 한글 이름을 쓸 수 없어요. 국가를 확인해 주세요.";
  }

  return FOREIGN_NAME_PATTERN.test(name)
    ? undefined
    : "문자와 공백, - ' . 만 입력할 수 있어요. (숫자·이모지 불가)";
}

/** 휴대폰 검사 (normalizePhoneInput으로 정리한 값) */
export function validatePhone(value: string): string | undefined {
  if (!value) {
    return "휴대폰 번호를 입력해 주세요.";
  }

  if (!PHONE_PATTERN.test(value)) {
    return "숫자로 입력해 주세요. (해외 번호는 맨 앞 + 가능)";
  }

  if (value.length > PHONE_MAX_LENGTH) {
    return `휴대폰 번호는 ${PHONE_MAX_LENGTH}자까지 입력할 수 있어요.`;
  }

  return undefined;
}

/** 새 비밀번호 검사: 비었는지 → 너무 긴지 → 규칙 */
export function validatePassword(value: string): string | undefined {
  if (!value) {
    return "비밀번호를 입력해 주세요.";
  }

  if (countCharacters(value) > PASSWORD_MAX_LENGTH || countBytes(value) > PASSWORD_MAX_BYTES) {
    return `비밀번호는 ${PASSWORD_MAX_LENGTH}자까지 입력할 수 있어요.`;
  }

  if (!passwordRules.every((rule) => rule.test(value))) {
    return "비밀번호 규칙을 확인해 주세요.";
  }

  return undefined;
}

/** 비밀번호 확인 칸 검사 */
export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (!confirmation) {
    return "비밀번호를 한 번 더 입력해 주세요.";
  }

  return confirmation === password ? undefined : "비밀번호가 일치하지 않아요.";
}
