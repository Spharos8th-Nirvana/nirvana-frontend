"use client";

import { useRef, useState, type FormEvent } from "react";
import { createReview } from "@/features/review/api/review-api";
import type {
  ReviewEditorHandle,
  ReviewFormErrors,
  ReviewFormValues,
} from "@/features/review/types/review";
import { validateReview } from "@/features/review/utils/validate-review";

type SubmitStatus = "idle" | "submitting" | "done";

const NOT_ELIGIBLE_MESSAGE = "이 예약은 후기를 쓸 수 없어요. 이미 후기를 썼는지 확인해 주세요.";
const ERROR_MESSAGE = "후기를 등록하지 못했어요. 잠시 후 다시 시도해 주세요.";

/** 후기 작성 입력 상태, 화면 검사, 등록 요청을 관리합니다. */
export function useReviewForm(bookingUuid: string) {
  const [values, setValues] = useState<ReviewFormValues>({ title: "", content: "" });
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string>();

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<ReviewEditorHandle>(null);

  const setTitle = (title: string) => {
    setValues((prev) => ({ ...prev, title }));
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const setContent = (content: string) => {
    setValues((prev) => ({ ...prev, content }));
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const nextErrors = validateReview(values);
    setErrors(nextErrors);
    setSubmitError(undefined);

    // 첫 번째 오류 칸으로 포커스를 옮깁니다.
    if (nextErrors.title) {
      titleRef.current?.focus();
      return;
    }
    if (nextErrors.content) {
      editorRef.current?.focus();
      return;
    }

    setStatus("submitting");
    const result = await createReview({
      bookingUuid,
      title: values.title.trim(),
      content: values.content,
    });

    if (result.ok) {
      setStatus("done");
      return;
    }

    setStatus("idle");
    setSubmitError(result.reason === "not-eligible" ? NOT_ELIGIBLE_MESSAGE : ERROR_MESSAGE);
  };

  return {
    values,
    errors,
    status,
    submitError,
    titleRef,
    editorRef,
    setTitle,
    setContent,
    handleSubmit,
  };
}
