import type { ReviewEligibility } from "@/features/review/types/review";

/**
 * 후기 작성 자격 임시 데이터.
 * 예약 내역 임시 데이터(features/booking/data/my-bookings.ts)의 예약 번호와 맞췄습니다. 후기 API 연결 후 삭제합니다.
 */
export const reviewEligibilities: ReviewEligibility[] = [
  {
    // 체험 완료, 아직 후기를 쓰지 않음 → 쓸 수 있음
    bookingUuid: "b-0003",
    templeName: "화엄사",
    programTitle: "몸과 마음을 잇는 선무도",
    consumedAt: null,
  },
  {
    // 이미 후기를 씀 → 쓸 수 없음 (화면 확인용)
    bookingUuid: "b-0099",
    templeName: "해인사",
    programTitle: "새벽 숲, 나를 깨우는 시간",
    consumedAt: "2026-11-16T10:20:00",
  },

  {
    // 이미 후기를 씀 → 쓸 수 없음 (내가 쓴 후기 임시 데이터와 같은 예약)
    bookingUuid: "b-0098",
    templeName: "불국사",
    programTitle: "스님과 함께 빚는 사찰의 맛",
    consumedAt: "2026-09-21T15:40:00",
  },
];
