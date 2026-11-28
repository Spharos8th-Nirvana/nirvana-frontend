"use client";

import { useState, type FormEvent } from "react";
import { changePassword } from "@/features/auth/api/account-api";
import type {
  PasswordChangeErrors,
  PasswordChangeField,
  PasswordChangeValues,
} from "@/features/auth/types/account";
import { validatePassword, validatePasswordConfirmation } from "@/shared/utils/validate-user";

type SubmitStatus = "idle" | "saving" | "saved";

const emptyValues: PasswordChangeValues = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
};

/** 첫 오류 칸으로 포커스를 옮길 때의 순서 */
const fieldOrder: PasswordChangeField[] = [
  "currentPassword",
  "newPassword",
  "newPasswordConfirmation",
];

/** 입력란 이름 → 화면의 input id */
export const passwordInputIds: Record<PasswordChangeField, string> = {
  currentPassword: "password-current",
  newPassword: "password-new",
  newPasswordConfirmation: "password-new-confirm",
};

function validatePasswordChange(values: PasswordChangeValues): PasswordChangeErrors {
  const errors: PasswordChangeErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "지금 비밀번호를 입력해 주세요.";
  }

  const newPasswordError = validatePassword(values.newPassword);
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = "지금 비밀번호와 다른 비밀번호를 입력해 주세요.";
  }

  const confirmationError = validatePasswordConfirmation(
    values.newPassword,
    values.newPasswordConfirmation,
  );
  if (confirmationError) {
    errors.newPasswordConfirmation = confirmationError;
  }

  return errors;
}

/** 비밀번호 변경 입력 상태, 화면 검사, 저장을 관리합니다. */
export function usePasswordChangeForm() {
  const [values, setValues] = useState<PasswordChangeValues>(emptyValues);
  const [errors, setErrors] = useState<PasswordChangeErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string>();

  const changeValue = (field: PasswordChangeField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setStatus("idle");
    setSubmitError(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "saving") {
      return;
    }

    const nextErrors = validatePasswordChange(values);
    setErrors(nextErrors);

    const firstErrorField = fieldOrder.find((field) => nextErrors[field]);
    if (firstErrorField) {
      document.getElementById(passwordInputIds[firstErrorField])?.focus();
      return;
    }

    setStatus("saving");
    const result = await changePassword(values.currentPassword, values.newPassword);

    if (result.ok) {
      // 바꾼 비밀번호가 화면에 남지 않도록 칸을 비웁니다.
      setValues(emptyValues);
      setStatus("saved");
      return;
    }

    setStatus("idle");
    if (result.reason === "wrong-current") {
      setErrors({ currentPassword: "지금 비밀번호가 맞지 않아요." });
      document.getElementById(passwordInputIds.currentPassword)?.focus();
      return;
    }
    setSubmitError("비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.");
  };

  return { values, errors, status, submitError, changeValue, handleSubmit };
}
