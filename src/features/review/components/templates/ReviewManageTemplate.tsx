import MyReviewList from "@/features/review/components/organisms/MyReviewList";
import WritableReviewList from "@/features/review/components/organisms/WritableReviewList";
import type { MyReview, ReviewEligibility } from "@/features/review/types/review";

type ReviewManageTemplateProps = {
  eligibilities: ReviewEligibility[];
  reviews: MyReview[];
};

/** 후기 관리: 작성할 수 있는 후기 + 내가 쓴 후기 */
export default function ReviewManageTemplate({
  eligibilities,
  reviews,
}: ReviewManageTemplateProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-ink">후기 관리</h2>
      <div className="mt-6 space-y-10">
        <WritableReviewList eligibilities={eligibilities} />
        <MyReviewList reviews={reviews} />
      </div>
      <p className="mt-6 text-xs text-muted/70">
        수정·삭제는 준비 중이에요. 후기는 예약 한 건에 하나만 쓸 수 있고, 삭제하면 다시 쓸 수
        없어요.
      </p>
    </section>
  );
}
