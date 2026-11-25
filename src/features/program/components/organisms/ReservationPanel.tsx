"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import ReservationCalendar from "@/features/program/components/molecules/ReservationCalendar";
import type { ProgramSchedule } from "@/features/program/data/program-schedules";
import { previewLoginSnapshot, safeNextPath } from "@/features/guide/utils/preview-login";
import SeatCookieAlign from "@/features/booking/components/organisms/SeatCookieAlign";
import {
  alignSeatCookie,
  heldFromSnapshot,
  seatHoldsServerSnapshot,
  seatHoldsSnapshot,
  subscribeSeatHolds,
} from "@/features/booking/utils/pending-payment";
import {
  buildBookingHref,
  calculateTotalPrice,
  formatScheduleRange,
  formatScheduleTime,
  formatWon,
  getRemainingSeats,
  groupSchedulesByStartDate,
  isScheduleAvailable,
} from "@/features/program/utils/booking";

type ReservationPanelProps = {
  programId: number;
  adultPrice: number;
  youthPrice: number;
  youthAllowed: boolean;
  schedules: ProgramSchedule[];
  /** 2단계에서 "변경"으로 돌아왔을 때 이어서 보여줄 선택값 */
  initialScheduleId?: string;
  initialAdultCount?: number;
  initialYouthCount?: number;
};

type CountStepperProps = {
  label: string;
  description: string;
  count: number;
  min: number;
  canIncrease: boolean;
  onChange: (count: number) => void;
};

