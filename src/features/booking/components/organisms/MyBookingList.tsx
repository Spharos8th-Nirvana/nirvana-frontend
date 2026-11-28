import BookingStatusBadge from "@/features/booking/components/molecules/BookingStatusBadge";
import type { BookingView } from "@/features/booking/types/booking-view";
import {
  formatBookingPeriod,
  formatHeadcount,
  formatShortDateTime,
} from "@/features/booking/utils/booking-status";

/** 넓은 화면에서 머리글과 각 행이 같은 칸 너비·간격을 씁니다. */
const gridClassName =
  "md:grid md:grid-cols-[72px_minmax(0,1fr)_170px_110px_150px] md:items-center md:gap-x-4";

type MyBookingListProps = {
  bookings: BookingView[];
  emptyMessage: string;
  onSelect: (booking: BookingView) => void;
};

export default function MyBookingList({ bookings, emptyMessage, onSelect }: MyBookingListProps) {
  if (bookings.length === 0) {
    return (
      <p className="mt-6 rounded-default border border-border bg-surface py-16 text-center text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-default border border-border bg-surface">
      {/* 머리글은 넓은 화면에서만 보입니다. 휴대폰에서는 행마다 카드처럼 쌓입니다. */}
      <div
        className={`${gridClassName} hidden border-b border-border bg-subtle px-4 py-3 text-sm font-semibold text-ink md:grid`}
      >
        <span>사찰명</span>
        <span>체험명</span>
        <span>체험 날짜</span>
        <span>인원</span>
        {/* 상태 칸은 배지만으로 알 수 있어서 제목을 화면에서 숨기고, 화면 읽기 프로그램에만 알려 줍니다. */}
        <span className="sr-only">상태</span>
      </div>

      <ul>
        {bookings.map((booking) => (
          <li
            key={booking.bookingUuid}
            // 줄 어디를 눌러도 상세 패널이 열리고, 마우스를 올리면 줄 배경이 바뀝니다.
            // 결제 기한 문구가 있는 줄도 높이가 같도록 넓은 화면에서 줄 높이를 고정합니다.
            className={`${gridClassName} relative flex flex-col gap-2 border-b border-border px-4 py-5 text-sm text-ink transition last:border-b-0 hover:bg-subtle md:h-[84px] md:py-0`}
          >
            <span className="font-semibold md:font-normal">{booking.templeName}</span>
            {/* 체험명 버튼의 투명한 덮개(after)가 줄 전체를 덮어서, 줄 어디를 눌러도 이 버튼이 눌립니다. */}
            <button
              type="button"
              onClick={() => onSelect(booking)}
              aria-haspopup="dialog"
              className="text-left font-medium break-keep after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-inset"
            >
              {booking.programTitle}
            </button>
            <span className="text-muted">{formatBookingPeriod(booking)}</span>
            {/* 휴대폰: 인원 줄 오른쪽에 상태 배지 / 넓은 화면: md:contents로 묶음을 풀어 각자 표의 한 칸이 됩니다. */}
            <div className="flex items-start justify-between gap-4 md:contents">
              <span className="pt-0.5 whitespace-nowrap text-muted md:pt-0">
                {formatHeadcount(booking)}
              </span>
              {/* pointer-events-none: 이 칸을 눌러도 위의 덮개가 눌리게 합니다.
                  넓은 화면에서는 결제 기한을 배지 아래에 겹쳐 띄워서(absolute) 배지가 다른 칸과 같은 높이에 오게 합니다. */}
              <span className="pointer-events-none relative flex flex-col items-end gap-1">
                <BookingStatusBadge status={booking.status} />
                {booking.status === "PENDING_PAYMENT" && booking.expiresAt && (
                  <span className="text-xs whitespace-nowrap text-error md:absolute md:top-full md:right-0 md:mt-1">
                    {formatShortDateTime(booking.expiresAt)}까지 결제
                  </span>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
