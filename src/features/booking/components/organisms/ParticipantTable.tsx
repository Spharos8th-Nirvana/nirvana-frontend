import { inputClassName } from "@/features/booking/components/atoms/FormField";
import SelectField from "@/shared/components/ui/SelectField";
import { countryOptions } from "@/shared/data/countries";
import type { ParticipantInfo } from "@/features/booking/types/booking";
import {
  ADULT_MIN_AGE,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  type BookingErrors,
} from "@/features/booking/utils/validate-booking";

type ParticipantInputField = "name" | "age" | "gender" | "countryCode" | "phone" | "email";

type ParticipantTableProps = {
  participants: ParticipantInfo[];
  errors: BookingErrors["participants"];
  sameAsBooker: boolean;
  genderRequired: boolean;
  onSameAsBookerChange: (checked: boolean) => void;
  onChange: (index: number, field: ParticipantInputField, value: string) => void;
  onFieldBlur: (index: number, field: ParticipantInputField) => void;
};

/**
 * 구분 | 이름 | 나이 | 성별 | 국적 | 휴대폰 | 이메일 (와이어프레임 순서)
 * 짧은 값(구분·나이·성별)은 좁게, 남는 공간은 이메일에 줍니다.
 */
const columnClass =
  "md:grid-cols-[60px_minmax(92px,1fr)_52px_84px_minmax(100px,1fr)_minmax(112px,1.1fr)_minmax(136px,1.5fr)]";

const cellInputClass = `${inputClassName} h-10 px-2.5`;
const cellSelectClass = "h-10 pl-2.5";

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1 text-xs text-error" role="alert">
      {message}
    </p>
  ) : null;
}

function CellLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  // 휴대폰 화면에서만 보이고, 넓은 화면에서는 표 머리글이 대신합니다. (화면 낭독기에는 항상 읽힘)
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs text-muted md:sr-only">
      {children}
    </label>
  );
}

/**
 * 참가자 정보 (DB bookingParticipants 기준)
 * - 첫 줄은 대표자(isRepresentative), 나머지는 참가자
 * - 이름·나이 필수, 성별은 숙박형만 필수, 국적·휴대폰·이메일은 선택
 */
