import type { BookingSelection } from "@/features/booking/types/booking";

/** 시안과 같이 결제 대기 10분. 이 브라우저 안에서만 유지됩니다. */
const HOLD_MS = 10 * 60 * 1000;
const STORAGE_KEY = "nirvana.pending-payment";

export type BookingStatus = "결제대기" | "예약 확정" | "만료" | "취소 완료" | "이용 완료" | "노쇼";

export type BookingHistory = {
  at: string;
  status: BookingStatus;
  by: string;
  reason: string;
};

export type BookingRefund = {
  rate: number;
  money: number;
  status: string;
  by: string;
  reason: string;
};

export type PendingPayment = {
  id: number;
  programId: number;
  scheduleId: string;
  scheduleStart: string;
  reservationNo: string;
  programName: string;
  templeName: string;
  image: string;
  scheduleLabel: string;
  peopleLabel: string;
  adultCount: number;
  youthCount: number;
  totalPrice: number;
  expiresAt: number;
  status: BookingStatus;
  method: string;
  paidAt: string;
  history: BookingHistory[];
  refund: BookingRefund | null;
};

const LIST_KEY = "nirvana.booking-records";
const SEAT_COOKIE = "nirvana-holds";
const PAYMENT_EVENT = "nirvana-payment";

type SeatHold = {
  id: number;
  scheduleId: string;
  count: number;
  expiresAt: number | null;
  status: "P" | "C";
};

function nowText() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readRecords(): PendingPayment[] {
  return parseBookingRecords(bookingRecordsSnapshot());
}

function getSeatHolds(records: PendingPayment[]): SeatHold[] {
  const holds = new Map<number, SeatHold>();
  for (const record of records) {
    const { id, scheduleId, adultCount, youthCount, expiresAt, status } = record;
    if (
      holds.has(id) || typeof scheduleId !== "string" || !/^[\w-]+$/.test(scheduleId) ||
      !Number.isSafeInteger(adultCount) || adultCount < 0 ||
      !Number.isSafeInteger(youthCount) || youthCount < 0 ||
      (status !== "결제대기" && status !== "예약 확정")
    ) {
      continue;
    }
    const count = adultCount + youthCount;
    if (count > 0 && Number.isSafeInteger(count)) {
      holds.set(id, {
        id, scheduleId, count,
        expiresAt: Number.isSafeInteger(expiresAt) && expiresAt > 0 ? expiresAt : null,
        status: status === "결제대기" ? "P" : "C",
      });
    }
  }
  return [...holds.values()];
}

export function isPaymentExpired(payment: PendingPayment, now = Date.now()) {
  return payment.status === "결제대기" && Number.isSafeInteger(payment.expiresAt) &&
    payment.expiresAt > 0 && payment.expiresAt <= now;
}

function isActiveHold(hold: SeatHold, now: number) {
  return hold.status === "C" || (hold.expiresAt !== null && hold.expiresAt > now);
}

function serializeHolds(holds: SeatHold[]) {
  return holds
    .map(({ id, scheduleId, count, expiresAt, status }) => `${id}:${scheduleId}:${count}:${expiresAt ?? ""}:${status}`)
    .join(",");
}

function countHeldSeats(raw: string | undefined, scheduleId: string, now: number) {
  if (!raw) {
    return 0;
  }
  try {
    const counted = new Set<number>();
    let total = 0;
    for (const part of decodeURIComponent(raw).split(",")) {
      const match = /^(\d+):([\w-]+):(\d+):(\d*):(P|C)$/.exec(part);
      if (!match || match[2] !== scheduleId) {
        continue;
      }
      const [, idText, , countText, expiryText, status] = match;
      const id = Number(idText);
      const count = Number(countText);
      const expiresAt = expiryText ? Number(expiryText) : null;
      if (
        !Number.isSafeInteger(id) || id <= 0 || counted.has(id) ||
        !Number.isSafeInteger(count) || count <= 0 ||
        (expiresAt !== null && (!Number.isSafeInteger(expiresAt) || expiresAt <= 0))
      ) {
        continue;
      }
      if (isActiveHold({ id, scheduleId, count, expiresAt, status: status === "C" ? "C" : "P" }, now)) {
        counted.add(id);
        total += count;
      }
    }
    return total;
  } catch {
    return 0;
  }
}

export function heldFromCookie(raw: string | undefined, scheduleId: string, now = Date.now()) {
  return countHeldSeats(raw, scheduleId, now);
}

export function heldFromSnapshot(snapshot: string, scheduleId: string) {
  // 이 값은 스냅샷을 읽은 시각에 이미 만료 여부를 확인했습니다.
  return countHeldSeats(snapshot, scheduleId, 0);
}

function writeSeatCookie(records: PendingPayment[]) {
  const value = encodeURIComponent(serializeHolds(getSeatHolds(records)));
  const current = document.cookie.split(/;\s*/).find((part) => part.startsWith(`${SEAT_COOKIE}=`));
  if ((current?.slice(SEAT_COOKIE.length + 1) ?? "") !== value) {
    document.cookie = `${SEAT_COOKIE}=${value}; path=/; max-age=86400; SameSite=Lax`;
  }
}

