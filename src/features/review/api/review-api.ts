import { myReviews } from "@/features/review/data/my-reviews";
import { reviewEligibilities } from "@/features/review/data/review-eligibilities";
import type {
  CreateReviewRequest,
  CreateReviewResult,
  MyReview,
  ReviewEligibility,
} from "@/features/review/types/review";

/**
 * 후기 임시 API.
 * 함수 이름과 입력·결과 모양만 정해 두고, 주소와 응답은 후기 API가 확정되면 실제 요청으로 바꿉니다.
 */

const MOCK_DELAY_MS = 600;

/** 이 화면을 연 동안 등록한 예약 (임시 동작용) */
const writtenBookingUuids = new Set<string>();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 예약 번호로 후기 작성 자격을 찾습니다. 없으면 null */
export async function getReviewEligibility(bookingUuid: string): Promise<ReviewEligibility | null> {
  return reviewEligibilities.find((item) => item.bookingUuid === bookingUuid) ?? null;
}

/** 아직 후기를 쓰지 않은(작성할 수 있는) 예약 목록 */
export async function getWritableEligibilities(): Promise<ReviewEligibility[]> {
  return reviewEligibilities.filter((item) => item.consumedAt === null);
}

/** 내가 쓴 후기 목록 (최근에 쓴 순서) */
export async function getMyReviews(): Promise<MyReview[]> {
  return [...myReviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 후기를 등록합니다. 예약 한 건에 후기 하나만 쓸 수 있습니다. */
export async function createReview(request: CreateReviewRequest): Promise<CreateReviewResult> {
  await wait(MOCK_DELAY_MS);

  const eligibility = await getReviewEligibility(request.bookingUuid);
  if (
    !eligibility ||
    eligibility.consumedAt !== null ||
    writtenBookingUuids.has(request.bookingUuid)
  ) {
    return { ok: false, reason: "not-eligible" };
  }

  writtenBookingUuids.add(request.bookingUuid);
  return { ok: true };
}
