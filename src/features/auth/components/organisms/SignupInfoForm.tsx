import type { FormEvent } from "react";
import { useSignupForm } from "@/features/auth/hooks/useSignupForm";
import type { SignupGender, SignupSummary } from "@/features/auth/types/signup";
import {
  getNameHint,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  normalizePhoneInput,
  passwordRules,
  type SignupFormField,
} from "@/features/auth/utils/validate-signup";
import Button from "@/shared/components/ui/Button";
import FormField, { inputBaseClassName } from "@/shared/components/ui/FormField";
import SelectField from "@/shared/components/ui/SelectField";
import { countryOptions } from "@/shared/data/countries";

type SignupInfoFormProps = {
  email: string;
  verificationToken: string;
  /** "변경" 버튼. 토큰을 지우고 ② 이메일 인증으로 돌아갑니다. */
  onChangeEmail: () => void;
  onTokenInvalid: () => void;
  onComplete: (summary: SignupSummary) => void;
};

/** 회원가입 입력 칸: 연한 바탕 위라서 흰색 */
const signupInputClass = `${inputBaseClassName} bg-white`;

/** 이메일 칸 옆 "변경" 버튼 */
const sideButtonClass =
  "h-12 shrink-0 rounded-md border border-border bg-white px-4 text-sm font-bold text-ink transition-colors hover:border-primary hover:bg-subtle disabled:cursor-not-allowed disabled:text-muted disabled:hover:border-border disabled:hover:bg-white";

/** 입력란 이름 → 화면의 input id */
const fieldInputIds: Record<SignupFormField, string> = {
  password: "signup-password",
  passwordConfirmation: "signup-password-confirm",
  name: "signup-name",
  phone: "signup-phone",
};

const marketingChannels = [
  { field: "smsMarketingAgree", label: "SMS" },
  { field: "emailMarketingAgree", label: "이메일" },
] as const;

/** 마케팅 수신 선택지. 기본 선택은 없습니다. (null) */
const marketingOptions = [
  { value: true, label: "수신함" },
  { value: false, label: "수신하지 않음" },
] as const;

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

/**
 * ③ 가입 정보 입력 (Figma 회원가입 정보 입력 화면 기준)
 * 닉네임은 받지 않습니다. (가입 후 백엔드가 랜덤으로 생성) 마케팅 수신은 기본 선택이 없습니다.
 */