export default function ParticipantTable({
  participants,
  errors,
  sameAsBooker,
  genderRequired,
  onSameAsBookerChange,
  onChange,
  onFieldBlur,
}: ParticipantTableProps) {
  return (
    <section aria-labelledby="participant-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="participant-title" className="text-2xl font-bold text-ink">
            참가자 정보
          </h2>
          <p className="mt-2 text-sm text-muted">
            성인은 만 {ADULT_MIN_AGE}세 이상, 청소년은 만 {ADULT_MIN_AGE}세 미만이에요.
            {genderRequired && " 숙박형 프로그램은 성별이 필요해요."}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={sameAsBooker}
            onChange={(event) => onSameAsBookerChange(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          대표자는 예약자 정보와 동일
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        {/* 아주 좁은 넓은-화면(태블릿 등)에서만 옆으로 밀리고, 보통은 한 화면에 들어갑니다. */}
        <div className="overflow-x-auto">
          <div className="md:min-w-[720px]">
            {/* 넓은 화면 표 머리글 */}
            <div
              className={`hidden gap-2 border-b border-border bg-subtle px-4 py-3 text-xs font-medium text-muted md:grid ${columnClass}`}
              aria-hidden="true"
            >
              <span className="text-center">구분</span>
              <span>
                이름 <span className="text-error">*</span>
              </span>
              <span>
                나이 <span className="text-error">*</span>
              </span>
              <span>성별 {genderRequired && <span className="text-error">*</span>}</span>
              <span>국적</span>
              <span>휴대폰</span>
              <span>이메일</span>
            </div>

            <ul className="divide-y divide-border">
              {participants.map((participant, index) => {
                const rowErrors = errors[index] ?? {};
                const isRepresentative = index === 0;
                const isLinked = sameAsBooker && isRepresentative;
                const id = `participant-${index}`;
                const roleLabel = isRepresentative ? "대표자" : "참가자";
                const name = isRepresentative ? roleLabel : `${roleLabel} ${index}`;
                const typeLabel = participant.type === "ADULT" ? "성인" : "청소년";

                return (
                  <li
                    key={id}
                    className={`grid grid-cols-2 gap-x-2 gap-y-3 px-4 py-4 md:items-start ${columnClass}`}
                  >
                    {/* 구분 */}
                    <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:h-10 md:flex-col md:justify-center md:gap-0">
                      <span className="text-sm font-bold text-ink">{roleLabel}</span>
                      <span
                        className={`text-[11px] leading-4 ${
                          participant.type === "ADULT" ? "text-muted" : "font-semibold text-sage-07"
                        }`}
                      >
                        {typeLabel}
                      </span>
                    </div>

                    {/* 이름 */}
                    <div className="col-span-2 md:col-span-1">
                      <CellLabel htmlFor={`${id}-name`}>{`${name} 이름 (필수)`}</CellLabel>
                      <input
                        id={`${id}-name`}
                        type="text"
                        maxLength={NAME_MAX_LENGTH}
                        value={participant.name}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "name", event.target.value)}
                        onBlur={() => onFieldBlur(index, "name")}
                        aria-invalid={Boolean(rowErrors.name)}
                        aria-describedby={rowErrors.name ? `${id}-name-error` : undefined}
                        className={cellInputClass}
                      />
                      <ErrorText id={`${id}-name-error`} message={rowErrors.name} />
                    </div>

                    {/* 나이 */}
                    <div>
                      <CellLabel htmlFor={`${id}-age`}>{`${name} 나이 (필수)`}</CellLabel>
                      <input
                        id={`${id}-age`}
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={participant.age}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "age", event.target.value)}
                        onBlur={() => onFieldBlur(index, "age")}
                        aria-invalid={Boolean(rowErrors.age)}
                        aria-describedby={rowErrors.age ? `${id}-age-error` : undefined}
                        className={`${cellInputClass} text-center`}
                      />
                      <ErrorText id={`${id}-age-error`} message={rowErrors.age} />
                    </div>

                    {/* 성별 */}
                    <div>
                      <CellLabel htmlFor={`${id}-gender`}>
                        {`${name} 성별${genderRequired ? " (필수)" : " (선택)"}`}
                      </CellLabel>
                      <SelectField
                        surface="subtle"
                        id={`${id}-gender`}
                        value={participant.gender}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "gender", event.target.value)}
                        onBlur={() => onFieldBlur(index, "gender")}
                        aria-invalid={Boolean(rowErrors.gender)}
                        aria-describedby={rowErrors.gender ? `${id}-gender-error` : undefined}
                        className={cellSelectClass}
                      >
                        <option value="">선택</option>
                        <option value="MALE">남성</option>
                        <option value="FEMALE">여성</option>
                      </SelectField>
                      <ErrorText id={`${id}-gender-error`} message={rowErrors.gender} />
                    </div>

                    {/* 국적 */}
                    <div className="col-span-2 md:col-span-1">
                      <CellLabel htmlFor={`${id}-country`}>{`${name} 국적 (선택)`}</CellLabel>
                      <SelectField
                        surface="subtle"
                        id={`${id}-country`}
                        value={participant.countryCode}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "countryCode", event.target.value)}
                        className={cellSelectClass}
                      >
                        <option value="">선택</option>
                        {countryOptions.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.label}
                          </option>
                        ))}
                      </SelectField>
                    </div>

                    {/* 휴대폰 */}
                    <div className="col-span-2 md:col-span-1">
                      <CellLabel htmlFor={`${id}-phone`}>{`${name} 휴대폰 (선택)`}</CellLabel>
                      <input
                        id={`${id}-phone`}
                        type="tel"
                        inputMode="numeric"
                        maxLength={13}
                        value={participant.phone}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "phone", event.target.value)}
                        onBlur={() => onFieldBlur(index, "phone")}
                        aria-invalid={Boolean(rowErrors.phone)}
                        aria-describedby={rowErrors.phone ? `${id}-phone-error` : undefined}
                        placeholder="숫자만"
                        className={cellInputClass}
                      />
                      <ErrorText id={`${id}-phone-error`} message={rowErrors.phone} />
                    </div>

                    {/* 이메일 */}
                    <div className="col-span-2 md:col-span-1">
                      <CellLabel htmlFor={`${id}-email`}>{`${name} 이메일 (선택)`}</CellLabel>
                      <input
                        id={`${id}-email`}
                        type="email"
                        maxLength={EMAIL_MAX_LENGTH}
                        value={participant.email}
                        disabled={isLinked}
                        onChange={(event) => onChange(index, "email", event.target.value)}
                        onBlur={() => onFieldBlur(index, "email")}
                        aria-invalid={Boolean(rowErrors.email)}
                        aria-describedby={rowErrors.email ? `${id}-email-error` : undefined}
                        className={cellInputClass}
                      />
                      <ErrorText id={`${id}-email-error`} message={rowErrors.email} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {sameAsBooker && (
        <p className="mt-3 text-xs text-muted">
          대표자는 예약자 정보로 채워져요. 나이·성별 등은 위 예약자 정보에서 입력해 주세요.
        </p>
      )}
    </section>
  );
}
