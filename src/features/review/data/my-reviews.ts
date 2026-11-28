import type { MyReview } from "@/features/review/types/review";

/**
 * 내가 쓴 후기 임시 데이터. 후기 API 연결 후 삭제합니다.
 * 작성 자격 임시 데이터(review-eligibilities.ts)에서 이미 쓴 예약(consumedAt 있음)과 예약 번호를 맞췄습니다.
 */
export const myReviews: MyReview[] = [
  {
    postUuid: "p-0001",
    bookingUuid: "b-0099",
    templeName: "해인사",
    programTitle: "새벽 숲, 나를 깨우는 시간",
    title: "새벽 예불에서 찾은 고요",
    content:
      "<p>처음엔 새벽 네 시 기상이 걱정됐는데, 예불 소리를 듣고 있으니 오히려 머리가 맑아졌어요.</p><ul><li><p>공양이 정갈하고 맛있었어요</p></li><li><p>숲길 산책이 가장 좋았어요</p></li></ul>",
    createdAt: "2026-11-16T10:20:00",
  },
  {
    postUuid: "p-0002",
    bookingUuid: "b-0098",
    templeName: "불국사",
    programTitle: "스님과 함께 빚는 사찰의 맛",
    title: "손으로 빚는 시간이 이렇게 차분할 줄이야",
    content:
      "<p>사찰 음식을 직접 만들어 보면서 재료 하나하나의 맛을 다시 느꼈어요. <strong>다음에는 가족과 함께</strong> 오고 싶어요.</p>",
    createdAt: "2026-09-21T15:40:00",
  },
];
