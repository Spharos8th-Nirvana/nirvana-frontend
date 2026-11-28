/**
 * 마이페이지 예약 내역 타입.
 * DB nirvana_booking_query.bookingViews(예약 화면용 조회 테이블) 칸 이름을 그대로 씁니다.
 * 실제 응답 타입은 예약 API(Swagger) 확정 후 맞춥니다.
 */
import type { Gender, ParticipantType } from "@/features/booking/types/booking";

/** DB ENUM('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NOSHOW') */
export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELED" | "NOSHOW";

/** DB ENUM('UNPAID', 'PENDING', 'PAID', 'FAILED', 'CANCELED', 'PARTIAL_REFUNDED', 'REFUNDED') */
export type PaymentStatus =
  "UNPAID" | "PENDING" | "PAID" | "FAILED" | "CANCELED" | "PARTIAL_REFUNDED" | "REFUNDED";

/** bookingViews.participants(JSON) 한 명. bookingParticipants 칸을 따릅니다. */
export type BookingViewParticipant = {
  isRepresentative: boolean;
  name: string;
  age: number;
  gender: Gender | null;
  type: ParticipantType;
  price: number;
};

/** bookingViews 한 행 = 예약 내역 화면의 예약 하나 */
export type BookingView = {
  bookingUuid: string;
  bookingNumber: string;
  templeName: string;
  programTitle: string;
  /** DATE, 예: "2026-12-13" */
  operationStartDate: string;
  operationEndDate: string;
  /** TIME, 예: "14:00:00" */
  startTime: string;
  endTime: string;
  adultCount: number;
  youthCount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  refundAmount: number;
  contactName: string;
  contactPhone: string;
  requestNote: string | null;
  participants: BookingViewParticipant[];
  /** 결제 기한 (신청 시각 + 3시간). 결제 대기일 때만 의미가 있습니다. */
  expiresAt: string | null;
};
