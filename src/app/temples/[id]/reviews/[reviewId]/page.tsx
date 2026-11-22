import { notFound } from "next/navigation";
import Link from "next/link";
import { temples } from "@/data/temples";
import { templeReviews } from "@/data/temple-reviews";

type ReviewDetailPageProps = {
  params: Promise<{
    id: string;
    reviewId: string;
  }>;
};

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id, reviewId } = await params;

  const temple = temples.find((item) => item.id === Number(id));

  const review = templeReviews.find(
    (item) => item.id === Number(reviewId) && item.templeId === Number(id),
  );

  if (!temple || !review) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] px-4 py-12">
      <article className="mx-auto max-w-[900px] rounded-lg bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#173F35]">{review.title}</h1>

          <Link
            href={`/temples/${temple.id}?tab=reviews#reviews-section`}
            className="shrink-0 rounded-md border border-[#D8D1C5] px-5 py-2 text-sm text-[#173F35] hover:font-bold"
          >
            목록으로
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 text-sm text-[#756F62]">
          <span>{review.nickname}</span>
          <span>·</span>
          <span>{review.createdAt}</span>
        </div>

        <div
          className="review-content text-[#173F35] leading-8"
          dangerouslySetInnerHTML={{
            __html: review.content,
          }}
        />
      </article>
    </main>
  );
}
