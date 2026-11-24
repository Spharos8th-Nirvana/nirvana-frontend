"use client";

import { useState } from "react";
import { programReviews } from "@/features/program/data/program-reviews";

type ProgramReviewsProps = {
  programId: number;
};

const visibleCount = 2;

export default function ProgramReviews({ programId }: ProgramReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = programReviews.filter((review) => review.programId === programId);
  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const visibleReviews = reviews.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section id="reviews" className="mt-20 scroll-mt-24">
      {/* 다른 섹션과 같은 제목 형식: 왼쪽 제목, 오른쪽 영문 소제목 */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">참여자 후기</h2>
          <p className="mt-4 text-sm text-muted">
            프로그램에 참여한 이용자들의 솔직한 이야기를 확인해 보세요.
            <span className="ml-2 text-muted/70">총 {reviews.length}개</span>
          </p>
        </div>
        <span className="hidden text-xs tracking-wider text-muted/70 sm:block">
          USER REVIEWS
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 flex min-h-36 items-center justify-center rounded-lg border border-dashed border-border px-6 py-8 text-sm text-muted">
          아직 작성된 후기가 없습니다.
        </div>
      ) : (
        <>
          {/* 후기마다 독립된 카드로 구분 */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="flex min-h-[260px] flex-col rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-sm"
              >
                <span aria-hidden="true" className="font-display text-4xl leading-none text-sage-03">
                  &ldquo;
                </span>

                <h3 className="mt-2 line-clamp-2 font-bold leading-6 text-ink">{review.title}</h3>

                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-7 text-muted">
                  {review.content}
                </p>

                <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-subtle text-xs font-bold text-primary"
                  >
                    {review.nickname.slice(0, 1)}
                  </span>
                  <span className="text-sm font-medium text-ink">{review.nickname}</span>
                </footer>
              </article>
            ))}
          </div>

          {/* 이전·다음 버튼과 페이지 표시 */}
          {maxIndex > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                  disabled={currentIndex === 0}
                  aria-label="이전 후기"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.min(maxIndex, index + 1))}
                  disabled={currentIndex >= maxIndex}
                  aria-label="다음 후기"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`${index + 1}번째 후기 페이지`}
                    aria-current={currentIndex === index ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === index ? "w-5 bg-primary" : "w-1.5 bg-sage-04"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
