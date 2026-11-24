"use client";

import { useState } from "react";
import type { ProgramSchedule } from "@/features/program/data/program-schedules";
import { isScheduleAvailable } from "@/features/program/utils/booking";

type ReservationCalendarProps = {
  schedules: ProgramSchedule[];
  selectedScheduleId: string;
  onScheduleChange: (scheduleId: string) => void;
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(year: number, monthIndex: number, day: number) {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** 첫 화면에 보여줄 달: 선택한 회차 → 예약 가능한 첫 회차 → 첫 회차 순 */
function getInitialMonth(schedules: ProgramSchedule[], selectedId: string) {
  const base =
    schedules.find((schedule) => schedule.id === selectedId) ??
    schedules.find(isScheduleAvailable) ??
    schedules[0];

  if (!base) {
    const today = new Date();
    return { year: today.getFullYear(), monthIndex: today.getMonth() };
  }

  const [year, month] = base.operationStartDate.split("-").map(Number);
  return { year, monthIndex: month - 1 };
}

export default function ReservationCalendar({
  schedules,
  selectedScheduleId,
  onScheduleChange,
}: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    getInitialMonth(schedules, selectedScheduleId),
  );

  const { year, monthIndex } = currentMonth;
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const lastDate = new Date(year, monthIndex + 1, 0).getDate();

  const selectedSchedule = schedules.find(
    (schedule) => schedule.id === selectedScheduleId,
  );

  // 입실일 → 회차. 같은 날 회차가 여러 개면 예약 가능한 회차를 우선합니다.
  const scheduleByStartDate = new Map<string, ProgramSchedule>();
  for (const schedule of schedules) {
    const existing = scheduleByStartDate.get(schedule.operationStartDate);
    if (!existing || (!isScheduleAvailable(existing) && isScheduleAvailable(schedule))) {
      scheduleByStartDate.set(schedule.operationStartDate, schedule);
    }
  }

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
          const schedule = scheduleByStartDate.get(dateKey);
          const available = schedule ? isScheduleAvailable(schedule) : false;
          const soldOut = schedule !== undefined && !available;

          const isRangeEdge =
            selectedSchedule !== undefined &&
            (dateKey === selectedSchedule.operationStartDate ||
              dateKey === selectedSchedule.operationEndDate);
          const isInRange =
            selectedSchedule !== undefined &&
            dateKey > selectedSchedule.operationStartDate &&
            dateKey < selectedSchedule.operationEndDate;

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <button
                type="button"
                disabled={!available}
                onClick={() => schedule && onScheduleChange(schedule.id)}
                aria-pressed={isRangeEdge}
                aria-label={
                  soldOut
                    ? `${monthIndex + 1}월 ${day}일 마감`
                    : available
                      ? `${monthIndex + 1}월 ${day}일 입실 회차 선택`
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
                <span className="mt-0.5 text-[10px] leading-none text-muted/70">
                  마감
                </span>
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