/** 기존 쿠키를 이 탭의 예약 기록으로 맞춥니다. 예약 기록은 수정하지 않습니다. */
export function alignSeatCookie() {
  const raw = bookingRecordsSnapshot();
  if (!raw) {
    return;
  }
  try {
    if (Array.isArray(JSON.parse(raw))) {
      writeSeatCookie(parseBookingRecords(raw));
    }
  } catch {
    // 손상된 기록에서 쿠키를 다시 만들지 않습니다.
  }
}

function writeRecords(records: PendingPayment[]) {
  window.sessionStorage.setItem(LIST_KEY, JSON.stringify(records));
  writeSeatCookie(records);
  window.dispatchEvent(new Event(PAYMENT_EVENT));
}

/** 시간에 따라 바뀌는 좌석만 읽습니다. 결제 상태 저장은 별도로 처리합니다. */
export function seatHoldsSnapshot() {
  const now = Date.now();
  return serializeHolds(getSeatHolds(readRecords()).filter((hold) => isActiveHold(hold, now)));
}

export function seatHoldsServerSnapshot() {
  return null;
}

export function subscribeSeatHolds(onChange: () => void) {
  const unsubscribe = subscribePendingPayment(onChange);
  const timer = window.setInterval(onChange, 1000);
  return () => {
    unsubscribe();
    window.clearInterval(timer);
  };
}

export function bookingRecordsSnapshot() {
  try {
    return window.sessionStorage.getItem(LIST_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseBookingRecords(raw: string): PendingPayment[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is PendingPayment =>
          item !== null && typeof item === "object" && Number.isSafeInteger(item.id) && item.id > 0)
      : [];
  } catch {
    return [];
  }
}

export function findBooking(records: PendingPayment[], id: number) {
  return records.find((item) => item.id === id) ?? null;
}

export function expireDuePayments(now = Date.now()) {
  const records = readRecords();
  const expired = new Map<number, PendingPayment>();
  const next = records.map((record): PendingPayment => {
    if (!isPaymentExpired(record, now)) {
      return record;
    }
    const payment: PendingPayment = {
      ...record,
      status: "만료",
      history: [
        ...(Array.isArray(record.history) ? record.history : []),
        { at: nowText(), status: "만료", by: "시스템", reason: "결제 시간이 지나 좌석 반환" },
      ],
    };
    expired.set(record.id, payment);
    return payment;
  });
  if (expired.size === 0) {
    return;
  }
  const current = readPendingPayment();
  const payment = current ? expired.get(current.id) : undefined;
  if (payment) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  }
  writeRecords(next);
}

function peopleLabel(selection: BookingSelection) {
  const parts = [
    selection.adultCount > 0 ? `성인 ${selection.adultCount}명` : "",
    selection.youthCount > 0 ? `청소년 ${selection.youthCount}명` : "",
  ].filter(Boolean);
  return parts.join(", ");
}

export function savePendingPayment(selection: BookingSelection) {
  const records = readRecords();
  const now = Date.now();
  const date = selection.scheduleStart.replace(/-/g, "").slice(2);
  const payment: PendingPayment = {
    id: Math.max(now, records.reduce((latest, record) => Math.max(latest, record.id + 1), 0)),
    programId: selection.programId,
    scheduleId: selection.scheduleId,
    scheduleStart: selection.scheduleStart,
    reservationNo: `NV-${date}-001`,
    programName: selection.programName,
    templeName: selection.templeName,
    image: selection.image,
    scheduleLabel: selection.scheduleLabel,
    peopleLabel: peopleLabel(selection),
    adultCount: selection.adultCount,
    youthCount: selection.youthCount,
    totalPrice: selection.totalPrice,
    expiresAt: now + HOLD_MS,
    status: "결제대기",
    method: "",
    paidAt: "",
    history: [{ at: nowText(), status: "결제대기", by: "회원", reason: "예약 신청" }],
    refund: null,
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  writeRecords([payment, ...records]);
}

export function readPendingPayment(): PendingPayment | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed as PendingPayment;
  } catch {
    return null;
  }
}

export function writePendingPayment(payment: PendingPayment) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  const records = readRecords();
  const index = records.findIndex((item) => item.id === payment.id);
  if (index >= 0) {
    records[index] = payment;
  } else {
    records.unshift(payment);
  }
  writeRecords(records);
}

export function subscribePendingPayment(onChange: () => void) {
  window.addEventListener(PAYMENT_EVENT, onChange);
  return () => window.removeEventListener(PAYMENT_EVENT, onChange);
}

export function pendingPaymentSnapshot() {
  return window.sessionStorage.getItem(STORAGE_KEY) ?? "";
}

export function pendingPaymentServerSnapshot() {
  return "";
}

export function parsePendingPayment(raw: string, programId: number): PendingPayment | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as PendingPayment;
    return parsed.programId === programId ? parsed : null;
  } catch {
    return null;
  }
}
