import type { MyReview } from "@/features/review/types/review";
import { formatReviewDate } from "@/features/review/utils/review-navigation";
import { getPlainText } from "@/features/review/utils/validate-review";

type MyReviewListProps = {
  reviews: MyReview[];
};

/** 수정·삭제 버튼 자리 (다음 Issue에서 연결) */
const actionButtonClassName =
  "rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50";

/** 내가 쓴 후기 목록. 내용은 태그를 뺀 글자로 두 줄까지 미리 보여 줍니다. */
export default function MyReviewList({ reviews }: MyReviewListProps) {
  return (
    <section aria-labelledby="my-reviews-title">
      <h3 id="my-reviews-title" className="text-base font-bold text-ink">
        내가 쓴 후기 <span className="font-medium text-muted">{reviews.length}</span>
      </h3>

      {reviews.length === 0 ? (
        <p className="mt-3 rounded-default border border-border bg-surface py-10 text-center text-sm text-muted">
          아직 쓴 후기가 없어요.
        </p>
      ) : (
        <ul className="mt-3 overflow-hidden rounded-default border border-border bg-surface">
          {reviews.map((review) => (
            <li
              key={review.postUuid}
              className="flex flex-col gap-4 border-b border-border p-5 last:border-b-0 sm:flex-row sm:gap-6"
            >
              {/* 왼쪽: 글. 넓은 화면에서는 오른쪽 칸(날짜·버튼) 앞에서 멈춰 버튼 쪽으로 넘어가지 않습니다. */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="min-w-0 text-label-13 text-muted">
                    {review.templeName} · {review.programTitle}
                  </p>
                  {/* 휴대폰: 작성일을 사찰·체험 줄 오른쪽에 */}
                  <p className="shrink-0 text-xs text-muted sm:hidden">
                    {formatReviewDate(review.createdAt)}
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 font-bold break-keep text-ink">{review.title}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-control">
                  {getPlainText(review.content)}
                </p>
              </div>

              {/* 오른쪽 칸: 위에 작성일(넓은 화면), 아래에 수정·삭제 */}
              <div className="flex shrink-0 justify-end sm:flex-col sm:items-end sm:justify-between">
                <p className="hidden text-xs text-muted sm:block">
                  {formatReviewDate(review.createdAt)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    title="준비 중"
                    className={`${actionButtonClassName} text-ink-control`}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    disabled
                    title="준비 중"
                    className={`${actionButtonClassName} text-error`}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
