import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCsrfToken, login } from "@/features/auth/api/login-api";
import type { LoginFormValues } from "@/features/auth/types/login";
import { validateEmail } from "@/features/auth/utils/validate-signup";

type LoginField = keyof LoginFormValues;
type LoginErrors = Partial<Record<LoginField, string>>;

const INVALID_MESSAGE = "이메일 또는 비밀번호를 확인해 주세요.";
const COMMON_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";

function validateLogin(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {};

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해 주세요.";
  }

  return errors;
}

/**
 * 로그인 화면의 상태와 동작.
 * 화면(LoginForm)은 그리기만 하고, 검사·CSRF 토큰·로그인 요청은 여기서 처리합니다.
 */
export function useLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** 입력 칸 하나에 붙일 수 없는 안내 (로그인 실패 등) */
  const [submitError, setSubmitError] = useState("");

  function changeValue(field: LoginField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setSubmitError("");
  }

  /** 로그인 요청. 입력 오류가 있으면 첫 번째 오류 칸 이름을 돌려줍니다. (화면이 그 칸으로 이동) */
  async function submit(): Promise<LoginField | null> {
    setSubmitError("");

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (nextErrors.email) return "email";
    if (nextErrors.password) return "password";

    setIsSubmitting(true);
    const csrfToken = await getCsrfToken();
    const result = await login(
      { email: values.email.trim(), password: values.password },
      csrfToken,
    );

    if (result.ok) {
      router.push("/");
      return null;
    }

    setIsSubmitting(false);
    setSubmitError(result.reason === "invalid" ? INVALID_MESSAGE : COMMON_ERROR_MESSAGE);
    return null;
  }

  return { values, errors, isSubmitting, submitError, changeValue, submit };
}
