import type {
  BookingStatus,
  BookingView,
  PaymentStatus,
} from "@/features/booking/types/booking-view";

/** 예약 상태 화면 이름 */
export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "결제 대기",
  CONFIRMED: "예약 완료",
  COMPLETED: "체험 완료",
  CANCELED: "취소",
  NOSHOW: "미참석",
};

/** 결제 상태 화면 이름 */
export const paymentStatusLabels: Record<PaymentStatus, string> = {
  UNPAID: "결제 전",
  PENDING: "결제 확인 중",
  PAID: "결제 완료",
  FAILED: "결제 실패",
  CANCELED: "결제 취소",
  PARTIAL_REFUNDED: "부분 환불",
  REFUNDED: "전액 환불",
};

/** 상태 탭. 미참석(NOSHOW)은 탭이 없고 '전체'에서만 보입니다. */
export const bookingStatusTabs = [
  { id: "ALL", label: "전체" },
  { id: "PENDING_PAYMENT", label: "결제 대기" },
  { id: "CONFIRMED", label: "예약 완료" },
  { id: "COMPLETED", label: "체험 완료" },
  { id: "CANCELED", label: "취소" },
] as const;

export type BookingStatusTabId = (typeof bookingStatusTabs)[number]["id"];

/** 고른 탭에 맞는 예약만 남깁니다. */
export function filterBookingsByTab(bookings: BookingView[], tabId: BookingStatusTabId) {
  if (tabId === "ALL") {
    return bookings;
  }

  return bookings.filter((booking) => booking.status === tabId);
}

/** "2026-12-13" → "2026.12.13" */
function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}

/** 당일 체험은 날짜 하나, 숙박 체험은 "시작 ~ 끝" */
export function formatBookingPeriod(booking: BookingView): string {
  const start = formatDate(booking.operationStartDate);

  if (booking.operationStartDate === booking.operationEndDate) {
    return start;
  }

  return `${start} ~ ${formatDate(booking.operationEndDate)}`;
}

/** "14:00:00" → "14:00" */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}

/** "2026-11-28T21:30:00" → "2026.11.28 21:30" */
export function formatDateTime(dateTime: string): string {
  const [date, time = ""] = dateTime.split("T");

  return `${formatDate(date)} ${formatTime(time)}`.trim();
}

/** "2026-11-28T21:30:00" → "11.28 21:30" (목록처럼 좁은 곳에서 연도를 뺄 때) */
export function formatShortDateTime(dateTime: string): string {
  return formatDateTime(dateTime).slice(5);
}

/** 성인 2 · 청소년 1 (0명인 쪽은 뺍니다) */
export function formatHeadcount(booking: BookingView): string {
  const parts = [`성인 ${booking.adultCount}`];

  if (booking.youthCount > 0) {
    parts.push(`청소년 ${booking.youthCount}`);
  }

  return parts.join(" · ");
}
