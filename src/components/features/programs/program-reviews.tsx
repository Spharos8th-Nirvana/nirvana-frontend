"use client";

import { useState } from "react";
import { programReviews } from "@/data/program-reviews";

type ProgramReviewsProps = {
  programId: number;
};

export default function ProgramReviews({ programId }: ProgramReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = programReviews.filter(
    (review) => review.programId === programId,
  );

  const visibleCount = 2;
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const visibleReviews = reviews.slice(
    currentIndex,
    currentIndex + visibleCount,
  );

  const previousReviews = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const nextReviews = () => {
    setCurrentIndex((index) => Math.min(maxIndex, index + 1));
  };

  return (
    <section className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-12 md:grid-cols-[0.8fr_1.2fr]">
      {/* 왼쪽: 후기 제목과 설명 */}
      <div>
        <span className="text-xs tracking-wider text-[#999999]">
          USER REVIEWS
        </span>

        <h2 className="mt-3 text-2xl font-bold text-primary">참여자 후기</h2>

        <p className="mt-5 text-sm leading-7 text-muted">
          프로그램에 참여한 이용자들의
          <br className="hidden md:block" />
          솔직한 이야기를 확인해 보세요.
        </p>

        <p className="mt-6 text-sm text-[#999999]">
          총 {reviews.length}개의 후기
        </p>
      </div>

      {/* 오른쪽: 후기 목록 */}
      <div>
        {reviews.length === 0 ? (
          <div className="flex min-h-36 items-center justify-center border-y border-border px-6 py-8 text-sm text-muted">
            아직 작성된 후기가 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {visibleReviews.map((review) => (
                <article
                  key={review.id}
                  className="flex h-[280px] flex-col justify-between border-y border-border py-6"
                >
                  <div>
                    <h3 className="line-clamp-2 min-h-[3rem] font-semibold leading-6 text-ink">
                      {review.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-muted">
                      {review.content}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-[#999999]">작성자</span>
                    <span className="text-sm font-medium text-primary">
                      {review.nickname}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* 하단 버튼과 페이지 표시 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousReviews}
                  disabled={currentIndex === 0}
                  aria-label="이전 후기"
                  className="flex h-9 w-9 items-center justify-center border border-border text-primary transition hover:bg-[#F5F5F3] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={nextReviews}
                  disabled={currentIndex >= maxIndex}
                  aria-label="다음 후기"
                  className="flex h-9 w-9 items-center justify-center border border-border text-primary transition hover:bg-[#F5F5F3] disabled:cursor-not-allowed disabled:opacity-30"
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
                    className={`h-1.5 w-1.5 transition-colors ${
                      currentIndex === index ? "bg-primary" : "bg-[#D5D5D0]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
