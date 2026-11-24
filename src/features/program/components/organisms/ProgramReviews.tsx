"use client";

import { useState } from "react";
import DetailSection from "@/features/program/components/molecules/DetailSection";
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
    <DetailSection
      id="reviews"
      eyebrow="후기"
      title="참여자 후기"
      titleAddon={
        // 후기 개수 말풍선: 제목 글자 높이(28px)에 맞추고, 꼬리는 제목 쪽(왼쪽 가운데)을 가리킵니다.
        <span className="relative ml-1 inline-flex h-7 min-w-8 items-center justify-center rounded-lg bg-primary px-2 text-sm font-bold leading-none text-white before:absolute before:-left-1 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-y-1/2 before:rotate-45 before:rounded-[2px] before:bg-primary">
          <span className="relative z-10">{reviews.length}</span>
          <span className="sr-only">개의 후기</span>
        </span>
      }
      description="프로그램에 참여한 이용자들의 솔직한 이야기를 확인해 보세요."
    >
      {reviews.length === 0 ? (
        <div className="flex min-h-36 items-center justify-center border border-ink/40 bg-white px-6 py-8 text-sm text-muted">
          아직 작성된 후기가 없습니다.
        </div>
      ) : (
        <>
          {/* 후기마다 테두리 상자로 구분 (와이어프레임 상자 모양) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="flex min-h-[220px] flex-col border border-ink/40 bg-white px-5 py-5"
              >
                <h3 className="line-clamp-2 font-bold leading-6 text-ink">{review.title}</h3>
                <hr className="my-4 border-ink/30" />
                <p className="line-clamp-4 flex-1 text-sm leading-7 text-ink/80">{review.content}</p>
                <p className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-ink">{review.nickname}</span>
                  {/* 작성연월 (YYYY.MM), 오른쪽 정렬 */}
                  <time dateTime={review.createdAt.slice(0, 7)} className="text-muted">
                    {review.createdAt.slice(0, 7).replace("-", ".")}
                  </time>
                </p>
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
    </DetailSection>
  );
}
