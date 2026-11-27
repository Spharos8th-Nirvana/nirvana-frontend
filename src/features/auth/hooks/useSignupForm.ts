import { useState } from "react";
import { signup } from "@/features/auth/api/signup-api";
import type { SignupFormValues, SignupSummary } from "@/features/auth/types/signup";
import {
  buildSignupRequest,
  hasSignupErrors,
  validateSignupForm,
  type SignupFormErrors,
  type SignupFormField,
} from "@/features/auth/utils/validate-signup";

const COMMON_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";

const initialValues: SignupFormValues = {
  password: "",
  passwordConfirmation: "",
  name: "",
  phone: "",
  gender: "",
  countryCode: "KR",
  emailMarketingAgree: null,
  smsMarketingAgree: null,
};

/** 화면 위에서 아래 순서. 가입 실패 시 첫 번째 오류 칸으로 이동할 때 씁니다. */
const formFieldOrder: SignupFormField[] = ["password", "passwordConfirmation", "name", "phone"];

function isFormField(field: string): field is SignupFormField {
  return (formFieldOrder as string[]).includes(field);
}

function getFirstErrorField(errors: SignupFormErrors): SignupFormField | null {
  return formFieldOrder.find((field) => errors[field]) ?? null;
}

type UseSignupFormOptions = {
  email: string;
  verificationToken: string;
  /** 가입 성공. ④ 완료 화면에 입력 정보 요약을 보여 줍니다. */
  onComplete: (summary: SignupSummary) => void;
  /** 인증 토큰이 만료됨. 토큰을 지우고 ② 이메일 인증으로 돌아갑니다. */
  onTokenInvalid: () => void;
};

/**
 * ③ 가입 정보 입력의 상태와 동작.
 * 화면(SignupInfoForm)은 그리기만 하고, 검사·가입 요청은 여기서 처리합니다.
 */
export function useSignupForm({
  email,
  verificationToken,
  onComplete,
  onTokenInvalid,
}: UseSignupFormOptions) {
  const [values, setValues] = useState<SignupFormValues>(initialValues);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** 특정 입력 칸에 붙일 수 없는 오류 (공통 오류 등) */
  const [submitError, setSubmitError] = useState("");

  function changeValue<K extends keyof SignupFormValues>(field: K, value: SignupFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));

    // 고치기 시작하면 그 칸의 오류는 지웁니다.
    if (isFormField(field)) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  /** 가입 요청. 오류가 있으면 첫 번째 오류 칸 이름을 돌려줍니다. (화면이 그 칸으로 이동) */
  async function submit(): Promise<SignupFormField | null> {
    setSubmitError("");

    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);
    if (hasSignupErrors(nextErrors)) {
      return getFirstErrorField(nextErrors);
    }

    setIsSubmitting(true);
    const result = await signup(buildSignupRequest(values, email, verificationToken));
    setIsSubmitting(false);

    if (result.ok) {
      onComplete({ email, name: values.name.trim(), phone: values.phone });
      return null;
    }

    const { error } = result;

    switch (error.code) {
      case "INVALID_EMAIL_VERIFICATION_TOKEN":
        onTokenInvalid();
        return null;

      case "EMAIL_ALREADY_USED":
        setSubmitError("이미 가입된 이메일이에요. 이메일을 변경해 다시 인증해 주세요.");
        return null;

      // 입력란별 오류는 해당 칸에, 화면에 칸이 없는 항목은 아래 공통 안내에 표시합니다.
      case "INVALID_REQUEST": {
        const fieldErrors: SignupFormErrors = {};
        const otherMessages: string[] = [];

        for (const detail of error.details ?? []) {
          if (isFormField(detail.field)) {
            fieldErrors[detail.field] = detail.message;
          } else {
            otherMessages.push(detail.message);
          }
        }

        setErrors(fieldErrors);
        if (otherMessages.length > 0 || !hasSignupErrors(fieldErrors)) {
          setSubmitError(otherMessages.join(" ") || error.message || COMMON_ERROR_MESSAGE);
        }
        return getFirstErrorField(fieldErrors);
      }

      default:
        setSubmitError(COMMON_ERROR_MESSAGE);
        return null;
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    changeValue,
    submit,
  };
}
