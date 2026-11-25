import {
  bookingRecordsSnapshot,
  findBooking,
  parseBookingRecords,
} from "@/features/booking/utils/pending-payment";
import type { reviews } from "@/features/guide/data/mock-screens";

const STORAGE_KEY = "nirvana.extra-reviews";
const CHANGE_EVENT = "nirvana-reviews";

export type SampleReview = (typeof reviews)[number];
type ReviewDraft = { reservationId: number; rating: number; title: string; body: string };
type StoredReview = ReviewDraft & { programName: string; date: string };

export function reviewPath(reservationId: number) {
  return `/community/reviews/local-${reservationId}`;
}

export function reviewsSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function reviewsServerSnapshot() {
  return "";
}

export function subscribeReviews(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onChange();
    }
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function isRating(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function parseReviews(raw: string): StoredReview[] {
  try {
    const items: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(items)) {
      return [];
    }
    return items.filter((item): item is StoredReview =>
      item !== null && typeof item === "object" &&
      Number.isSafeInteger(item.reservationId) && item.reservationId > 0 &&
      isRating(item.rating) && typeof item.title === "string" &&
      typeof item.body === "string" && typeof item.programName === "string" &&
      typeof item.date === "string"
    );
  } catch {
    return [];
  }
}

export async function saveReview(draft: ReviewDraft) {
  const title = draft.title.trim();
  const body = draft.body.trim();
  if (!isRating(draft.rating) || title.length < 2 || title.length > 50 || body.length < 10) {
    return "invalid" as const;
  }

  const store = () => {
    const booking = findBooking(parseBookingRecords(bookingRecordsSnapshot()), draft.reservationId);
    if (booking?.status !== "이용 완료" || typeof booking.programName !== "string") {
      return "ineligible" as const;
    }
    const stored = parseReviews(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (stored.some((review) => review.reservationId === booking.id)) {
      return "duplicate" as const;
    }
    const review: StoredReview = {
      ...draft,
      title,
      body,
      programName: booking.programName,
      date: new Date().toLocaleDateString("ko-KR"),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([review, ...stored]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return "saved" as const;
  };

  try {
    return navigator.locks ? await navigator.locks.request(STORAGE_KEY, store) : store();
  } catch {
    return "unavailable" as const;
  }
}
