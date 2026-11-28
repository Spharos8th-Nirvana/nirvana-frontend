"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingStatusBadge from "@/features/booking/components/molecules/BookingStatusBadge";
import type { BookingStatus, BookingView } from "@/features/booking/types/booking-view";
import {
  formatBookingPeriod,
  formatDateTime,
  formatHeadcount,
  formatTime,
  paymentStatusLabels,
} from "@/features/booking/utils/booking-status";
import { primaryButtonClassName } from "@/shared/components/ui/Button";
import { formatWon } from "@/shared/utils/format";

/** 상태별 다음 행동 버튼. 후기 작성만 연결했고, 결제하기·예약 취소는 다음 Issue에서 연결하므로 지금은 비활성입니다. */
const statusActionLabels: Partial<Record<BookingStatus, string>> = {
  PENDING_PAYMENT: "결제하기",
  CONFIRMED: "예약 취소",
  COMPLETED: "후기 작성",
};

type MyBookingDetailPanelProps = {
  booking: BookingView;
  onClose: () => void;
};

/**
 * 예약 상세 패널 (읽기 전용).
 * 오른쪽에서 밀려 나오고, 닫기·패널 밖·Esc를 누르면 다시 밀려 들어간 뒤 사라집니다.
 */
export default function MyBookingDetailPanel({ booking, onClose }: MyBookingDetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    // 움직임 줄이기 설정을 켠 사용자는 애니메이션이 없으므로 바로 닫습니다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    setIsClosing(true);
  }, [onClose]);

  useEffect(() => {
    // 패널이 열리면 닫기 버튼으로 포커스를 옮겨 키보드 사용자가 바로 닫을 수 있게 합니다.
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestClose]);

  const actionLabel = statusActionLabels[booking.status];

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
    ...(booking.status === "PENDING_PAYMENT" && booking.expiresAt
      ? [{ label: "결제 기한", value: `${formatDateTime(booking.expiresAt)}까지` }]
      : []),
    ...(booking.refundAmount > 0
      ? [{ label: "환불 금액", value: formatWon(booking.refundAmount) }]
      : []),
    { label: "예약자", value: `${booking.contactName} · ${booking.contactPhone}` },
    { label: "요청 사항", value: booking.requestNote ?? "없음" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* 패널 밖(어두운 배경)을 누르면 닫힙니다. 열릴 때 서서히 어두워집니다. */}
      <button
        type="button"
        aria-label="예약 상세 닫기"
        tabIndex={-1}
        onClick={requestClose}
        className={`absolute inset-0 cursor-default bg-black/40 transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        // starting: 처음 나타날 때의 모습(오른쪽 밖) → 기본 모습(제자리)으로 미끄러져 들어옵니다.
        onTransitionEnd={(event) => {
          if (isClosing && event.target === event.currentTarget) {
            onClose();
          }
        }}
        className={`relative flex h-full w-full max-w-[420px] flex-col bg-surface shadow-xl transition-transform duration-300 ease-out starting:translate-x-full motion-reduce:transition-none ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
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
            onClick={requestClose}
            className="rounded-full px-3 py-1 text-sm text-muted transition hover:bg-subtle hover:text-ink"
          >
            닫기
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <dl className="divide-y divide-border px-6">
            {detailRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[88px_1fr] gap-4 py-3 text-sm">
                <dt className="text-muted">{row.label}</dt>
                <dd className="break-words text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="px-6 py-6">
            <h3 className="text-sm font-semibold text-ink">
              참가자 {booking.participants.length}명
            </h3>
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
        </div>

        {/* 상태에 맞는 다음 행동 버튼. 패널 아래쪽에 고정됩니다. */}
        {actionLabel && (
          <footer className="border-t border-border px-6 py-4">
            {booking.status === "COMPLETED" ? (
              // 후기 작성은 후기 작성 화면으로 이동합니다.
              <Link
                href={`/mypage/reviews/new?booking=${booking.bookingUuid}`}
                className={`${primaryButtonClassName} w-full`}
              >
                {actionLabel}
              </Link>
            ) : (
              <>
                <button type="button" disabled className={`${primaryButtonClassName} w-full`}>
                  {actionLabel}
                </button>
                <p className="mt-2 text-center text-xs text-muted">준비 중인 기능이에요.</p>
              </>
            )}
          </footer>
        )}
      </section>
    </div>
  );
}
