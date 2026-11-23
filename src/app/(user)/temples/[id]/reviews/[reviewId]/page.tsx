import { notFound } from "next/navigation";
import Link from "next/link";
import { temples } from "@/features/temple/data/temples";
import { templeReviews } from "@/features/temple/data/temple-reviews";
import { sanitizeContentHtml } from "@/lib/sanitize-html";

type ReviewDetailPageProps = {
  params: Promise<{
    id: string;
    reviewId: string;
  }>;
};

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { id, reviewId } = await params;

  const temple = temples.find((item) => item.id === Number(id));

  const review = templeReviews.find(
    (item) => item.id === Number(reviewId) && item.templeId === Number(id),
  );

  if (!temple || !review) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <article className="mx-auto max-w-[900px] rounded-lg bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-primary">{review.title}</h1>

          <Link
            href={`/temples/${temple.id}?tab=reviews#reviews-section`}
            className="shrink-0 rounded-md border border-border px-5 py-2 text-sm text-primary hover:font-bold"
          >
            목록으로
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 text-sm text-muted">
          <span>{review.nickname}</span>
          <span>·</span>
          <span>{review.createdAt}</span>
        </div>

        <div
          className="review-content text-primary leading-8"
          dangerouslySetInnerHTML={{
            __html: sanitizeContentHtml(review.content),
          }}
        />
      </article>
    </main>
  );
}
