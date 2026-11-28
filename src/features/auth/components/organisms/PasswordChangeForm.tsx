"use client";

import {
  passwordInputIds,
  usePasswordChangeForm,
} from "@/features/auth/hooks/usePasswordChangeForm";
import Button from "@/shared/components/ui/Button";
import FormField, { inputClassName } from "@/shared/components/ui/FormField";
import { passwordRules } from "@/shared/utils/validate-user";

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

/** 비밀번호 변경: 지금 비밀번호 → 새 비밀번호 → 새 비밀번호 확인 */
export default function PasswordChangeForm() {
  const { values, errors, status, submitError, changeValue, handleSubmit } =
    usePasswordChangeForm();

  return (
    <section
      aria-labelledby="password-change-title"
      className="rounded-default border border-border bg-surface p-5 md:p-7"
    >
      <h3 id="password-change-title" className="text-base font-bold text-ink">
        비밀번호 변경
      </h3>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-6">
        <FormField
          label="지금 비밀번호"
          htmlFor={passwordInputIds.currentPassword}
          required
          error={errors.currentPassword}
        >
          <input
            id={passwordInputIds.currentPassword}
            type="password"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={(event) => changeValue("currentPassword", event.target.value)}
            aria-invalid={Boolean(errors.currentPassword)}
            aria-describedby={describedBy(
              errors.currentPassword && `${passwordInputIds.currentPassword}-error`,
            )}
            className={inputClassName}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="새 비밀번호"
            htmlFor={passwordInputIds.newPassword}
            required
            error={errors.newPassword}
          >
            <input
              id={passwordInputIds.newPassword}
              type="password"
              autoComplete="new-password"
              value={values.newPassword}
              onChange={(event) => changeValue("newPassword", event.target.value)}
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={describedBy(
                "password-new-rules",
                errors.newPassword && `${passwordInputIds.newPassword}-error`,
              )}
              className={inputClassName}
            />
            {/* 회원가입과 같은 규칙 목록. 만족하면 ✓ 가 초록색으로 바뀝니다. */}
            <ul id="password-new-rules" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {passwordRules.map((rule) => {
                const passed = rule.test(values.newPassword);
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
            label="새 비밀번호 확인"
            htmlFor={passwordInputIds.newPasswordConfirmation}
            required
            error={errors.newPasswordConfirmation}
          >
            <input
              id={passwordInputIds.newPasswordConfirmation}
              type="password"
              autoComplete="new-password"
              value={values.newPasswordConfirmation}
              onChange={(event) => changeValue("newPasswordConfirmation", event.target.value)}
              aria-invalid={Boolean(errors.newPasswordConfirmation)}
              aria-describedby={describedBy(
                errors.newPasswordConfirmation &&
                  `${passwordInputIds.newPasswordConfirmation}-error`,
              )}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <p role="status" className="text-sm sm:mr-auto">
            {status === "saved" && <span className="text-primary">비밀번호를 바꿨어요.</span>}
            {submitError && <span className="text-error">{submitError}</span>}
          </p>
          <Button type="submit" disabled={status === "saving"} className="sm:px-9">
            {status === "saving" ? "바꾸는 중…" : "비밀번호 변경"}
          </Button>
        </div>
      </form>
    </section>
  );
}
