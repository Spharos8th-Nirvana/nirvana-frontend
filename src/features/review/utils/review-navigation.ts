import type { ReviewWriteFrom } from "@/features/review/types/review";

/**
 * 주소의 from 값을 정해진 두 값으로만 읽습니다. 그 밖의 값(다른 사이트 주소 등)은 무시하고 후기 관리로 봅니다.
 * (주소를 조작해 엉뚱한 곳으로 보내는 것을 막기 위해 받은 값을 그대로 이동 주소로 쓰지 않습니다.)
 */
export function parseReviewWriteFrom(value: string | string[] | undefined): ReviewWriteFrom {
  return value === "bookings" ? "bookings" : "reviews";
}

/** 후기 작성 화면의 뒤로 가기·취소가 돌아갈 곳 */
export function getReviewBackLink(from: ReviewWriteFrom, bookingUuid: string) {
  if (from === "bookings") {
    // 예약 내역에서 그 예약의 상세 패널을 연 상태로 돌아갑니다.
    return {
      href: `/mypage?booking=${encodeURIComponent(bookingUuid)}`,
      label: "예약 내역으로",
    };
  }

  return { href: "/mypage/reviews", label: "후기 관리로" };
}

/** "2026-11-16T10:20:00" → "2026.11.16" */
export function formatReviewDate(dateTime: string): string {
  return dateTime.slice(0, 10).replaceAll("-", ".");
}