function CountStepper({
  label,
  description,
  count,
  min,
  canIncrease,
  onChange,
}: CountStepperProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="mt-1 text-xs text-muted/70">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(count - 1)}
          disabled={count <= min}
          aria-label={`${label} 인원 줄이기`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary transition hover:bg-subtle disabled:opacity-30"
        >
          −
        </button>
        <span className="w-5 text-center font-bold text-ink" aria-live="polite">
          {count}
        </span>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          disabled={!canIncrease}
          aria-label={`${label} 인원 늘리기`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary transition hover:bg-subtle disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function ReservationPanel({
  programId,
  adultPrice,
  youthPrice,
  youthAllowed,
  schedules,
  initialScheduleId = "",
  initialAdultCount = 1,
  initialYouthCount = 0,
}: ReservationPanelProps) {
  const router = useRouter();
  const holds = useSyncExternalStore(subscribeSeatHolds, seatHoldsSnapshot, seatHoldsServerSnapshot);
  // 화면에서만 결제대기·확정 인원만큼 예약된 자리를 더합니다. 원래 회차 데이터는 바꾸지 않습니다.
  const visibleSchedules = useMemo(
    () => holds === null
      ? []
      : schedules.map((schedule) => ({
        ...schedule,
        reservedCount: schedule.reservedCount + heldFromSnapshot(holds, schedule.id),
      })),
    [holds, schedules],
  );
  const schedulesByDate = useMemo(() => groupSchedulesByStartDate(visibleSchedules), [visibleSchedules]);

  // 2단계에서 돌아왔다면 그 회차의 날짜와 회차를 이어서 선택해 둡니다.
  const initialSchedule = schedules.find((schedule) => schedule.id === initialScheduleId);
  const [selectedDate, setSelectedDate] = useState(initialSchedule?.operationStartDate ?? "");
  const [scheduleId, setScheduleId] = useState(initialSchedule?.id ?? "");
  const [adultCount, setAdultCount] = useState(initialAdultCount);
  const [youthCount, setYouthCount] = useState(initialYouthCount);

  const daySchedules = selectedDate ? (schedulesByDate.get(selectedDate) ?? []) : [];
  const hasMultipleSessions = daySchedules.length > 1;
  const selectedSchedule = visibleSchedules.find((schedule) => schedule.id === scheduleId);

  // 날짜를 고르면: 그날 예약 가능한 회차가 하나뿐이면 바로 선택, 여러 개면 시간을 고르게 합니다.
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const available = (schedulesByDate.get(date) ?? []).filter(isScheduleAvailable);
    setScheduleId(available.length === 1 ? available[0].id : "");
  };
  const remainingSeats = selectedSchedule ? getRemainingSeats(selectedSchedule) : null;

  // 청소년 참여가 허용되지 않은 프로그램은 청소년 인원을 0으로 계산합니다.
  const appliedYouthCount = youthAllowed ? youthCount : 0;
  const totalCount = adultCount + appliedYouthCount;
  const isOverCapacity = remainingSeats !== null && totalCount > remainingSeats;
  const canIncrease = remainingSeats === null || totalCount < remainingSeats;

  const totalPrice = calculateTotalPrice(
    { adultPrice, youthPrice },
    { adultCount, youthCount: appliedYouthCount },
  );

  const canProceed = selectedSchedule !== undefined && isScheduleAvailable(selectedSchedule) && totalCount > 0 && !isOverCapacity;

  const handleProceed = () => {
    const schedule = schedules.find((item) => item.id === scheduleId);
    if (!schedule?.bookable || totalCount < 1 ||
      totalCount > getRemainingSeats(schedule, heldFromSnapshot(seatHoldsSnapshot(), schedule.id))) {
      return;
    }

    alignSeatCookie();
    const href = buildBookingHref({
      programId,
      scheduleId: schedule.id,
      adultCount,
      youthCount: appliedYouthCount,
    });
    if (previewLoginSnapshot() !== "1") {
      router.push(`/login?next=${encodeURIComponent(safeNextPath(href))}`);
      return;
    }
    router.push(href);
  };

  const priceBreakdown = [
    adultCount > 0 ? `${formatWon(adultPrice)} × 성인 ${adultCount}명` : null,
    appliedYouthCount > 0
      ? `${formatWon(youthPrice)} × 청소년 ${appliedYouthCount}명`
      : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="sticky top-28 self-start rounded-lg border border-border bg-white p-6">
      <SeatCookieAlign />
      <h2 className="text-lg font-bold text-ink">나의 고요를 예약하세요</h2>

      {/* 입실일 선택 */}
      <div className="mt-6">
        {holds === null ? (
          <p role="status" className="text-sm text-muted">남은 자리를 확인하고 있습니다.</p>
        ) : (
          <ReservationCalendar
            schedulesByDate={schedulesByDate}
            selectedDate={selectedDate}
            selectedSchedule={selectedSchedule}
            onDateChange={handleDateChange}
          />
        )}
      </div>

      {/* 시간 선택: 하루에 회차가 여러 개인 날만 보입니다. */}
      {hasMultipleSessions && (
        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-ink">시간 선택</legend>
          <div className="mt-2 space-y-2">
            {daySchedules.map((schedule) => {
              const available = isScheduleAvailable(schedule);
              const selected = schedule.id === scheduleId;
              return (
                <label
                  key={schedule.id}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : available
                        ? "cursor-pointer border-border text-ink hover:border-primary"
                        : "cursor-not-allowed border-border text-sage-03"
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule-time"
                    value={schedule.id}
                    checked={selected}
                    disabled={!available}
                    onChange={() => setScheduleId(schedule.id)}
                    className="sr-only"
                  />
                  <span className={`font-bold ${available ? "" : "line-through"}`}>
                    {formatScheduleTime(schedule)}
                  </span>
                  <span className={`text-xs ${selected ? "text-white/80" : "text-muted"}`}>
                    {available ? `남은 자리 ${getRemainingSeats(schedule)}석` : "마감"}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 선택한 회차 */}
      <div className="mt-4 rounded-md bg-subtle px-4 py-3 text-sm">
        {selectedSchedule ? (
          <>
            <p className="font-semibold text-ink">{formatScheduleRange(selectedSchedule)}</p>
            <p className="mt-1 text-xs text-muted">
              {selectedSchedule.operationStartDate === selectedSchedule.operationEndDate
                ? formatScheduleTime(selectedSchedule)
                : `입실 ${selectedSchedule.startTime}`}
              {" · "}남은 자리 {remainingSeats}석
            </p>
          </>
        ) : (
          <p className="text-muted">
            {selectedDate ? "시간을 선택해 주세요." : "입실일을 선택해 주세요."}
          </p>
        )}
      </div>

      {/* 인원 선택 */}
      <div className="mt-5 border-t border-border pt-2">
        <CountStepper
          label="성인"
          description="만 19세 이상"
          count={adultCount}
          min={0}
          canIncrease={canIncrease}
          onChange={setAdultCount}
        />

        {youthAllowed && (
          <div className="border-t border-border">
            <CountStepper
              label="청소년"
              description={`만 19세 미만 · ${formatWon(youthPrice)}`}
              count={youthCount}
              min={0}
              canIncrease={canIncrease}
              onChange={setYouthCount}
            />
          </div>
        )}

        {isOverCapacity && (
          <p className="pb-2 text-xs text-error" role="alert">
            남은 자리({remainingSeats}석)보다 인원이 많아요. 인원을 줄여 주세요.
          </p>
        )}
      </div>

      {/* 총 결제 예정 금액 */}
      <div className="mt-3 border-t border-border pt-5">
        <p className="text-sm text-muted">총 결제 예정 금액</p>
        <p className="mt-2 whitespace-nowrap text-2xl font-bold text-ink">
          {formatWon(totalPrice)}
        </p>
        {priceBreakdown && (
          <p className="mt-1 text-xs leading-5 text-muted">{priceBreakdown}</p>
        )}
      </div>

      {/* 다음 단계 */}
      <button
        type="button"
        onClick={handleProceed}
        disabled={!canProceed}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-action py-4 font-bold text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        예약 정보 입력
        <span aria-hidden="true">→</span>
      </button>

      <p className="mt-3 text-right text-xs text-muted/70">
        예약 전 취소·환불 규정을 확인해 주세요.
      </p>
    </div>
  );
}
