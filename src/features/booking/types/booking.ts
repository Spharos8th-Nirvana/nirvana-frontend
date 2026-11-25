/**
 * 예약 정보 입력(2단계) 타입.
 * DB nirvana_booking.bookings / bookingParticipants 구조를 참고했습니다.
 * 실제 요청·응답 타입은 API(Swagger) 확정 후 맞춥니다.
 */

/** DB ENUM('MALE', 'FEMALE'). 빈 문자열은 선택 안 함 */
export type Gender = "MALE" | "FEMALE";

/** DB ENUM('ADULT', 'YOUTH') */
export type ParticipantType = "ADULT" | "YOUTH";

/** 예약자 입력값. 입력 칸과 연결되므로 숫자도 문자열로 다룹니다. */
export type BookerInfo = {
  /** 필수. DB contactName VARCHAR(50) NOT NULL */
  name: string;
  /** 필수. 숫자만 10~11자리. DB contactPhone NOT NULL */
  phone: string;
  /** 선택. DB contactAge NULL */
  age: string;
  /** 선택. DB contactGender NULL */
  gender: Gender | "";
  /** 선택. ISO 국가 코드 2자리. DB contactCountryCode NULL */
  countryCode: string;
  /** 선택. DB contactRegion VARCHAR(50) NULL */
  region: string;
  /** 선택. DB contactEmail NULL */
  email: string;
  /** 선택. 최대 200자. DB requestNote VARCHAR(200) NULL */
  requestNote: string;
};

export type ParticipantInfo = {
  type: ParticipantType;
  /** 필수. DB name NOT NULL */
  name: string;
  /** 필수. DB age NOT NULL */
  age: string;
  /** 숙박형만 필수. DB gender NULL */
  gender: Gender | "";
  /** 선택. DB countryCode NULL */
  countryCode: string;
  /** 선택. 숫자만 10~11자리. DB phone NULL */
  phone: string;
  /** 선택. DB email NULL */
  email: string;
};

/** 예약 약관. DB nirvana_booking.bookingTerms */
export type BookingTerm = {
  id: string;
  code: string;
  title: string;
  content: string;
  version: string;
  required: boolean;
};

/** 환불 규칙. 이용일 기준 며칠 전까지 몇 % 환불 */
export type RefundRule = {
  deadlineDaysBefore: number;
  refundRate: number;
};

/** 오른쪽 요약에 보여줄 예약 내용 (1단계에서 넘어온 값) */
export type BookingSelection = {
  programName: string;
  templeName: string;
  category: string;
  image: string;
  scheduleLabel: string;
  stayLabel: string;
  /** 회차 시간 안내. 숙박형 "입실 14:00", 당일형 "10:00 – 12:30" */
  timeLabel: string;
  adultCount: number;
  youthCount: number;
  adultPrice: number;
  youthPrice: number;
  totalPrice: number;
  /** 1단계로 돌아가 날짜·인원을 바꾸는 주소 (선택값 유지) */
  editHref: string;
  programId: number;
  /** 고른 회차. 결제 화면에 예약번호를 만들 때 씁니다. */
  scheduleId: string;
  /** 입실일 YYYY-MM-DD */
  scheduleStart: string;
};
