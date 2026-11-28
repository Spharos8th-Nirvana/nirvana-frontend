import BookingStatusBadge from "@/features/booking/components/molecules/BookingStatusBadge";
import type { BookingStatus, BookingView } from "@/features/booking/types/booking-view";
import {
  formatBookingPeriod,
  formatDateTime,
  formatHeadcount,
} from "@/features/booking/utils/booking-status";

/** 상태별 다음 행동 버튼. 동작은 다음 Issue에서 연결하므로 지금은 비활성입니다. */
const statusActionLabels: Partial<Record<BookingStatus, string>> = {
  PENDING_PAYMENT: "결제하기",
  CONFIRMED: "예약 취소",
  COMPLETED: "후기 작성",
};

/** 넓은 화면에서 머리글과 각 행이 같은 칸 너비를 씁니다. */
const gridClassName =
  "md:grid md:grid-cols-[80px_minmax(0,1fr)_190px_110px_160px_190px] md:items-center";

type MyBookingListProps = {
  bookings: BookingView[];
  emptyMessage: string;
  onSelect: (booking: BookingView) => void;
};

export default function MyBookingList({ bookings, emptyMessage, onSelect }: MyBookingListProps) {
  if (bookings.length === 0) {
    return (
      <p className="mt-6 border-y border-border py-16 text-center text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-6">
      {/* 머리글은 넓은 화면에서만 보입니다. 휴대폰에서는 행마다 카드처럼 쌓입니다. */}
      <div
        className={`${gridClassName} hidden border-y border-border bg-subtle px-4 py-3 text-sm font-semibold text-ink md:grid`}
      >
        <span>사찰명</span>
        <span>체험명</span>
        <span>체험 날짜</span>
        <span>인원</span>
        <span>상태</span>
        <span className="sr-only">관리</span>
      </div>

      <ul className="border-t border-border md:border-t-0">
        {bookings.map((booking) => {
          const actionLabel = statusActionLabels[booking.status];

          return (
            <li
              key={booking.bookingUuid}
              className={`${gridClassName} flex flex-col gap-2 border-b border-border px-4 py-5 text-sm text-ink`}
            >
              <span className="font-semibold md:font-normal">{booking.templeName}</span>
              <span className="font-medium break-keep md:pr-4">{booking.programTitle}</span>
              <span className="text-muted">{formatBookingPeriod(booking)}</span>
              <span className="text-muted">{formatHeadcount(booking)}</span>
              <span className="flex flex-col items-start gap-1">
                <BookingStatusBadge status={booking.status} />
                {booking.status === "PENDING_PAYMENT" && booking.expiresAt && (
                  <span className="text-xs text-error">
                    {formatDateTime(booking.expiresAt)}까지 결제
                  </span>
                )}
              </span>
              <span className="mt-2 flex gap-2 md:mt-0 md:justify-end">
                <button
                  type="button"
                  onClick={() => onSelect(booking)}
                  className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-subtle"
                >
                  상세 보기
                </button>
                {actionLabel && (
                  <button
                    type="button"
                    disabled
                    title="준비 중"
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted disabled:cursor-not-allowed"
                  >
                    {actionLabel}
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