export default function SignupInfoForm({
  email,
  verificationToken,
  onChangeEmail,
  onTokenInvalid,
  onComplete,
}: SignupInfoFormProps) {
  const form = useSignupForm({ email, verificationToken, onComplete, onTokenInvalid });
  const { values, errors } = form;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstErrorField = await form.submit();
    if (firstErrorField) {
      document.getElementById(fieldInputIds[firstErrorField])?.focus();
    }
  }

  return (
    <section aria-labelledby="signup-info-title">
      <h3 id="signup-info-title" className="text-2xl font-bold text-ink">
        가입 정보 입력
      </h3>
      <p className="mt-2 text-sm text-muted">서비스 이용에 필요한 정보를 입력해 주세요.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
        <FormField label="국가" htmlFor="signup-country">
          <SelectField
            id="signup-country"
            value={values.countryCode}
            onChange={(event) => form.changeValue("countryCode", event.target.value)}
          >
            {countryOptions.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </SelectField>
        </FormField>

        <FormField label="이메일" htmlFor="signup-info-email" required>
          <div className="flex gap-2">
            <input
              id="signup-info-email"
              type="email"
              value={email}
              readOnly
              className={`${inputBaseClassName} bg-subtle text-muted`}
            />
            <button type="button" onClick={onChangeEmail} className={sideButtonClass}>
              변경
            </button>
          </div>
        </FormField>

        <FormField label="비밀번호" htmlFor="signup-password" required error={errors.password}>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => form.changeValue("password", event.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={describedBy(
              "signup-password-rules",
              errors.password && "signup-password-error",
            )}
            className={signupInputClass}
          />
          {/* 규칙을 만족하면 ✓ 가 초록색으로 바뀝니다. */}
          <ul id="signup-password-rules" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {passwordRules.map((rule) => {
              const passed = rule.test(values.password);
              return (
                <li key={rule.id} className={passed ? "text-primary" : "text-muted/70"}>
                  <span aria-hidden="true">✓ </span>
                  {rule.label}
                  <span className="sr-only">{passed ? " 충족" : " 미충족"}</span>
                </li>
              );
            })}
          </ul>
        </FormField>

        <FormField
          label="비밀번호 확인"
          htmlFor="signup-password-confirm"
          required
          error={errors.passwordConfirmation}
        >
          <input
            id="signup-password-confirm"
            type="password"
            autoComplete="new-password"
            value={values.passwordConfirmation}
            onChange={(event) => form.changeValue("passwordConfirmation", event.target.value)}
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            aria-invalid={Boolean(errors.passwordConfirmation)}
            aria-describedby={describedBy(
              errors.passwordConfirmation && "signup-password-confirm-error",
            )}
            className={signupInputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            label="이름"
            htmlFor="signup-name"
            required
            error={errors.name}
            hint={getNameHint(values.countryCode)}
          >
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              maxLength={NAME_MAX_LENGTH}
              value={values.name}
              onChange={(event) => form.changeValue("name", event.target.value)}
              placeholder="이름"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy(errors.name && "signup-name-error")}
              className={signupInputClass}
            />
          </FormField>

          <FormField label="성별" htmlFor="signup-gender">
            <SelectField
              id="signup-gender"
              value={values.gender}
              onChange={(event) =>
                form.changeValue("gender", event.target.value as SignupGender | "")
              }
            >
              <option value="">선택 안 함</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </SelectField>
          </FormField>
        </div>

        <FormField
          label="휴대폰"
          htmlFor="signup-phone"
          required
          error={errors.phone}
          hint="하이픈(-)은 자동으로 빠져요."
        >
          <input
            id="signup-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={PHONE_MAX_LENGTH}
            value={values.phone}
            onChange={(event) => form.changeValue("phone", normalizePhoneInput(event.target.value))}
            placeholder="01012345678"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(errors.phone && "signup-phone-error")}
            className={signupInputClass}
          />
        </FormField>

        <hr className="border-border" />

        <fieldset>
          <legend className="text-label-13 font-medium text-ink">
            템플스테이 주요 사업안내, 행사일정 등 알림 수신여부
            <span className="ml-1 text-xs font-normal text-muted/70">(선택)</span>
          </legend>

          <div className="mt-4 space-y-4">
            {marketingChannels.map((channel) => (
              <div
                key={channel.field}
                role="radiogroup"
                aria-label={`${channel.label} 수신여부`}
                className="flex flex-wrap items-center gap-x-6 gap-y-2"
              >
                <span className="w-14 text-sm font-medium text-ink">{channel.label}</span>
                {marketingOptions.map((option) => (
                  <label
                    key={option.label}
                    className="flex cursor-pointer items-center gap-2 text-sm text-ink"
                  >
                    <input
                      type="radio"
                      name={channel.field}
                      checked={values[channel.field] === option.value}
                      onChange={() => form.changeValue(channel.field, option.value)}
                      className="size-4 accent-primary"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </fieldset>

        <div>
          {form.submitError && (
            <p className="mb-2 text-sm text-error" role="alert">
              {form.submitError}
            </p>
          )}
          <Button type="submit" disabled={form.isSubmitting} className="w-full">
            {form.isSubmitting ? "가입 중…" : "가입 완료"}
          </Button>
          <p className="mt-2 text-xs text-muted">
            <span className="text-error">*</span> 표시는 필수 입력 항목입니다.
          </p>
        </div>
      </form>
    </section>
  );
}
