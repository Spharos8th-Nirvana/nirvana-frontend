import Link from "next/link";
import type { ReviewEligibility } from "@/features/review/types/review";
import { primaryButtonClassName } from "@/shared/components/ui/Button";

type WritableReviewListProps = {
  eligibilities: ReviewEligibility[];
};

/** 작성할 수 있는 후기: 체험을 마쳤고 아직 후기를 쓰지 않은 예약 */
export default function WritableReviewList({ eligibilities }: WritableReviewListProps) {
  return (
    <section aria-labelledby="writable-reviews-title">
      <h3 id="writable-reviews-title" className="text-base font-bold text-ink">
        작성할 수 있는 후기 <span className="font-medium text-muted">{eligibilities.length}</span>
      </h3>

      {eligibilities.length === 0 ? (
        <p className="mt-3 rounded-default border border-border bg-surface py-10 text-center text-sm text-muted">
          지금 작성할 수 있는 후기가 없어요.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {eligibilities.map((item) => (
            <li
              key={item.bookingUuid}
              className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-label-13 text-muted">{item.templeName}</p>
                <p className="mt-1 font-bold text-ink">{item.programTitle}</p>
              </div>
              <Link
                href={`/mypage/reviews/new?booking=${encodeURIComponent(item.bookingUuid)}&from=reviews`}
                className={`${primaryButtonClassName} shrink-0 px-5 py-3 text-sm`}
              >
                후기 작성
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
