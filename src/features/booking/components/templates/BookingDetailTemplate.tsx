"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  bookingRecordsSnapshot,
  findBooking,
  parseBookingRecords,
  pendingPaymentServerSnapshot,
  subscribePendingPayment,
  writePendingPayment,
  type BookingStatus,
  type PendingPayment,
} from "@/features/booking/utils/pending-payment";
import { pushNotice } from "@/features/guide/utils/preview-notices";
import {
  previewLoginServerSnapshot,
  previewLoginSnapshot,
  safeNextPath,
  subscribePreviewLogin,
} from "@/features/guide/utils/preview-login";

const policy = [
  ["이용일 7일 전까지", "100%"],
  ["이용일 2일 전까지", "50%"],
  ["이용 당일", "환불 없음"],
];

function daysUntil(start: string) {
  const target = new Date(`${start}T00:00:00`).getTime();
  return Math.round((target - Date.now()) / 86400000);
}

/** 시안 예약 상세. 이름·연락처는 저장하지 않습니다. */
export default function BookingDetailTemplate({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const loggedIn = useSyncExternalStore(subscribePreviewLogin, previewLoginSnapshot, previewLoginServerSnapshot) === "1";
  const raw = useSyncExternalStore(subscribePendingPayment, bookingRecordsSnapshot, pendingPaymentServerSnapshot);
  const booking = findBooking(parseBookingRecords(raw), bookingId);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      return;
    }
    const next = safeNextPath(`/mypage/bookings/${bookingId}`);
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [loggedIn, bookingId, router]);

  if (!loggedIn) {
    return null;
  }

  if (!booking) {
    return <p className="font-bold text-ink">예약을 찾을 수 없어요.</p>;
  }

  const paid = Boolean(booking.method);
  const refundPreview = paid
    ? (() => {
        const days = daysUntil(booking.scheduleStart);
        const rate = days >= 7 ? 100 : days >= 2 ? 50 : 0;
        return { days, rate, money: Math.round(booking.totalPrice * rate / 100) };
      })()
    : null;

  const cancel = () => {
    const rate = refundPreview?.rate ?? 0;
    const money = refundPreview?.money ?? 0;
    const next: PendingPayment = {
      ...booking,
      status: "취소 완료",
      refund: {
        rate,
        money,
        status: paid ? "환불 처리 중" : "결제 전 취소",
        by: "회원",
        reason: paid ? "회원 취소" : "결제 전 취소",
      },
      history: [
        ...(booking.history ?? []),
        {
          at: new Date().toLocaleString("ko-KR"),
          status: "취소 완료",
          by: "회원",
          reason: paid ? `회원 취소 · 환불 ${rate}%` : "결제 전 취소",
        },
      ],
    };
    writePendingPayment(next);
    setCanceling(false);
  };

  const changeStatus = (status: BookingStatus, by: string, reason: string) => {
    const next: PendingPayment = {
      ...booking,
      status,
      history: [...(booking.history ?? []), { at: new Date().toLocaleString("ko-KR"), status, by, reason }],
    };
    writePendingPayment(next);
    if (status === "이용 완료") {
      pushNotice(`체험은 어떠셨나요? ${booking.programName} 후기를 남겨 주세요.`, "/community/write");
    }
  };

  const won = `${booking.totalPrice.toLocaleString("ko-KR")}원`;

  return (
    <div className="space-y-8">
      <section className="bg-white p-6">
        <p className="text-sm font-bold text-primary">{booking.status}</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{booking.programName}</h2>
        <p className="mt-2 text-sm text-muted">예약번호 {booking.reservationNo} · {booking.templeName}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {booking.status === "결제대기" ? (
            <Link href={`/programs/${booking.programId}/booking/pay`} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
              이어서 결제
            </Link>
          ) : null}
          {booking.status === "결제대기" || booking.status === "예약 확정" ? (
            <button type="button" onClick={() => setCanceling(true)} className="rounded-full border border-border px-4 py-2 text-sm font-bold">
              예약 취소
            </button>
          ) : null}
          {booking.status === "만료" ? (
            <Link href={`/programs/${booking.programId}`} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
              다시 예약하기
            </Link>
          ) : null}
        </div>
        {canceling ? (
          <div className="mt-4 border border-border bg-subtle p-4 text-sm">
            <p className="font-bold text-ink">정말 취소할까요?</p>
            <p className="mt-2 text-muted">
              {paid && refundPreview
                ? `이용일까지 ${refundPreview.days}일 남아서 환불 비율은 ${refundPreview.rate}%, 돌려받는 금액은 ${refundPreview.money.toLocaleString("ko-KR")}원이에요.`
                : "아직 결제 전이라 환불할 금액이 없어요. 잡아 둔 좌석이 바로 돌아가요."}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={cancel} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">취소하기</button>
              <button type="button" onClick={() => setCanceling(false)} className="rounded-full border px-4 py-2 text-sm">그만두기</button>
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <b className="w-full text-sm">시안용 시험 버튼</b>
          {booking.status === "결제대기" ? (
            <button type="button" className="rounded-full border px-3 py-1" onClick={() => changeStatus("만료", "시스템", "결제 시간이 지나 좌석 반환")}>시간 지나게 하기</button>
          ) : null}
          {booking.status === "예약 확정" ? (
            <>
              <button type="button" className="rounded-full border px-3 py-1" onClick={() => changeStatus("이용 완료", "사찰", "체험 참여 확인")}>이용 완료로 바꾸기</button>
              <button type="button" className="rounded-full border px-3 py-1" onClick={() => changeStatus("노쇼", "사찰", "체험 당일 불참")}>노쇼로 바꾸기</button>
              <button
                type="button"
                className="rounded-full border px-3 py-1"
                onClick={() => {
                  const next: PendingPayment = {
                    ...booking,
                    status: "취소 완료",
                    refund: { rate: 100, money: booking.totalPrice, status: "환불 처리 중", by: "사찰", reason: "사찰 사정(기상 악화) · 전액 환불" },
                    history: [...(booking.history ?? []), { at: new Date().toLocaleString("ko-KR"), status: "취소 완료", by: "사찰", reason: "사찰 사정(기상 악화) · 전액 환불" }],
                  };
                  writePendingPayment(next);
                  pushNotice(`사찰 사정으로 예약이 취소됐어요 · ${booking.programName} · 환불 ${booking.totalPrice.toLocaleString("ko-KR")}원`, `/mypage/bookings/${booking.id}`);
                }}
              >
                사찰 사정으로 취소
              </button>
            </>
          ) : null}
          {booking.refund?.status === "환불 처리 중" ? (
            <>
              <button type="button" className="rounded-full border px-3 py-1" onClick={() => writePendingPayment({ ...booking, refund: { ...booking.refund!, status: "환불 완료" } })}>환불 완료로 바꾸기</button>
              <button type="button" className="rounded-full border px-3 py-1" onClick={() => writePendingPayment({ ...booking, refund: { ...booking.refund!, status: "환불 실패 · 고객센터 확인 중" } })}>환불 실패로 바꾸기</button>
            </>
          ) : null}
        </div>
      </section>

      <section className="bg-white p-6">
        <h3 className="font-bold text-ink">예약 정보</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">프로그램</dt><dd><Link href={`/programs/${booking.programId}`} className="font-bold text-primary">{booking.programName}</Link></dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">사찰</dt><dd>{booking.templeName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">일정</dt><dd>{booking.scheduleLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">인원</dt><dd>{booking.peopleLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">요청 사항</dt><dd>없음</dd></div>
        </dl>
      </section>

      <section className="bg-white p-6">
        <h3 className="font-bold text-ink">결제 · 환불</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">결제</dt><dd>{paid ? `${booking.method} · ${won} · 결제 완료 (${booking.paidAt})` : "결제 전"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">환불</dt><dd>{booking.refund ? `${booking.refund.rate}% · ${booking.refund.money.toLocaleString("ko-KR")}원 · ${booking.refund.status}` : "없음"}</dd></div>
        </dl>
      </section>

      <section className="bg-white p-6">
        <h3 className="font-bold text-ink">이 예약의 취소 규정</h3>
        <table className="mt-3 w-full text-left text-sm">
          <thead><tr><th className="py-2">취소 시점</th><th>환불 비율</th></tr></thead>
          <tbody>
            {policy.map((row) => (
              <tr key={row[0]} className="border-t border-border"><td className="py-2">{row[0]}</td><td>{row[1]}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6">
        <h3 className="font-bold text-ink">상태 변경 이력</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {(booking.history ?? []).slice().reverse().map((item) => (
            <li key={`${item.at}-${item.reason}`}>{item.at} · {item.status} · {item.by} · {item.reason}</li>
          ))}
        </ul>
      </section>

      <Link href="/mypage" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold">‹ 예약 내역으로</Link>
    </div>
  );
}
