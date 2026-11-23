"use client";

import { useMemo, useState } from "react";
import type { TempleReview } from "@/features/temple/data/temple-reviews";

type TempleReviewsProps = {
  reviews: TempleReview[];
};

export default function TempleReviews({ reviews }: TempleReviewsProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDate, setSelectedDate] = useState("");

  const categories = ["전체", ...new Set(reviews.map((review) => review.category))];

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const categoryMatches = selectedCategory === "전체" || review.category === selectedCategory;

      const dateMatches = !selectedDate || review.createdAt === selectedDate;

      return categoryMatches && dateMatches;
    });
  }, [reviews, selectedCategory, selectedDate]);

  return (
    <section>
      <h2 className="mb-8 text-2xl font-bold text-primary">체험 리뷰</h2>

      {/* 리뷰 필터 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="review-category"
            className="mb-2 block text-sm font-semibold text-primary"
          >
            체험 종류
          </label>
          <select
            id="review-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="review-date" className="mb-2 block text-sm font-semibold text-primary">
            작성 날짜
          </label>
          <input
            id="review-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col-reverse overflow-hidden border border-border bg-white sm:flex-row"
            >
              <div className="flex-1 p-5 md:p-7">
                <span className="text-xs font-semibold text-primary">{review.category}</span>

                <h3 className="mt-2 text-lg font-bold text-primary">{review.title}</h3>

                <p className="mt-2 text-xs 	text-muted">
                  {review.nickname} · {review.createdAt}
                </p>

                <div className="mt-5 rounded-lg bg-white p-4">
                  <p className="text-sm leading-7 text-muted">
                    {review.content
                      .replace(/<[^>]*>/g, " ")
                      .replace(/\s+/g, " ")
                      .trim()
                      .slice(0, 120)}
                    ...
                  </p>
                </div>
              </div>

              <div className="h-48 w-full shrink-0 bg-white sm:h-auto sm:w-48 md:w-64">
                <ReviewThumbnail content={review.content} />
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-sm border border-dashed border-border px-5 py-16 text-center">
            <p className="text-primary">해당 조건의 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewThumbnail({ content }: { content: string }) {
  const imageUrl = content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];

  if (!imageUrl) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center text-sm 	text-muted">
        이미지 없음
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="리뷰 대표 이미지"
      className="h-full min-h-48 w-full bg-cover bg-center"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    />
  );
}
