"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReservationCalendar from "@/features/program/components/molecules/ReservationCalendar";
import type { ProgramSchedule } from "@/features/program/data/program-schedules";
import {
  buildBookingHref,
  calculateTotalPrice,
  formatScheduleRange,
  formatWon,
  getRemainingSeats,
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
  const [scheduleId, setScheduleId] = useState(initialScheduleId);
  const [adultCount, setAdultCount] = useState(initialAdultCount);
  const [youthCount, setYouthCount] = useState(initialYouthCount);

  const selectedSchedule = schedules.find((schedule) => schedule.id === scheduleId);
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

  const canProceed = selectedSchedule !== undefined && totalCount > 0 && !isOverCapacity;

  const handleProceed = () => {
    if (!selectedSchedule || !canProceed) {
      return;
    }

    router.push(
      buildBookingHref({
        programId,
        scheduleId: selectedSchedule.id,
        adultCount,
        youthCount: appliedYouthCount,
      }),
    );
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
      <h2 className="text-lg font-bold text-ink">나의 고요를 예약하세요</h2>

      {/* 회차(입실일) 선택 */}
      <div className="mt-6">
        <ReservationCalendar
          schedules={schedules}
          selectedScheduleId={scheduleId}
          onScheduleChange={setScheduleId}
        />
      </div>

      {/* 선택한 회차 */}
      <div className="mt-4 rounded-md bg-subtle px-4 py-3 text-sm">
        {selectedSchedule ? (
          <>
            <p className="font-semibold text-ink">{formatScheduleRange(selectedSchedule)}</p>
            <p className="mt-1 text-xs text-muted">
              입실 {selectedSchedule.startTime} · 남은 자리 {remainingSeats}석
            </p>
          </>
        ) : (
          <p className="text-muted">입실일을 선택해 주세요.</p>
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
