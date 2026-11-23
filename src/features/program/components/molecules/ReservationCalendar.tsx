"use client";

import { useState } from "react";

type ReservationCalendarProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function ReservationCalendar({
  selectedDate,
  onDateChange,
}: ReservationCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    const date = new Date(year, month, day);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  return (
    <section>
      {/* 달력 상단 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          className="px-3 py-2 text-lg text-ink transition hover:bg-[#F5F5F3]"
          aria-label="이전 달"
        >
          ‹
        </button>

        <h3 className="font-semibold text-ink">
          {year}년 {month + 1}월
        </h3>

        <button
          type="button"
          onClick={nextMonth}
          className="px-3 py-2 text-lg text-ink transition hover:bg-[#F5F5F3]"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* 요일 */}
      <div className="mt-5 grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-[#999999]">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: lastDate }, (_, index) => index + 1).map(
          (day) => {
            const dateValue = formatDate(day);
            const disabled = isPastDate(day);
            const selected = selectedDate === dateValue;

            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => onDateChange(dateValue)}
                className={`mx-auto flex h-9 w-9 items-center justify-center text-sm transition-colors ${
                  selected
                    ? "bg-primary font-semibold text-white"
                    : disabled
                      ? "cursor-not-allowed text-[#D5D5D0]"
                      : "text-ink hover:bg-[#F0F1EE]"
                }`}
              >
                {day}
              </button>
            );
          },
        )}
      </div>
    </section>
  );
}
