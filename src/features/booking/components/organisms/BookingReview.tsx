import { countryOptions } from "@/features/booking/data/countries";
import type { BookerInfo, ParticipantInfo } from "@/features/booking/types/booking";

type BookingReviewProps = {
  /** 2단계에서 입력한 예약자 정보 */
  booker: BookerInfo;
  /** 예약자 정보가 반영된 참가자 목록 */
  participants: ParticipantInfo[];
  /** 대표자가 예약자와 동일한지 여부 */
  sameAsBooker: boolean;
};

/** 성별 DB 값을 화면에 표시할 한글로 변환합니다. */
function formatGender(gender: BookerInfo["gender"]) {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "";
}

/** 국가 코드를 국가 이름으로 변환합니다. */
function formatCountry(countryCode: string) {
  if (!countryCode) return "";

  return countryOptions.find((country) => country.code === countryCode)?.label ?? countryCode;
}

/** 값이 있는 정보만 표시하는 읽기 전용 항목 */
function ReviewField({ label, value }: { label: string; value?: string }) {
  // 선택 항목을 입력하지 않았다면 빈 항목을 표시하지 않습니다.
  if (!value?.trim()) return null;

  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

/**
 * 예약 정보 확인 Organism
 * - 예약자 및 참가자 정보를 읽기 전용으로 표시합니다.
 * - 정보 수정과 유효성 검사는 상위 Template에서 담당합니다.
 */
export default function BookingReview({ booker, participants, sameAsBooker }: BookingReviewProps) {
  return (
    <section className="space-y-8" aria-label="예약 정보 확인">
      {/* 예약자 정보 */}
      <section
        aria-labelledby="booking-review-booker-title"
        className="rounded-lg border border-border bg-white p-6"
      >
        <h2 id="booking-review-booker-title" className="text-xl font-bold text-ink">
          예약자 정보
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ReviewField label="이름" value={booker.name} />
          <ReviewField label="휴대전화" value={booker.phone} />
          <ReviewField label="나이" value={booker.age ? `${booker.age}세` : ""} />
          <ReviewField label="성별" value={formatGender(booker.gender)} />
          <ReviewField label="국적" value={formatCountry(booker.countryCode)} />
          <ReviewField label="거주 지역" value={booker.region} />
          <ReviewField label="이메일" value={booker.email} />
        </dl>

        {/* 전달사항은 입력한 경우에만 표시합니다. */}
        {booker.requestNote.trim() && (
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-xs text-muted">전달사항</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink">
              {booker.requestNote}
            </p>
          </div>
        )}
      </section>

      {/* 참가자 정보 */}
      <section aria-labelledby="booking-review-participant-title" className="space-y-4">
        <div>
          <h2 id="booking-review-participant-title" className="text-xl font-bold text-ink">
            참가자 정보
          </h2>

          {sameAsBooker && (
            <p className="mt-2 text-sm text-muted">대표자는 예약자 정보와 동일합니다.</p>
          )}
        </div>

        <ul className="space-y-4">
          {participants.map((participant, index) => {
            const roleLabel = index === 0 ? "대표자" : `참가자 ${index}`;

            const typeLabel = participant.type === "ADULT" ? "성인" : "청소년";

            return (
              <li
                key={`${participant.type}-${index}`}
                className="rounded-lg border border-border bg-white p-6"
              >
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <h3 className="font-bold text-ink">{roleLabel}</h3>

                  <span className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-muted">
                    {typeLabel}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ReviewField label="이름" value={participant.name} />
                  <ReviewField label="나이" value={participant.age ? `${participant.age}세` : ""} />
                  <ReviewField label="성별" value={formatGender(participant.gender)} />
                  <ReviewField label="국적" value={formatCountry(participant.countryCode)} />
                  <ReviewField label="휴대전화" value={participant.phone} />
                  <ReviewField label="이메일" value={participant.email} />
                </dl>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
