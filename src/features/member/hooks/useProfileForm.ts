"use client";

import { useState, type FormEvent } from "react";
import { updateMyProfile } from "@/features/member/api/profile-api";
import type {
  MyProfile,
  ProfileFormErrors,
  ProfileFormField,
  ProfileFormValues,
} from "@/features/member/types/profile";
import {
  isSameProfile,
  toProfileFormValues,
  validateProfile,
} from "@/features/member/utils/validate-profile";

type SubmitStatus = "idle" | "saving" | "saved";

/** 첫 오류 칸으로 포커스를 옮길 때의 순서 (화면 위에서 아래 순서) */
const fieldOrder: ProfileFormField[] = ["name", "phone", "nickname"];

/** 입력란 이름 → 화면의 input id */
export const profileInputIds: Record<ProfileFormField, string> = {
  name: "profile-name",
  nickname: "profile-nickname",
  phone: "profile-phone",
};

/** 내 정보 입력 상태, 화면 검사, 저장을 관리합니다. */
export function useProfileForm(initialProfile: MyProfile) {
  const [saved, setSaved] = useState<ProfileFormValues>(() => toProfileFormValues(initialProfile));
  const [values, setValues] = useState<ProfileFormValues>(saved);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string>();

  const isChanged = !isSameProfile(values, saved);

  const changeValue = <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
    setSubmitError(undefined);
    // 고친 칸의 오류를 지웁니다. 국가를 바꾸면 이름 규칙이 달라지므로 이름 오류를 지웁니다.
    if (key !== "gender") {
      const errorField = key === "countryCode" ? "name" : key;
      setErrors((prev) => ({ ...prev, [errorField]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "saving" || !isChanged) {
      return;
    }

    const nextErrors = validateProfile(values);
    setErrors(nextErrors);

    const firstErrorField = fieldOrder.find((field) => nextErrors[field]);
    if (firstErrorField) {
      document.getElementById(profileInputIds[firstErrorField])?.focus();
      return;
    }

    setStatus("saving");
    const result = await updateMyProfile(values);

    if (result.ok) {
      const next = toProfileFormValues(result.profile);
      setSaved(next);
      setValues(next);
      setStatus("saved");
      return;
    }

    setStatus("idle");
    if (result.reason === "nickname-taken") {
      setErrors({ nickname: "이미 쓰고 있는 닉네임이에요. 다른 닉네임을 입력해 주세요." });
      document.getElementById(profileInputIds.nickname)?.focus();
      return;
    }
    setSubmitError("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
  };

  return { values, errors, status, submitError, isChanged, changeValue, handleSubmit };
}
