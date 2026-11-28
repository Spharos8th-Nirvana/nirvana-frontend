"use client";

import { useCallback, useState } from "react";
import MyBookingDetailPanel from "@/features/booking/components/organisms/MyBookingDetailPanel";
import MyBookingList from "@/features/booking/components/organisms/MyBookingList";
import type { BookingView } from "@/features/booking/types/booking-view";
import {
  bookingStatusTabs,
  filterBookingsByTab,
  type BookingStatusTabId,
} from "@/features/booking/utils/booking-status";

type MyBookingsTemplateProps = {
  bookings: BookingView[];
};

/** 마이페이지 예약 내역: 상태 탭 + 목록 + 상세 패널 */
export default function MyBookingsTemplate({ bookings }: MyBookingsTemplateProps) {
  const [activeTab, setActiveTab] = useState<BookingStatusTabId>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(null);

  // 패널의 Esc 처리(useEffect)가 매번 다시 등록되지 않도록 같은 함수를 유지합니다.
  const closeDetail = useCallback(() => setSelectedBooking(null), []);

  const visibleBookings = filterBookingsByTab(bookings, activeTab);
  const activeLabel = bookingStatusTabs.find((tab) => tab.id === activeTab)?.label;
  const emptyMessage =
    activeTab === "ALL" ? "아직 예약한 체험이 없어요." : `${activeLabel} 예약이 없어요.`;

  return (
    <section>
      <h2 className="text-xl font-bold text-ink">예약 내역</h2>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {bookingStatusTabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-ink-nav hover:border-primary hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <MyBookingList
        bookings={visibleBookings}
        emptyMessage={emptyMessage}
        onSelect={setSelectedBooking}
      />

      {selectedBooking && <MyBookingDetailPanel booking={selectedBooking} onClose={closeDetail} />}
    </section>
  );
}
