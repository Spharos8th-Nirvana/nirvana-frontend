"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import {
  parseReviews,
  reviewsServerSnapshot,
  reviewsSnapshot,
  subscribeReviews,
  type SampleReview,
} from "@/features/community/data/review-posts";

type ReviewDetailProps = {
  example?: SampleReview;
  reservationId?: number;
  children: ReactNode;
};

export default function ReviewDetail({ example, reservationId, children }: ReviewDetailProps) {
  const raw = useSyncExternalStore(subscribeReviews, reviewsSnapshot, reviewsServerSnapshot);
  const stored = parseReviews(raw).find((item) => item.reservationId === reservationId);
  const title = example?.title ?? stored?.title;

  return (
    <PreviewPage
      title={title ?? "체험 후기"}
      description={example?.prog ?? stored?.programName ?? "체험 후기 상세"}
      image={example?.img}
    >
      {children}
      {title ? (
        <>
          <p className="text-sm text-muted">{example?.author ?? "나"} · {example?.date ?? stored?.date}</p>
          {stored && <p className="mt-3 text-sm font-bold text-primary">별점 {stored.rating} / 5</p>}
          <p className="mt-4 whitespace-pre-wrap break-words leading-8">{example?.body ?? stored?.body}</p>
        </>
      ) : (
        <p role="status" className="text-sm text-muted">
          {raw ? "이 브라우저에서 후기를 찾을 수 없어요." : "후기를 불러오고 있습니다."}
        </p>
      )}
      <Link href="/community/reviews" className="mt-6 inline-block text-sm font-bold">체험 후기 목록</Link>
    </PreviewPage>
  );
}
