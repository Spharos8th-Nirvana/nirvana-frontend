import type { ProgramSchedule } from "@/features/program/data/program-schedules";

const weekDayLabels = ["일", "월", "화", "수", "목", "금", "토"];

/** "YYYY-MM-DD"를 시간대 영향 없이 연·월·일로 나눕니다. */
function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function getWeekDay(value: string) {
  const { year, month, day } = parseDate(value);
  return weekDayLabels[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

/** 회차의 남은 자리 */
export function getRemainingSeats(schedule: ProgramSchedule): number {
  return Math.max(0, schedule.capacity - schedule.reservedCount);
}

/** 예약할 수 있는 회차인지 (판매 중이고 남은 자리가 있음) */
export function isScheduleAvailable(schedule: ProgramSchedule): boolean {
  return schedule.bookable && getRemainingSeats(schedule) > 0;
}

/** 총 결제 예정 금액 = 성인 금액 × 성인 수 + 청소년 금액 × 청소년 수 */
export function calculateTotalPrice(
  prices: { adultPrice: number; youthPrice: number },
  counts: { adultCount: number; youthCount: number },
): number {
  return (
    prices.adultPrice * counts.adultCount +
    prices.youthPrice * counts.youthCount
  );
}

/** 박수를 "1박 2일" 또는 "당일"로 표시 */
export function formatStay(nights: number): string {
  return nights > 0 ? `${nights}박 ${nights + 1}일` : "당일";
}

/** 금액을 "100,000원"으로 표시 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 회차 기간을 "2026.12.05 (토) – 12.06 (일)"로 표시 */
export function formatScheduleRange(schedule: ProgramSchedule): string {
  const start = parseDate(schedule.operationStartDate);
  const end = parseDate(schedule.operationEndDate);
  const pad = (value: number) => String(value).padStart(2, "0");

  const startLabel = `${start.year}.${pad(start.month)}.${pad(start.day)} (${getWeekDay(schedule.operationStartDate)})`;

  if (schedule.operationStartDate === schedule.operationEndDate) {
    return startLabel;
  }

  const endLabel =
    start.year === end.year
      ? `${pad(end.month)}.${pad(end.day)}`
      : `${end.year}.${pad(end.month)}.${pad(end.day)}`;

  return `${startLabel} – ${endLabel} (${getWeekDay(schedule.operationEndDate)})`;
}

/** 주소의 인원 값(0 이상 정수)을 읽습니다. 숫자가 아니면 null */
export function parseCountParam(value: string | string[] | undefined): number | null {
  if (typeof value !== "string" || !/^\d{1,3}$/.test(value)) {
    return null;
  }
  return Number(value);
}

/** 1단계 예약 패널의 id. 2단계에서 "변경"을 누르면 이 위치로 돌아옵니다. */
export const RESERVATION_PANEL_ID = "reservation";

/**
 * 1단계(프로그램 상세 예약 패널)로 돌아가는 주소.
 * 고른 회차와 인원을 그대로 넘겨서, 돌아갔을 때 선택이 남아 있게 합니다.
 */
export function buildReservationEditHref(params: {
  programId: number;
  scheduleId: string;
  adultCount: number;
  youthCount: number;
}): string {
  const query = new URLSearchParams({
    schedule: params.scheduleId,
    adults: String(params.adultCount),
    youth: String(params.youthCount),
  });

  return `/programs/${params.programId}?${query.toString()}#${RESERVATION_PANEL_ID}`;
}

/** 2단계(예약 정보 입력) 주소. 회차와 인원만 전달하고 개인정보는 넣지 않습니다. */
export function buildBookingHref(params: {
  programId: number;
  scheduleId: string;
  adultCount: number;
  youthCount: number;
}): string {
  const query = new URLSearchParams({
    schedule: params.scheduleId,
    adults: String(params.adultCount),
    youth: String(params.youthCount),
  });

  return `/programs/${params.programId}/booking?${query.toString()}`;
}
