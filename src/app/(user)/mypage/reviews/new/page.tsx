import type { Metadata } from "next";
import Link from "next/link";
import ReviewWriteTemplate from "@/features/review/components/templates/ReviewWriteTemplate";
import { getReviewEligibility } from "@/features/review/api/review-api";

export const metadata: Metadata = {
  title: "후기 작성",
};

type ReviewWritePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** 후기 작성 화면. 주소의 booking(예약 번호)으로 작성 자격을 확인합니다. (임시 데이터) */
export default async function ReviewWritePage({ searchParams }: ReviewWritePageProps) {
  const { booking } = await searchParams;
  const bookingUuid = typeof booking === "string" ? booking : "";
  const eligibility = bookingUuid ? await getReviewEligibility(bookingUuid) : null;

  // 없는 예약, 체험 완료가 아닌 예약, 이미 후기를 쓴 예약
  if (!eligibility || eligibility.consumedAt !== null) {
    return (
      <section className="rounded-default border border-border bg-surface px-6 py-16 text-center">
        <h2 className="text-lg font-bold text-ink">후기를 쓸 수 없는 예약이에요</h2>
        <p className="mt-2 text-sm text-muted">
          체험을 마친 예약에 한 번만 쓸 수 있어요. 이미 후기를 썼는지 확인해 주세요.
        </p>
        <Link
          href="/mypage"
          className="mt-6 inline-block text-sm font-semibold text-primary underline hover:opacity-70"
        >
          예약 내역으로
        </Link>
      </section>
    );
  }

  return <ReviewWriteTemplate eligibility={eligibility} />;
}
