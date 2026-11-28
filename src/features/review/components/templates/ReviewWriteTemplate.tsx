"use client";

import Link from "next/link";
import ReviewEditor from "@/features/review/components/organisms/ReviewEditor";
import { useReviewForm } from "@/features/review/hooks/useReviewForm";
import type { ReviewEligibility, ReviewWriteFrom } from "@/features/review/types/review";
import { getReviewBackLink } from "@/features/review/utils/review-navigation";
import { countCharacters, REVIEW_TITLE_MAX_LENGTH } from "@/features/review/utils/validate-review";
import { primaryButtonClassName } from "@/shared/components/ui/Button";
import { inputClassName } from "@/shared/components/ui/FormField";

type ReviewWriteTemplateProps = {
  eligibility: ReviewEligibility;
  /** 어디서 들어왔는지. 뒤로 가기·취소가 그곳으로 돌아갑니다. */
  from: ReviewWriteFrom;
};

/** 보조 버튼 (취소) */
const secondaryLinkClassName =
  "inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-4 font-bold text-ink-control transition-colors hover:border-primary hover:bg-subtle";

/** 후기 작성 화면: 체험 요약 + 제목 + HTML 에디터 + 등록 */
export default function ReviewWriteTemplate({ eligibility, from }: ReviewWriteTemplateProps) {
  const {
    values,
    errors,
    status,
    submitError,
    titleRef,
    editorRef,
    setTitle,
    setContent,
    handleSubmit,
  } = useReviewForm(eligibility.bookingUuid);
  const backLink = getReviewBackLink(from, eligibility.bookingUuid);

  if (status === "done") {
    return (
      <section aria-labelledby="review-done-title" className="py-12 text-center">
        <p
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-action text-2xl font-bold text-primary"
        >
          ✓
        </p>
        <h2 id="review-done-title" className="mt-6 text-xl font-bold text-ink">
          후기를 등록했어요
        </h2>
        <p className="mt-2 text-sm text-muted">
          {eligibility.templeName} · {eligibility.programTitle}
        </p>
        <p className="mt-4 text-xs text-muted/70">임시 화면이에요. 실제 등록은 아직 되지 않아요.</p>
        <Link href="/mypage/reviews" className={`${primaryButtonClassName} mt-8`}>
          후기 관리로
        </Link>
      </section>
    );
  }

  return (
    <section>
      <Link href={backLink.href} className="text-label-13 text-muted hover:text-primary">
        ← {backLink.label}
      </Link>
      <h2 className="mt-2 text-xl font-bold text-ink">후기 작성</h2>

      {/* 후기를 쓸 체험 */}
      <div className="mt-6 flex items-center justify-between gap-4 rounded-default border border-border bg-surface p-5">
        <div>
          <p className="text-label-13 text-muted">{eligibility.templeName}</p>
          <p className="mt-1 font-bold text-ink">{eligibility.programTitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-sage-05 px-3 py-1 text-xs font-semibold text-sage-07">
          체험 완료
        </span>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-default border border-border bg-surface p-5 md:p-7"
      >
        <div>
          <label htmlFor="review-title" className="mb-2 block text-label-14 font-bold text-ink">
            제목
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          </label>
          <input
            ref={titleRef}
            id="review-title"
            type="text"
            value={values.title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={REVIEW_TITLE_MAX_LENGTH}
            placeholder="체험을 한 줄로 남겨 주세요"
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "review-title-error" : "review-title-count"}
            className={inputClassName}
          />
          <div className="mt-2 flex justify-between gap-4 text-xs">
            {errors.title ? (
              <p id="review-title-error" role="alert" className="text-error">
                {errors.title}
              </p>
            ) : (
              <span />
            )}
            <span id="review-title-count" className="shrink-0 text-muted">
              {countCharacters(values.title)} / {REVIEW_TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div>
          <p id="review-content-label" className="mb-2 text-label-14 font-bold text-ink">
            내용
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          </p>
          <ReviewEditor
            ref={editorRef}
            id="review-content"
            labelId="review-content-label"
            invalid={Boolean(errors.content)}
            describedBy={errors.content ? "review-content-error" : "review-content-hint"}
            onChange={setContent}
          />
          {errors.content ? (
            <p id="review-content-error" role="alert" className="mt-2 text-xs text-error">
              {errors.content}
            </p>
          ) : (
            <p id="review-content-hint" className="mt-2 text-xs text-muted">
              사진 넣기는 준비 중이에요.
            </p>
          )}
        </div>

        <p className="rounded-default bg-subtle px-4 py-3 text-label-13 text-sage-07">
          후기는 예약 한 건에 하나만 쓸 수 있어요. 삭제하면 다시 쓸 수 없어요.
        </p>

        {submitError && (
          <p role="alert" className="text-sm text-error">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href={backLink.href} className={secondaryLinkClassName}>
            취소
          </Link>
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`${primaryButtonClassName} sm:px-9`}
          >
            {status === "submitting" ? "등록 중…" : "후기 등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
