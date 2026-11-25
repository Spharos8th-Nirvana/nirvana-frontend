import FormField, { inputClassName } from "@/features/booking/components/atoms/FormField";
import SelectField from "@/shared/components/ui/SelectField";
import { countryOptions } from "@/features/booking/data/countries";
import type { BookerInfo } from "@/features/booking/types/booking";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  REGION_MAX_LENGTH,
  REQUEST_NOTE_MAX_LENGTH,
  type BookingErrors,
} from "@/features/booking/utils/validate-booking";

type BookerInfoFormProps = {
  value: BookerInfo;
  errors: BookingErrors["booker"];
  /** 예약자가 첫 번째 참가자일 때 나이 필수 */
  ageRequired: boolean;
  /** 예약자가 첫 번째 참가자이고 숙박형일 때 성별 필수 */
  genderRequired: boolean;
  onChange: <K extends keyof BookerInfo>(field: K, value: BookerInfo[K]) => void;
  onFieldBlur: (field: keyof BookerInfo) => void;
};

function describedBy(id: string, error?: string) {
  return error ? `${id}-error` : undefined;
}

/**
 * 예약자 정보. 이름·휴대전화만 필수 (DB 기준)
 * 예약자가 첫 번째 참가자이면 참가자 필수 항목(나이, 숙박형 성별)도 필수가 됩니다.
 */
export default function BookerInfoForm({
  value,
  errors,
  ageRequired,
  genderRequired,
  onChange,
  onFieldBlur,
}: BookerInfoFormProps) {
  const participantHint = "첫 번째 참가자 정보로도 사용돼요.";
  return (
    <section aria-labelledby="booker-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="booker-title" className="text-2xl font-bold text-ink">
            예약자 정보
          </h2>
          <p className="mt-2 text-sm text-muted">예약 안내를 받을 정보를 입력해 주세요.</p>
        </div>
        <p className="text-xs text-muted">
          <span className="text-error">*</span> 필수 입력 항목
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 rounded-lg border border-border bg-white p-6 md:grid-cols-2">
        <FormField label="이름" htmlFor="booker-name" required error={errors.name}>
          <input
            id="booker-name"
            type="text"
            autoComplete="name"
            maxLength={NAME_MAX_LENGTH}
            value={value.name}
            onChange={(event) => onChange("name", event.target.value)}
            onBlur={() => onFieldBlur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("booker-name", errors.name)}
            placeholder="홍길동"
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="휴대전화"
          htmlFor="booker-phone"
          required
          error={errors.phone}
          hint="숫자만 입력해 주세요. (10~11자리)"
        >
          <input
            id="booker-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={13}
            value={value.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            onBlur={() => onFieldBlur("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("booker-phone", errors.phone)}
            placeholder="01000000000"
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="나이"
          htmlFor="booker-age"
          required={ageRequired}
          error={errors.age}
          hint={ageRequired ? participantHint : undefined}
        >
          <input
            id="booker-age"
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={value.age}
            onChange={(event) => onChange("age", event.target.value)}
            onBlur={() => onFieldBlur("age")}
            aria-invalid={Boolean(errors.age)}
            aria-describedby={describedBy("booker-age", errors.age)}
            placeholder="30"
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="성별"
          htmlFor="booker-gender"
          required={genderRequired}
          error={errors.gender}
          hint={genderRequired ? participantHint : undefined}
        >
          <SelectField
            surface="subtle"
            id="booker-gender"
            value={value.gender}
            aria-invalid={Boolean(errors.gender)}
            aria-describedby={describedBy("booker-gender", errors.gender)}
            onChange={(event) => onChange("gender", event.target.value as BookerInfo["gender"])}
            onBlur={() => onFieldBlur("gender")}
          >
            <option value="">{genderRequired ? "선택" : "선택 안 함"}</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </SelectField>
        </FormField>

        <FormField label="국적" htmlFor="booker-country">
          <SelectField
            surface="subtle"
            id="booker-country"
            value={value.countryCode}
            onChange={(event) => onChange("countryCode", event.target.value)}
          >
            <option value="">선택 안 함</option>
            {countryOptions.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </SelectField>
        </FormField>

        <FormField label="거주 지역" htmlFor="booker-region">
          <input
            id="booker-region"
            type="text"
            maxLength={REGION_MAX_LENGTH}
            value={value.region}
            onChange={(event) => onChange("region", event.target.value)}
            placeholder="서울특별시"
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="이메일"
          htmlFor="booker-email"
          error={errors.email}
          className="md:col-span-2"
        >
          <input
            id="booker-email"
            type="email"
            autoComplete="email"
            maxLength={EMAIL_MAX_LENGTH}
            value={value.email}
            onChange={(event) => onChange("email", event.target.value)}
            onBlur={() => onFieldBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("booker-email", errors.email)}
            placeholder="user@example.com"
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="전달사항"
          htmlFor="booker-note"
          className="md:col-span-2"
          hint={`${value.requestNote.length} / ${REQUEST_NOTE_MAX_LENGTH}자`}
        >
          <textarea
            id="booker-note"
            rows={3}
            maxLength={REQUEST_NOTE_MAX_LENGTH}
            value={value.requestNote}
            onChange={(event) => onChange("requestNote", event.target.value)}
            placeholder="사찰에 미리 알릴 내용이 있다면 입력해 주세요."
            className={`${inputClassName} h-auto resize-none py-3 leading-6`}
          />
        </FormField>

        <p className="text-xs text-muted md:col-span-2">
          입력한 연락처로 예약 확인과 참여 안내를 보내드립니다.
        </p>
      </div>
    </section>
  );
}
