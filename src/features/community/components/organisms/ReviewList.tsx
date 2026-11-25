"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  parseReviews,
  reviewPath,
  reviewsServerSnapshot,
  reviewsSnapshot,
  subscribeReviews,
  type SampleReview,
} from "@/features/community/data/review-posts";

export default function ReviewList({ examples }: { examples: SampleReview[] }) {
  const stored = parseReviews(useSyncExternalStore(subscribeReviews, reviewsSnapshot, reviewsServerSnapshot));
  const rows = [
    ...stored.map((item) => ({
      href: reviewPath(item.reservationId), prog: item.programName, title: item.title, author: "나", date: item.date,
    })),
    ...examples.map((item) => ({ ...item, href: `/community/reviews/${item.id}` })),
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <p>총 <b>{rows.length}</b>개의 글</p>
        <Link href="/community/write" className="rounded-full bg-primary px-4 py-2 font-bold text-white">
          글쓰기
        </Link>
      </div>
      <ul className="divide-y border-y border-border">
        {rows.map((row) => (
          <li key={row.href}>
            <Link href={row.href} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 break-words font-medium text-primary">[{row.prog}] {row.title}</span>
              <span className="shrink-0 text-xs text-muted">{row.author} · {row.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
