"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import {
  GoogleLogo,
  KakaoLogo,
  NaverLogo,
} from "@/features/auth/components/atoms/SocialLoginIcons";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import Button from "@/shared/components/ui/Button";
import FormField, { inputBaseClassName } from "@/shared/components/ui/FormField";

/** 로그인 입력 칸: 연한 바탕 위라서 흰색 (회원가입과 같음) */
const loginInputClass = `${inputBaseClassName} bg-white`;

/** SNS 로그인 버튼 자리. 흐름이 정해지면 연결합니다. 버튼 색은 각 회사 로그인 버튼 색을 따릅니다. */
const socialProviders = [
  { id: "google", name: "구글", Logo: GoogleLogo, buttonClass: "border border-border bg-white" },
  { id: "naver", name: "네이버", Logo: NaverLogo, buttonClass: "bg-[#03C75A]" },
  { id: "kakao", name: "카카오", Logo: KakaoLogo, buttonClass: "bg-[#FEE500]" },
];
const fieldInputIds = {
  email: "login-email",
  password: "login-password",
} as const;

/**
 * 이메일 로그인.
 * SNS 로그인과 비밀번호 찾기는 자리만 두고 비활성으로 표시합니다. (흐름·API 확정 후 연결)
 * 아이디(이메일) 찾기는 두지 않습니다. 이메일이 아이디이고, 휴대폰 인증이 없어 본인 확인 방법이 없기 때문입니다.
 */
export default function LoginForm() {
  const form = useLoginForm();
  const { values, errors } = form;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstErrorField = await form.submit();
    if (firstErrorField) {
      document.getElementById(fieldInputIds[firstErrorField])?.focus();
    }
  }

  return (
    <section aria-labelledby="login-title">
      <h2 id="login-title" className="text-2xl font-bold text-ink">
        이메일 로그인
      </h2>
      <p className="mt-2 text-sm text-muted">가입한 이메일과 비밀번호를 입력해 주세요.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        <FormField label="이메일" htmlFor="login-email" required error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => form.changeValue("email", event.target.value)}
            placeholder="이메일을 입력해 주세요"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={loginInputClass}
          />
        </FormField>

        <FormField label="비밀번호" htmlFor="login-password" required error={errors.password}>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => form.changeValue("password", event.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className={loginInputClass}
          />
        </FormField>

        <div>
          {form.submitError && (
            <p className="mb-2 text-sm text-error" role="alert">
              {form.submitError}
            </p>
          )}
          <Button type="submit" disabled={form.isSubmitting} className="w-full">
            {form.isSubmitting ? "로그인 중…" : "로그인"}
          </Button>
        </div>
      </form>

      {/* 비밀번호 찾기(준비 중) · 회원가입 */}
      <div className="mt-4 flex items-center justify-center gap-3 text-sm">
        <span className="cursor-not-allowed text-muted/60">
          비밀번호 찾기 <span className="text-xs">(준비 중)</span>
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-border" />
        <Link href="/signup" className="font-medium text-ink hover:text-primary">
          회원가입
        </Link>
      </div>

      {/* SNS 로그인 자리 */}
      <div className="mt-12">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          SNS 계정으로 로그인
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>
        <ul className="mt-6 flex justify-center gap-8">
          {socialProviders.map(({ id, name, Logo, buttonClass }) => (
            <li key={id} className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled
                aria-label={`${name} 로그인`}
                aria-describedby="login-social-notice"
                className={`flex size-12 items-center justify-center rounded-full disabled:cursor-not-allowed ${buttonClass}`}
              >
                <Logo className={id === "naver" ? "size-4" : "size-6"} />
              </button>
              <span aria-hidden="true" className="text-xs text-muted">
                {name}
              </span>
            </li>
          ))}
        </ul>
        <p id="login-social-notice" className="mt-4 text-center text-xs text-muted/70">
          SNS 로그인은 준비 중이에요.
        </p>
      </div>
    </section>
  );
}
