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

function nowText() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readRecords(): PendingPayment[] {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(LIST_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as PendingPayment[]) : [];
  } catch {
    return [];
  }
}

function writeRecords(records: PendingPayment[]) {
  window.sessionStorage.setItem(LIST_KEY, JSON.stringify(records));
  const held = new Map<string, number>();
  records.forEach((item) => {
    if (item.status !== "결제대기" && item.status !== "예약 확정") {
      return;
    }
    held.set(item.scheduleId, (held.get(item.scheduleId) ?? 0) + (item.adultCount || 0) + (item.youthCount || 0));
  });
  const value = [...held.entries()].map(([id, count]) => `${id}=${count}`).join(",");
  document.cookie = `nirvana-holds=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event("nirvana-payment"));
}

/** 결제대기·예약 확정이 잡아 둔 인원. 취소·만료·노쇼·이용 완료는 빼지 않습니다. */
export function heldHeadcount(records: PendingPayment[], scheduleId: string) {
  return records
    .filter((item) => item.scheduleId === scheduleId && (item.status === "결제대기" || item.status === "예약 확정"))
    .reduce((sum, item) => sum + (item.adultCount || 0) + (item.youthCount || 0), 0);
}

export function heldFromCookie(raw: string | undefined, scheduleId: string) {
  if (!raw) {
    return 0;
  }
  const text = decodeURIComponent(raw);
  const found = text.split(",").find((part) => part.startsWith(`${scheduleId}=`));
  return found ? Number(found.split("=")[1]) || 0 : 0;
}

export function bookingRecordsSnapshot() {
  return window.sessionStorage.getItem(LIST_KEY) ?? "[]";
}

export function parseBookingRecords(raw: string): PendingPayment[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? (parsed as PendingPayment[]) : [];
  } catch {
    return [];
  }
}

export function findBooking(records: PendingPayment[], id: number) {
  return records.find((item) => item.id === id) ?? null;
}

function peopleLabel(selection: BookingSelection) {
  const parts = [
    selection.adultCount > 0 ? `성인 ${selection.adultCount}명` : "",
    selection.youthCount > 0 ? `청소년 ${selection.youthCount}명` : "",
  ].filter(Boolean);
  return parts.join(", ");
}

export function savePendingPayment(selection: BookingSelection) {
  const date = selection.scheduleStart.replace(/-/g, "").slice(2);
  const payment: PendingPayment = {
    id: Date.now(),
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
    expiresAt: Date.now() + HOLD_MS,
    status: "결제대기",
    method: "",
    paidAt: "",
    history: [{ at: nowText(), status: "결제대기", by: "회원", reason: "예약 신청" }],
    refund: null,
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  writeRecords([payment, ...readRecords().filter((item) => item.id !== payment.id)]);
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
  window.addEventListener("nirvana-payment", onChange);
  return () => window.removeEventListener("nirvana-payment", onChange);
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
