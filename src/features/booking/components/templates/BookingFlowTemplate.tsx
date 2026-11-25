"use client";

// 화면 상태 관리와 브라우저 이탈 이벤트 처리를 위한 React Hook
import { useEffect, useMemo, useState } from "react";
import BookerInfoForm from "@/features/booking/components/organisms/BookerInfoForm";
import BookingSummary from "@/features/booking/components/organisms/BookingSummary";
// 예약 진행 단계 표시(2단계와 3단계 전환에 사용)
import BookingProgress from "@/features/booking/components/organisms/BookingProgress";
// 3단계 - 예약자와 참가자 정보를 읽기 전용으로 보여줌
import BookingReview from "../organisms/BookingReview";
// 3단계 - 결제수단 선택 UI를 표시
import PaymentMethodSelector from "../organisms/PaymentMethodSelector";
// 3단계 - 최종 결제 금액과 결제 버튼을 표시
import PaymentSummary from "../organisms/PaymentSummary";

import ParticipantTable from "@/features/booking/components/organisms/ParticipantTable";
import TermsAgreement from "@/features/booking/components/organisms/TermsAgreement";

import type {
  BookerInfo,
  BookingPaymentMethod,
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

// BookingFlowTemplate에서 사용하는 Props 타입
type BookingFlowTemplateProps = {
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

// 예약 입력부터 결제 확인까지 전체 예약 흐름을 관리하는 Template
export default function BookingFlowTemplate({
  selection,
  terms,
  refundRules,
  genderRequired,
}: BookingFlowTemplateProps) {
  const [booker, setBooker] = useState<BookerInfo>(emptyBooker);
  const [participants, setParticipants] = useState<ParticipantInfo[]>(() =>
    createParticipants(selection.adultCount, selection.youthCount),
  );
  const [sameAsBooker, setSameAsBooker] = useState(true);
  const [agreedTermIds, setAgreedTermIds] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState<2 | 3>(2);

  // 사용자가 선택한 결제수단 관리
  // 처음에는 아무 결제수단도 선택하지 않은 상태
  const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethod | null>(null);

  // 실제 결제 연동이 없으므로 버튼 클릭 시 안내 메시지를 관리
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // 사용자가 예약 정보를 입력했거나 결제수단을 선택했는지 확인.
  // 입력값이 하나도 없다면 불필요한 이탈 경고를 표시하지 않는다.
  const hasUnsavedInput =
    Object.values(booker).some((value) => value.trim() !== "") ||
    participants.some((participant) =>
      [
        participant.name,
        participant.age,
        participant.gender,
        participant.countryCode,
        participant.phone,
        participant.email,
      ].some((value) => value.trim() !== ""),
    ) ||
    agreedTermIds.length > 0 ||
    !sameAsBooker ||
    paymentMethod !== null;

  // 입력한 정보가 있는 경우 브라우저 이탈 경고를 등록
  useEffect(() => {
    // 입력한 정보가 없다면 경고를 등록하지 않음
    if (!hasUnsavedInput) {
      return;
    }
    // 입력한 정보가 사라지는 것을 방지하기 위해 브라우저 이탈을 취소
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    // 입력 상태가 변경되거나 컴포넌트가 사라지면 이벤트를 정리
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedInput]);

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
      Object.keys(rowErrors).map((field) => `참가자 ${index + 1} ${participantFieldLabels[field]}`),
    ),
    ...errors.missingTerms,
  ];

  const handleBookerChange = <K extends keyof BookerInfo>(field: K, value: BookerInfo[K]) => {
    setBooker((prev) => ({ ...prev, [field]: value }));
    setSubmitted(false);
  };

  const handleParticipantChange = (index: number, field: ParticipantInputField, value: string) => {
    setParticipants((prev) =>
      prev.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant,
      ),
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
    setAgreedTermIds((prev) => (checked ? [...prev, termId] : prev.filter((id) => id !== termId)));
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    // 예약 API 연동은 이번 범위가 아닙니다.
    // 개인정보가 포함되므로 콘솔이나 주소(URL)에 남기지 않습니다.
    setSubmitted(true);
    setCurrentStep(3);
  };

  // 이전 단계로 돌아가는 함수
  const handleBackToInfo = () => {
    setSubmitted(false);
    setCurrentStep(2);
  };

  // 날짜와 인원을 변경하기 전에 입력 정보 유실 여부를 확인
  const handleBeforeEdit = () => {
    // 입력한 정보가 없다면 별도 확인 없이 이동을 허용
    if (!hasUnsavedInput) {
      return true;
    }
    // 사용자가 확인을 눌렀을 때만 날짜·인원 변경 페이지로 이동합니다.
    return window.confirm("입력한 예약 정보가 사라져요. \n날짜와 인원을 변경하시겠어요?");
  };

  // 결제수단을 변경하면 이전에 표시된 안내 메시지를 초기화
  const handlePaymentMethodChange = (method: BookingPaymentMethod) => {
    setPaymentMethod(method);
    setPaymentNotice(null);
  };

  // 결제 API를 호출하지 않고 준비 중이라는 안내판 표시
  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      return;
    }
    setPaymentNotice("결제 연동 준비 중. 현재는 실제 결제가 진행되지 않습니다.");
  };

  return (
    <div className="space-y-12">
      {/* 현재 예약 진행 단계 표시*/}
      <BookingProgress
        currentStep={currentStep}
        // 기존처럼 '날짜·인원 선택'을 클릭하면 이전 화면으로 이동
        stepHrefs={{ 1: selection.editHref }}
        // 입력한 정보가 있다면 이동 전에 확인창 표시
        onBeforeNavigate={handleBeforeEdit}
      />
      {/* 현재 단계가 2이면 예약 정보를 입력하고, 3이면 결제 확인 화면 보여줌 */}
      {currentStep === 2 ? (
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
              // 날짜·인원 변경 전 상위 Template에서 확인합니다.
              onBeforeEdit={handleBeforeEdit}
            />

            <div className="rounded-lg bg-subtle p-6">
              <h2 className="font-bold text-ink">개인정보는 안전하게 보호됩니다.</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                입력한 정보는 예약 진행과 사찰 안내를 위해 사용되며, 예약 내역에서 확인할 수
                있습니다.
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
      ) : (
        /* 3단계: 예약 정보 및 결제 확인 */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          {/* 왼쪽: 예약 정보와 결제수단 */}
          <div className="min-w-0 space-y-8">
            <BookingReview
              booker={booker}
              participants={effectiveParticipants}
              sameAsBooker={isLinked}
            />

            <PaymentMethodSelector value={paymentMethod} onChange={handlePaymentMethodChange} />

            {/* 수정이 필요하면 2단계로 돌아갑니다. */}
            <button
              type="button"
              onClick={handleBackToInfo}
              className="rounded-full border border-border px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-subtle"
            >
              예약 정보 입력으로 돌아가기
            </button>
          </div>

          {/* 오른쪽: 결제 금액과 결제 버튼 */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <PaymentSummary
              selection={selection}
              paymentMethod={paymentMethod}
              onSubmit={handlePaymentSubmit}
              noticeMessage={paymentNotice}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
