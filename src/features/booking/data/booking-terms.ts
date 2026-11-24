import type { BookingTerm } from "@/features/booking/types/booking";

/**
 * 예약 약관(임시 데이터).
 * 코드는 DB nirvana_booking.bookingTerms.code 의 값을 따릅니다.
 * 필수 여부(required)와 본문은 실제로는 API에서 받으며, 아래 값은 화면 확인용입니다.
 */
export const bookingTerms: BookingTerm[] = [
  {
    id: "term-privacy-required",
    code: "PRIVACY_REQUIRED",
    title: "개인정보 수집 및 이용 동의",
    content:
      "예약 진행과 사찰 안내를 위해 예약자와 참가자의 이름, 연락처, 나이 등을 수집합니다. (임시 약관 내용입니다.)",
    version: "1.0",
    required: true,
  },
  {
    id: "term-third-party",
    code: "THIRD_PARTY_PROVISION",
    title: "개인정보 제3자 제공 동의",
    content:
      "예약한 프로그램을 운영하는 사찰에 참가자 정보를 제공합니다. (임시 약관 내용입니다.)",
    version: "1.0",
    required: true,
  },
  {
    id: "term-privacy-optional",
    code: "PRIVACY_OPTIONAL",
    title: "선택 개인정보 수집 및 이용 동의",
    content:
      "더 나은 안내를 위해 선택 항목(지역, 이메일 등)을 수집합니다. (임시 약관 내용입니다.)",
    version: "1.0",
    required: false,
  },
];
