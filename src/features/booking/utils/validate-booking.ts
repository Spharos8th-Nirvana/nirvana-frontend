import type {
  BookerInfo,
  BookingTerm,
  ParticipantInfo,
} from "@/features/booking/types/booking";

/**
 * 예약 정보 입력값 검사(화면용).
 * 사용자가 빠르게 고칠 수 있도록 돕는 검사이며, 최종 검증은 Backend가 합니다.
 */

export const NAME_MAX_LENGTH = 50;
export const REGION_MAX_LENGTH = 50;
export const EMAIL_MAX_LENGTH = 255;
export const REQUEST_NOTE_MAX_LENGTH = 200;

/**
 * 성인 기준 나이(만). 화면에 안내 중인 "만 19세" 기준입니다.
 * DB에는 이 규칙이 없으므로 Backend 확인이 필요합니다.
 */
export const ADULT_MIN_AGE = 19;

const PHONE_PATTERN = /^\d{10,11}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AGE_PATTERN = /^\d{1,3}$/;
/** 문자(한글·영문 등), 띄어쓰기, 마침표, 하이픈, 아포스트로피만 허용 */
const NAME_PATTERN = /^[\p{L}\s.'-]+$/u;

export type BookerField = "name" | "phone" | "age" | "gender" | "email";
export type ParticipantField = "name" | "age" | "gender" | "phone" | "email";

export type BookingErrors = {
  booker: Partial<Record<BookerField, string>>;
  participants: Partial<Record<ParticipantField, string>>[];
  /** 아직 동의하지 않은 필수 약관 제목 */
  missingTerms: string[];
};

/** 휴대전화 입력에서 숫자만 남깁니다. */
export function toPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function validateName(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "이름을 입력해 주세요.";
  }

  return NAME_PATTERN.test(trimmed)
    ? undefined
    : "이름은 문자로만 입력해 주세요. (숫자·특수문자 제외)";
}

function validateAge(value: string, required: boolean): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? "나이를 입력해 주세요." : undefined;
  }

  return AGE_PATTERN.test(trimmed) ? undefined : "나이는 숫자로 입력해 주세요.";
}

/** 성인·청소년 구분과 나이가 맞는지 확인합니다. */
function validateAgeForType(age: number, type: ParticipantInfo["type"]): string | undefined {
  if (type === "YOUTH" && age >= ADULT_MIN_AGE) {
    return `청소년은 만 ${ADULT_MIN_AGE}세 미만이에요. 인원 구분을 확인해 주세요.`;
  }

  if (type === "ADULT" && age < ADULT_MIN_AGE) {
    return `만 ${ADULT_MIN_AGE}세 미만은 청소년으로 예약해 주세요.`;
  }

  return undefined;
}

function validateParticipant(
  participant: ParticipantInfo,
  genderRequired: boolean,
): Partial<Record<ParticipantField, string>> {
  const errors: Partial<Record<ParticipantField, string>> = {};

  const nameError = validateName(participant.name);
  if (nameError) {
    errors.name = nameError;
  }

  const ageError =
    validateAge(participant.age, true) ??
    validateAgeForType(Number(participant.age), participant.type);
  if (ageError) {
    errors.age = ageError;
  }

  if (genderRequired && !participant.gender) {
    errors.gender = "성별을 선택해 주세요.";
  }

  // 휴대폰·이메일은 선택 항목이라 입력했을 때만 형식을 검사합니다.
  const phoneDigits = toPhoneDigits(participant.phone);
  if (participant.phone.trim() && !PHONE_PATTERN.test(phoneDigits)) {
    errors.phone = "숫자 10~11자리로 입력해 주세요.";
  }

  if (participant.email.trim() && !EMAIL_PATTERN.test(participant.email.trim())) {
    errors.email = "이메일 형식을 확인해 주세요.";
  }

  return errors;
}

export function validateBooking(params: {
  booker: BookerInfo;
  participants: ParticipantInfo[];
  terms: BookingTerm[];
  agreedTermIds: string[];
  /** 숙박형이면 참가자 성별 필수 */
  genderRequired: boolean;
  /**
   * 첫 번째 참가자가 예약자와 같은지.
   * 같으면 첫 번째 참가자의 검사 결과를 예약자 칸의 오류로 보여줍니다.
   */
  sameAsBooker: boolean;
}): BookingErrors {
  const { booker, participants, terms, agreedTermIds, genderRequired, sameAsBooker } = params;
  const errors: BookingErrors = { booker: {}, participants: [], missingTerms: [] };

  // 예약자: 이름·휴대전화만 필수, 나머지는 입력했을 때만 형식 검사
  const bookerNameError = validateName(booker.name);
  if (bookerNameError) {
    errors.booker.name = bookerNameError;
  }

  const phoneDigits = toPhoneDigits(booker.phone);
  if (!phoneDigits) {
    errors.booker.phone = "휴대전화 번호를 입력해 주세요.";
  } else if (!PHONE_PATTERN.test(phoneDigits)) {
    errors.booker.phone = "숫자 10~11자리로 입력해 주세요.";
  }

  const bookerAgeError = validateAge(booker.age, false);
  if (bookerAgeError) {
    errors.booker.age = bookerAgeError;
  }

  if (booker.email.trim() && !EMAIL_PATTERN.test(booker.email.trim())) {
    errors.booker.email = "이메일 형식을 확인해 주세요.";
  }

  // 참가자: 이름·나이 필수, 성별은 숙박형만 필수, 나이는 성인·청소년 구분과 맞아야 함
  errors.participants = participants.map((participant, index) => {
    const participantErrors = validateParticipant(participant, genderRequired);

    // 예약자 = 첫 번째 참가자이면, 오류를 예약자 칸으로 옮깁니다. (참가자 칸은 잠겨 있음)
    if (sameAsBooker && index === 0) {
      errors.booker = { ...participantErrors, ...errors.booker };
      return {};
    }

    return participantErrors;
  });

  errors.missingTerms = terms
    .filter((term) => term.required && !agreedTermIds.includes(term.id))
    .map((term) => term.title);

  return errors;
}

export function hasBookingErrors(errors: BookingErrors): boolean {
  return (
    Object.keys(errors.booker).length > 0 ||
    errors.participants.some((item) => Object.keys(item).length > 0) ||
    errors.missingTerms.length > 0
  );
}
