"use client";

import { profileInputIds, useProfileForm } from "@/features/member/hooks/useProfileForm";
import type { MyProfile, ProfileGender } from "@/features/member/types/profile";
import { NICKNAME_MAX_LENGTH } from "@/features/member/utils/validate-profile";
import Button from "@/shared/components/ui/Button";
import FormField, { inputClassName } from "@/shared/components/ui/FormField";
import SelectField from "@/shared/components/ui/SelectField";
import { countryOptions } from "@/shared/data/countries";
import {
  getNameHint,
  NAME_MAX_LENGTH,
  normalizePhoneInput,
  PHONE_MAX_LENGTH,
} from "@/shared/utils/validate-user";

type ProfileFormProps = {
  profile: MyProfile;
};

/** 내 정보: 이메일(보기만) + 이름·닉네임·국가·성별·휴대폰 수정 */
export default function ProfileForm({ profile }: ProfileFormProps) {
  const { values, errors, status, submitError, isChanged, changeValue, handleSubmit } =
    useProfileForm(profile);

  return (
    <section
      aria-labelledby="profile-form-title"
      className="rounded-default border border-border bg-surface p-5 md:p-7"
    >
      <h3 id="profile-form-title" className="text-base font-bold text-ink">
        내 정보
      </h3>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 순서: 이름·성별 → 국가·휴대폰 → 닉네임·이메일(보기만). 비밀번호는 아래 비밀번호 변경 칸 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="이름"
            htmlFor={profileInputIds.name}
            required
            error={errors.name}
            hint={getNameHint(values.countryCode)}
          >
            <input
              id={profileInputIds.name}
              type="text"
              autoComplete="name"
              maxLength={NAME_MAX_LENGTH}
              value={values.name}
              onChange={(event) => changeValue("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${profileInputIds.name}-error` : undefined}
              className={inputClassName}
            />
          </FormField>

          <FormField label="성별" htmlFor="profile-gender">
            <SelectField
              id="profile-gender"
              surface="subtle"
              value={values.gender}
              onChange={(event) => changeValue("gender", event.target.value as ProfileGender | "")}
            >
              <option value="">선택 안 함</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </SelectField>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label="국가" htmlFor="profile-country">
            <SelectField
              id="profile-country"
              surface="subtle"
              value={values.countryCode}
              onChange={(event) => changeValue("countryCode", event.target.value)}
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </SelectField>
          </FormField>

          <FormField
            label="휴대폰"
            htmlFor={profileInputIds.phone}
            required
            error={errors.phone}
            hint="하이픈(-)은 자동으로 빠져요. 해외 번호는 맨 앞에 +"
          >
            <input
              id={profileInputIds.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={PHONE_MAX_LENGTH}
              value={values.phone}
              onChange={(event) => changeValue("phone", normalizePhoneInput(event.target.value))}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${profileInputIds.phone}-error` : undefined}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="닉네임"
            htmlFor={profileInputIds.nickname}
            required
            error={errors.nickname}
            hint={`커뮤니티와 후기에 보이는 이름이에요. (${NICKNAME_MAX_LENGTH}자까지)`}
          >
            <input
              id={profileInputIds.nickname}
              type="text"
              autoComplete="nickname"
              maxLength={NICKNAME_MAX_LENGTH}
              value={values.nickname}
              onChange={(event) => changeValue("nickname", event.target.value)}
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={errors.nickname ? `${profileInputIds.nickname}-error` : undefined}
              className={inputClassName}
            />
          </FormField>

          {/* 이메일은 로그인 아이디라 보기만 합니다. (입력 칸이 아니라서 FormField를 쓰지 않음) */}
          <dl>
            <dt className="mb-2 text-label-13 font-medium text-ink">이메일</dt>
            <dd className="flex min-h-12 items-center rounded-md bg-subtle px-3 text-sm wrap-anywhere text-muted">
              {profile.email}
            </dd>
            <dd className="mt-2 text-xs text-muted/70">이메일은 로그인 아이디라 바꿀 수 없어요.</dd>
          </dl>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          {/* 저장 결과는 화면 읽기 프로그램에도 알려 줍니다. */}
          <p role="status" className="text-sm sm:mr-auto">
            {status === "saved" && <span className="text-primary">저장했어요.</span>}
            {submitError && <span className="text-error">{submitError}</span>}
          </p>
          <Button type="submit" disabled={!isChanged || status === "saving"} className="sm:px-9">
            {status === "saving" ? "저장 중…" : "저장"}
          </Button>
        </div>
      </form>
    </section>
  );
}
