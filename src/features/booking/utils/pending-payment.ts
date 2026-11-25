import type { BookingSelection } from "@/features/booking/types/booking";

/** 시안과 같이 결제 대기 10분. 이 브라우저 안에서만 유지됩니다. */
const HOLD_MS = 10 * 60 * 1000;
const STORAGE_KEY = "nirvana.pending-payment";

export type PendingPayment = {
  programId: number;
  scheduleId: string;
  reservationNo: string;
  programName: string;
  templeName: string;
  image: string;
  scheduleLabel: string;
  peopleLabel: string;
  totalPrice: number;
  expiresAt: number;
  status: "결제대기" | "예약 확정" | "만료";
  method: string;
};

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
    programId: selection.programId,
    scheduleId: selection.scheduleId,
    reservationNo: `NV-${date}-001`,
    programName: selection.programName,
    templeName: selection.templeName,
    image: selection.image,
    scheduleLabel: selection.scheduleLabel,
    peopleLabel: peopleLabel(selection),
    totalPrice: selection.totalPrice,
    expiresAt: Date.now() + HOLD_MS,
    status: "결제대기",
    method: "",
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  window.dispatchEvent(new Event("nirvana-payment"));
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
  window.dispatchEvent(new Event("nirvana-payment"));
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
