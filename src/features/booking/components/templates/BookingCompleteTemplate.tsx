"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import BookingProgress from "@/features/booking/components/organisms/BookingProgress";
import {
  parsePendingPayment,
  pendingPaymentServerSnapshot,
  pendingPaymentSnapshot,
  subscribePendingPayment,
} from "@/features/booking/utils/pending-payment";

/** 시안 예약 완료 화면. 예약번호와 이동 버튼만 보여 줍니다. */
export default function BookingCompleteTemplate({ programId }: { programId: number }) {
  const raw = useSyncExternalStore(subscribePendingPayment, pendingPaymentSnapshot, pendingPaymentServerSnapshot);
  const payment = parsePendingPayment(raw, programId);
  const confirmed = payment?.status === "예약 확정" ? payment : null;

  if (!confirmed) {
    return (
      <div className="bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-ink">확정된 예약이 없어요.</p>
        <Link href={`/programs/${programId}`} className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
          프로그램으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <BookingProgress currentStep={4} />
      <div className="mt-10 bg-white px-6 py-12 text-center">
        <p className="text-3xl text-primary" aria-hidden="true">✓</p>
        <h2 className="mt-3 text-2xl font-bold text-ink">예약이 확정됐어요</h2>
        <p className="mt-2 text-sm text-muted">확정 안내는 알림으로도 보내 드렸어요. 사찰이 확정된 예약을 확인해요.</p>
        <dl className="mx-auto mt-8 max-w-lg space-y-3 text-left text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">예약번호</dt><dd className="font-bold text-ink">{confirmed.reservationNo}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">상태</dt><dd>예약 확정</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">프로그램</dt><dd>{confirmed.programName} · {confirmed.templeName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">날짜</dt><dd>{confirmed.scheduleLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">인원</dt><dd>{confirmed.peopleLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">결제</dt><dd>{confirmed.totalPrice.toLocaleString("ko-KR")}원 · {confirmed.method}</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/mypage" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">내 예약</Link>
          <Link href="/mypage/passport" className="rounded-full border border-border px-5 py-3 text-sm font-bold text-ink">사찰 패스포트</Link>
          <Link href="/programs" className="rounded-full border border-border px-5 py-3 text-sm font-bold text-ink">다른 프로그램 보기</Link>
          <Link href="/" className="rounded-full border border-border px-5 py-3 text-sm font-bold text-ink">홈으로</Link>
        </div>
      </div>
    </div>
  );
}
