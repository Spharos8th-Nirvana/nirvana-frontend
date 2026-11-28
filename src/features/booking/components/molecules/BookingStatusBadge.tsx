import type { BookingStatus } from "@/features/booking/types/booking-view";
import { bookingStatusLabels } from "@/features/booking/utils/booking-status";

/** 상태마다 배지 색을 다르게 해서 목록에서 한눈에 구분되게 합니다. */
const badgeClassNames: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "bg-action text-primary",
  CONFIRMED: "bg-primary text-white",
  COMPLETED: "bg-sage-05 text-sage-07",
  CANCELED: "bg-subtle text-muted",
  NOSHOW: "border border-error/40 text-error",
};

type BookingStatusBadgeProps = {
  status: BookingStatus;
};

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClassNames[status]}`}
    >
      {bookingStatusLabels[status]}
    </span>
  );
}
