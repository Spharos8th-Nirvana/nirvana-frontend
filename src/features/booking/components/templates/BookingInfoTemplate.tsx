"use client";

import { useMemo, useState } from "react";
import BookerInfoForm from "@/features/booking/components/organisms/BookerInfoForm";
import BookingSummary from "@/features/booking/components/organisms/BookingSummary";
import ParticipantTable from "@/features/booking/components/organisms/ParticipantTable";
import TermsAgreement from "@/features/booking/components/organisms/TermsAgreement";
import type {
  BookerInfo,
  BookingSelection,
  BookingTerm,
  ParticipantInfo,
  RefundRule,
} from "@/features/booking/types/booking";
import {
  hasBookingErrors,
  validateBooking,
  type BookerField,
  type BookingErrors,
} from "@/features/booking/utils/validate-booking";

type BookingInfoTemplateProps = {
  selection: BookingSelection;
  terms: BookingTerm[];
  refundRules: RefundRule[];
  /** 숙박형이면 참가자 성별 필수 */
  genderRequired: boolean;
};

type ParticipantInputField = "name" | "age" | "gender" | "countryCode" | "phone" | "email";

const emptyBooker: BookerInfo = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  countryCode: "",
  region: "",
  email: "",
  requestNote: "",
};

/** 성인 먼저, 그다음 청소년 순서로 참가자 행을 만듭니다. */
function createParticipants(adultCount: number, youthCount: number): ParticipantInfo[] {
  const create = (type: ParticipantInfo["type"]): ParticipantInfo => ({
    type,
    name: "",
    age: "",
    gender: "",
    countryCode: "",
    phone: "",
    email: "",
  });

  return [
    ...Array.from({ length: adultCount }, () => create("ADULT")),
    ...Array.from({ length: youthCount }, () => create("YOUTH")),
  ];
}

const bookerFieldLabels: Record<BookerField, string> = {
  name: "예약자 이름",
  phone: "휴대전화",
  age: "예약자 나이",
  gender: "예약자 성별",
  email: "이메일",
};

const participantFieldLabels: Record<string, string> = {
  name: "이름",
  age: "나이",
  gender: "성별",
  phone: "휴대폰",
  email: "이메일",
};

export default function BookingInfoTemplate({
  selection,
  terms,
  refundRules,
  genderRequired,
}: BookingInfoTemplateProps) {
  const [booker, setBooker] = useState<BookerInfo>(emptyBooker);
  const [participants, setParticipants] = useState<ParticipantInfo[]>(() =>
    createParticipants(selection.adultCount, selection.youthCount),
  );
  const [sameAsBooker, setSameAsBooker] = useState(true);
  const [agreedTermIds, setAgreedTermIds] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const isLinked = sameAsBooker && participants.length > 0;

  // 체크하면 첫 번째 참가자는 예약자 정보를 그대로 사용합니다.
  const effectiveParticipants = useMemo(() => {
    if (!isLinked) {
      return participants;
    }

    const [first, ...rest] = participants;
    return [
      {
        ...first,
        name: booker.name,
        age: booker.age,
        gender: booker.gender,
        countryCode: booker.countryCode,
        phone: booker.phone,
        email: booker.email,
      },
      ...rest,
    ];
  }, [isLinked, participants, booker]);

  const errors = validateBooking({
    booker,
    participants: effectiveParticipants,
    terms,
    agreedTermIds,
    genderRequired,
    sameAsBooker: isLinked,
  });
  const canSubmit = !hasBookingErrors(errors);

  const markTouched = (key: string) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  // 입력 칸을 한 번 떠난 뒤에만 오류를 보여줍니다.
  const visibleBookerErrors: BookingErrors["booker"] = Object.fromEntries(
    Object.entries(errors.booker).filter(([field]) => touched[`booker.${field}`]),
  );

  const visibleParticipantErrors: BookingErrors["participants"] = errors.participants.map(
    (rowErrors, index) =>
      Object.fromEntries(
        Object.entries(rowErrors).filter(([field]) => touched[`participant.${index}.${field}`]),
      ),
  );

  const missingItems = [
    ...Object.keys(errors.booker).map((field) => bookerFieldLabels[field as BookerField]),
    ...errors.participants.flatMap((rowErrors, index) =>
      Object.keys(rowErrors).map(
        (field) => `참가자 ${index + 1} ${participantFieldLabels[field]}`,
      ),
    ),
    ...errors.missingTerms,
  ];

  const handleBookerChange = <K extends keyof BookerInfo>(field: K, value: BookerInfo[K]) => {
    setBooker((prev) => ({ ...prev, [field]: value }));
    setSubmitted(false);
  };

  const handleParticipantChange = (index: number, field: ParticipantInputField, value: string) => {
    setParticipants((prev) =>
      prev.map((participant, i) => (i === index ? { ...participant, [field]: value } : participant)),
    );
    setSubmitted(false);
  };

  const handleSameAsBookerChange = (checked: boolean) => {
    // 체크를 해제하면 지금까지 채워진 예약자 정보를 첫 번째 참가자 칸에 남겨 둡니다.
    if (!checked && effectiveParticipants.length > 0) {
      setParticipants(effectiveParticipants);
    }
    setSameAsBooker(checked);
    setSubmitted(false);
  };

  const handleTermToggle = (termId: string, checked: boolean) => {
    setAgreedTermIds((prev) =>
      checked ? [...prev, termId] : prev.filter((id) => id !== termId),
    );
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    // 3단계(결제 확인)와 예약 API 연동은 이번 범위가 아닙니다.
    // 개인정보가 포함되므로 콘솔이나 주소(URL)에 남기지 않습니다.
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="min-w-0 space-y-14">
        <BookerInfoForm
          value={booker}
          errors={visibleBookerErrors}
          ageRequired={isLinked}
          genderRequired={isLinked && genderRequired}
          onChange={handleBookerChange}
          onFieldBlur={(field) => markTouched(`booker.${field}`)}
        />

        <ParticipantTable
          participants={effectiveParticipants}
          errors={visibleParticipantErrors}
          sameAsBooker={isLinked}
          genderRequired={genderRequired}
          onSameAsBookerChange={handleSameAsBookerChange}
          onChange={handleParticipantChange}
          onFieldBlur={(index, field) => markTouched(`participant.${index}.${field}`)}
        />

        <TermsAgreement
          terms={terms}
          agreedTermIds={agreedTermIds}
          refundRules={refundRules}
          onToggle={handleTermToggle}
        />
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <BookingSummary
          selection={selection}
          canSubmit={canSubmit}
          missingItems={missingItems}
          submitted={submitted}
          onSubmit={handleSubmit}
        />

        <div className="rounded-lg bg-subtle p-6">
          <h2 className="font-bold text-ink">개인정보는 안전하게 보호됩니다.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            입력한 정보는 예약 진행과 사찰 안내를 위해 사용되며, 예약 내역에서 확인할 수 있습니다.
          </p>
        </div>

        <div className="rounded-lg bg-primary p-6 text-white">
          <h2 className="font-bold">안심하고, 천천히 확인하세요.</h2>
          <p className="mt-3 text-sm leading-6 text-white/80">
            선택한 날짜와 인원은 다음 단계에서 다시 확인할 수 있어요. 지금은 결제되지 않습니다.
          </p>
        </div>
      </aside>
    </div>
  );
}
