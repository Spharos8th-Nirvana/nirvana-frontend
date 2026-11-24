"use client";

import { useState } from "react";
import type { ProgramSchedule } from "@/features/program/data/program-schedules";
import { isScheduleAvailable } from "@/features/program/utils/booking";

type ReservationCalendarProps = {
  /** 입실일 → 그날 시작하는 회차들 */
  schedulesByDate: Map<string, ProgramSchedule[]>;
  /** 고른 입실일 (YYYY-MM-DD) */
  selectedDate: string;
  /** 고른 회차. 여러 날 머무는 프로그램이면 퇴실일까지 기간으로 표시합니다. */
  selectedSchedule?: ProgramSchedule;
  onDateChange: (date: string) => void;
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(year: number, monthIndex: number, day: number) {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** 첫 화면에 보여줄 달: 고른 날짜 → 예약 가능한 첫 날짜 → 첫 날짜 순 */
function getInitialMonth(schedulesByDate: Map<string, ProgramSchedule[]>, selectedDate: string) {
  const dates = [...schedulesByDate.keys()].sort();
  const base =
    selectedDate ||
    dates.find((date) => schedulesByDate.get(date)?.some(isScheduleAvailable)) ||
    dates[0];

  if (!base) {
    const today = new Date();
    return { year: today.getFullYear(), monthIndex: today.getMonth() };
  }

  const [year, month] = base.split("-").map(Number);
  return { year, monthIndex: month - 1 };
}

/** 입실일 선택 달력. 하루에 회차가 여러 개여도 날짜 단위로 고릅니다. */
export default function ReservationCalendar({
  schedulesByDate,
  selectedDate,
  selectedSchedule,
  onDateChange,
}: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    getInitialMonth(schedulesByDate, selectedDate),
  );

  const { year, monthIndex } = currentMonth;
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const lastDate = new Date(year, monthIndex + 1, 0).getDate();

  // 표시할 기간: 회차를 골랐으면 입실~퇴실, 날짜만 골랐으면 그날 하루
  const rangeStart = selectedSchedule?.operationStartDate ?? selectedDate;
  const rangeEnd = selectedSchedule?.operationEndDate ?? selectedDate;

  const moveMonth = (offset: number) => {
    const next = new Date(year, monthIndex + offset, 1);
    setCurrentMonth({ year: next.getFullYear(), monthIndex: next.getMonth() });
  };

  return (
    <section>
      {/* 달력 상단 */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">
          {year}년 {monthIndex + 1}월
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="flex h-8 w-8 items-center justify-center text-lg text-ink transition hover:bg-subtle"
            aria-label="이전 달"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="flex h-8 w-8 items-center justify-center text-lg text-ink transition hover:bg-subtle"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>
      </div>

      {/* 요일 */}
      <div className="mt-4 grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-muted/70">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: lastDate }, (_, index) => index + 1).map((day) => {
          const dateKey = toDateKey(year, monthIndex, day);
          const daySchedules = schedulesByDate.get(dateKey) ?? [];
          const available = daySchedules.some(isScheduleAvailable);
          const soldOut = daySchedules.length > 0 && !available;

          const isRangeEdge = Boolean(rangeStart) && (dateKey === rangeStart || dateKey === rangeEnd);
          const isInRange = Boolean(rangeStart) && dateKey > rangeStart && dateKey < rangeEnd;

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <button
                type="button"
                disabled={!available}
                onClick={() => onDateChange(dateKey)}
                aria-pressed={dateKey === selectedDate}
                aria-label={
                  soldOut
                    ? `${monthIndex + 1}월 ${day}일 마감`
                    : available
                      ? `${monthIndex + 1}월 ${day}일 입실일 선택`
                      : undefined
                }
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isRangeEdge
                    ? "bg-primary font-bold text-white"
                    : isInRange
                      ? "bg-subtle text-ink"
                      : available
                        ? "font-semibold text-ink ring-1 ring-sage-03 hover:bg-subtle"
                        : soldOut
                          ? "cursor-not-allowed text-sage-03 line-through"
                          : "cursor-default text-sage-03"
                }`}
              >
                {day}
              </button>
              {soldOut && (
                <span className="mt-0.5 text-[10px] leading-none text-muted/70">마감</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-right text-xs text-muted/70">
        테두리가 있는 날짜를 눌러 입실일을 선택해 주세요.
      </p>
    </section>
  );
}
