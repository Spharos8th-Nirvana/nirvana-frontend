"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingProgress from "@/features/booking/components/organisms/BookingProgress";
import {
  bookingRecordsSnapshot,
  expireDuePayments,
  findBooking,
  isPaymentExpired,
  parseBookingRecords,
  parsePendingPayment,
  pendingPaymentServerSnapshot,
  pendingPaymentSnapshot,
  readPendingPayment,
  subscribePendingPayment,
  writePendingPayment,
} from "@/features/booking/utils/pending-payment";
import { pushNotice } from "@/features/guide/utils/preview-notices";
import {
  previewLoginServerSnapshot,
  previewLoginSnapshot,
  safeNextPath,
  subscribePreviewLogin,
} from "@/features/guide/utils/preview-login";

const methods = ["신용·체크카드", "계좌이체", "간편결제"];

function leftText(expiresAt: number) {
  const seconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

/** 시안 결제 화면. 실제 결제는 일어나지 않습니다. */
export default function BookingPayTemplate({ programId }: { programId: number }) {
  const router = useRouter();
  const loggedIn = useSyncExternalStore(subscribePreviewLogin, previewLoginSnapshot, previewLoginServerSnapshot) === "1";
  const raw = useSyncExternalStore(subscribePendingPayment, pendingPaymentSnapshot, pendingPaymentServerSnapshot);
  const payment = parsePendingPayment(raw, programId);
  const [method, setMethod] = useState("");
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [agreeShare, setAgreeShare] = useState(false);
  const [failTest, setFailTest] = useState(false);
  const [error, setError] = useState("");
  const [failed, setFailed] = useState(false);
  const [timer, setTimer] = useState("");

  useEffect(() => {
    if (loggedIn) {
      return;
    }
    const next = safeNextPath(`/programs/${programId}/booking/pay`);
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [loggedIn, programId, router]);

  useEffect(() => {
    const current = parsePendingPayment(raw, programId);
    if (current?.status === "예약 확정") {
      router.replace(`/programs/${programId}/booking/complete`);
    }
  }, [raw, programId, router]);

  useEffect(() => {
    const current = parsePendingPayment(raw, programId);
    if (!current || current.status !== "결제대기") {
      return;
    }
    const tick = () => {
      const now = Date.now();
      if (isPaymentExpired(current, now)) {
        expireDuePayments(now);
        return;
      }
      setTimer(leftText(current.expiresAt));
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [raw, programId]);

  if (!loggedIn) {
    return null;
  }

  if (!payment || (payment.status !== "결제대기" && payment.status !== "만료" && payment.status !== "예약 확정")) {
    return (
      <div className="bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-ink">결제할 예약이 없어요.</p>
        <Link href="/mypage" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
          예약 내역 보기
        </Link>
      </div>
    );
  }

  if (payment.status === "만료") {
    return (
      <div className="bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-ink">결제 시간이 지나 예약이 만료됐어요.</p>
        <p className="mt-2 text-sm text-muted">좌석이 다른 분께 돌아갔어요. 다시 예약해 주세요.</p>
        <Link href={`/programs/${programId}`} className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
          프로그램으로 돌아가기
        </Link>
      </div>
    );
  }

  if (payment.status === "예약 확정") {
    return null;
  }

  const pay = () => {
    const pending = readPendingPayment();
    const current = findBooking(parseBookingRecords(bookingRecordsSnapshot()), payment.id);
    if (pending?.id !== payment.id || current?.programId !== programId || current.status !== "결제대기") {
      setError("지금 결제할 수 없는 예약입니다.");
      return;
    }
    if (isPaymentExpired(current)) {
      expireDuePayments();
      return;
    }
    if (!Number.isSafeInteger(current.expiresAt) || current.expiresAt <= 0) {
      setError("예약의 결제 시간을 확인할 수 없어요. 다시 예약해 주세요.");
      return;
    }
    if (!agreeRefund || !agreeShare) {
      setError("필수 동의 2개에 체크해 주세요.");
      return;
    }
    if (!method) {
      setError("결제 수단을 골라 주세요.");
      return;
    }
    if (failTest) {
      setFailed(true);
      setError("");
      return;
    }
    const next = {
      ...current,
      status: "예약 확정" as const,
      method,
      paidAt: new Date().toLocaleString("ko-KR"),
      history: [
        ...(current.history ?? []),
        { at: new Date().toLocaleString("ko-KR"), status: "예약 확정" as const, by: "결제 서비스", reason: `결제 완료 (${method})` },
      ],
    };
    writePendingPayment(next);
    pushNotice(`결제가 끝나 예약이 확정됐어요 · ${payment.programName} (${payment.scheduleLabel})`, `/mypage/bookings/${payment.id}`);
    router.push(`/programs/${programId}/booking/complete`);
  };

  const won = `${payment.totalPrice.toLocaleString("ko-KR")}원`;

  return (
    <div>
      <BookingProgress currentStep={3} />
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8 bg-white p-6">
          <section>
            <h2 className="text-lg font-bold text-ink">남은 결제 시간 {timer || leftText(payment.expiresAt)}</h2>
            <p className="mt-2 text-sm text-muted">이 시간이 지나면 예약이 ‘만료’되고 잡아 둔 좌석이 돌아가요.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-ink">동의</h2>
            <label className="mt-4 flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" checked={agreeRefund} onChange={(event) => setAgreeRefund(event.target.checked)} />
              [필수] 취소·환불 규정을 확인했어요
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" checked={agreeShare} onChange={(event) => setAgreeShare(event.target.checked)} />
              [필수] 예약 정보를 사찰에 전달하는 것에 동의해요
            </label>
          </section>
          <section>
            <h2 className="text-lg font-bold text-ink">결제 수단</h2>
            <div className="mt-4 space-y-2" role="radiogroup" aria-label="결제 수단">
              {methods.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="pay"
                    value={item}
                    checked={method === item}
                    onChange={() => setMethod(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">시안이라 실제 결제는 일어나지 않아요.</p>
          </section>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={failTest} onChange={(event) => setFailTest(event.target.checked)} />
            결제 실패로 시험하기 (시안용)
          </label>
          {error && (
            <p role="alert" className="text-sm font-semibold text-primary">
              {error}
            </p>
          )}
          {failed && (
            <div className="border border-border bg-subtle p-4 text-sm">
              <p className="font-bold text-ink">결제가 실패했어요 (시안: 카드 승인 거절)</p>
              <p className="mt-2 text-muted">좌석은 남은 시간 동안 그대로 잡혀 있어요. 다시 시도하거나, 나중에 마이페이지에서 이어서 결제할 수 있어요.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={pay} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
              {won} 결제하기
            </button>
            <Link href="/mypage" className="rounded-full border border-border px-5 py-3 text-sm font-bold text-ink">
              나중에 결제하기
            </Link>
          </div>
        </div>
        <aside className="h-fit bg-white p-6">
          <h2 className="font-bold text-ink">결제할 예약</h2>
          <p className="mt-4 font-bold text-ink">{payment.programName}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">예약번호</dt><dd>{payment.reservationNo}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">날짜</dt><dd>{payment.scheduleLabel}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">인원</dt><dd>{payment.peopleLabel}</dd></div>
          </dl>
          <p className="mt-4 text-sm text-muted">결제 금액</p>
          <p className="text-2xl font-bold text-ink">{won}</p>
        </aside>
      </div>
    </div>
  );
}
