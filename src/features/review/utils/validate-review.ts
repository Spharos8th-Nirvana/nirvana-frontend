import type { ReviewFormErrors, ReviewFormValues } from "@/features/review/types/review";

/** DB posts.title VARCHAR(200) */
export const REVIEW_TITLE_MAX_LENGTH = 200;

/** 글자 수 (한글·이모지도 한 글자로 셉니다) */
export function countCharacters(value: string): number {
  return Array.from(value).length;
}

/**
 * 에디터 HTML에서 태그를 걷어 낸 글자만 남깁니다. 빈 에디터("<p></p>")는 빈 문자열이 됩니다.
 * 문단·목록이 끝나는 곳은 띄어 써서 미리보기에서 글자가 붙지 않게 합니다.
 */
export function getPlainText(html: string): string {
  return html
    .replace(/<\/(p|li|h3|blockquote)>|<br\s*\/?>/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 화면 검사 (사용자를 돕기 위한 것이고 최종 검증은 Backend가 합니다) */
export function validateReview(values: ReviewFormValues): ReviewFormErrors {
  const errors: ReviewFormErrors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = "제목을 입력해 주세요.";
  } else if (countCharacters(title) > REVIEW_TITLE_MAX_LENGTH) {
    errors.title = `제목은 ${REVIEW_TITLE_MAX_LENGTH}자까지 입력할 수 있어요.`;
  }

  if (!getPlainText(values.content)) {
    errors.content = "내용을 입력해 주세요.";
  }

  return errors;
}
