"use client";

import { useEffect, useRef } from "react";
import BookingStatusBadge from "@/features/booking/components/molecules/BookingStatusBadge";
import type { BookingView } from "@/features/booking/types/booking-view";
import {
  formatBookingPeriod,
  formatHeadcount,
  formatTime,
  paymentStatusLabels,
} from "@/features/booking/utils/booking-status";
import { formatWon } from "@/shared/utils/format";

type MyBookingDetailPanelProps = {
  booking: BookingView;
  onClose: () => void;
};

/** 예약 상세 패널 (읽기 전용). 오른쪽에서 열리고, 닫기·패널 밖·Esc로 닫힙니다. */
export default function MyBookingDetailPanel({ booking, onClose }: MyBookingDetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 패널이 열리면 닫기 버튼으로 포커스를 옮겨 키보드 사용자가 바로 닫을 수 있게 합니다.
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const detailRows = [
    { label: "예약 번호", value: booking.bookingNumber },
    { label: "체험 일정", value: formatBookingPeriod(booking) },
    {
      label: "체험 시간",
      value: `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`,
    },
    { label: "인원", value: formatHeadcount(booking) },
    { label: "결제 금액", value: formatWon(booking.totalPrice) },
    { label: "결제 상태", value: paymentStatusLabels[booking.paymentStatus] },
    ...(booking.refundAmount > 0
      ? [{ label: "환불 금액", value: formatWon(booking.refundAmount) }]
      : []),
    { label: "예약자", value: `${booking.contactName} · ${booking.contactPhone}` },
    { label: "요청 사항", value: booking.requestNote ?? "없음" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* 패널 밖(어두운 배경)을 누르면 닫힙니다. */}
      <button
        type="button"
        aria-label="예약 상세 닫기"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        className="relative flex h-full w-full max-w-[420px] flex-col overflow-y-auto bg-surface shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs text-muted">{booking.templeName}</p>
            <h2 id="booking-detail-title" className="mt-1 text-lg font-bold text-ink">
              {booking.programTitle}
            </h2>
            <div className="mt-3">
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-muted transition hover:bg-subtle hover:text-ink"
          >
            닫기
          </button>
        </header>

        <dl className="divide-y divide-border px-6">
          {detailRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[88px_1fr] gap-4 py-3 text-sm">
              <dt className="text-muted">{row.label}</dt>
              <dd className="break-words text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="px-6 py-6">
          <h3 className="text-sm font-semibold text-ink">참가자 {booking.participants.length}명</h3>
          <ul className="mt-3 space-y-2">
            {booking.participants.map((participant, index) => (
              <li
                key={`${participant.name}-${index}`}
                className="flex items-center justify-between rounded-default bg-subtle px-4 py-3 text-sm"
              >
                <span className="text-ink">
                  {participant.name}
                  {participant.isRepresentative && (
                    <span className="ml-2 text-xs font-semibold text-primary">대표</span>
                  )}
                </span>
                <span className="text-muted">
                  {participant.type === "ADULT" ? "성인" : "청소년"} · {participant.age}세 ·{" "}
                  {formatWon(participant.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
