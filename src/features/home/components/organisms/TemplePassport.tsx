"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  bookingRecordsSnapshot,
  parseBookingRecords,
  pendingPaymentServerSnapshot,
  subscribePendingPayment,
} from "@/features/booking/utils/pending-payment";
import { previewTemples } from "@/features/guide/data/mock-screens";

function useCompletedTemples() {
  const raw = useSyncExternalStore(subscribePendingPayment, bookingRecordsSnapshot, pendingPaymentServerSnapshot);
  const names = new Set(
    parseBookingRecords(raw)
      .filter((item) => item.status === "이용 완료")
      .map((item) => item.templeName),
  );
  return previewTemples.filter((temple) => names.has(temple.name));
}

/** 시안 미니 패스포트. 이용 완료 사찰 도장을 보여 줍니다. */
export function TemplePassport() {
  const done = useCompletedTemples();
  const marks = [0, 1, 2, 3, 4].map((index) => done[index]);

  return (
    <section className="bg-background px-4 sm:px-6 md:px-10" aria-label="미니 패스포트">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 rounded-[18px] bg-gradient-to-r from-primary to-[#2a4636] px-5 py-4 text-white sm:flex-row sm:items-center sm:gap-6 sm:px-7">
        <div className="min-w-0 flex-1">
          <b className="text-base">나의 사찰 패스포트</b>
          <br />
          <span className="text-[13px] text-white/75">
            {done.length ? `지금까지 ${done.length}곳의 사찰 도장을 모았어요.` : "아직 모은 도장이 없어요. 체험을 마치면 도장이 찍혀요."}
          </span>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {marks.map((temple, index) => (
            <span
              key={index}
              className={
                temple
                  ? "grid h-11 w-11 place-items-center rounded-full border-2 border-action text-xs font-bold text-action"
                  : "grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-action/45 text-xs font-bold text-white/55"
              }
            >
              {temple ? temple.name.slice(0, 2) : "?"}
            </span>
          ))}
        </div>
        <Link href="/mypage/passport" className="inline-flex shrink-0 items-center justify-center rounded-full bg-action px-5 py-2.5 text-sm font-bold text-primary">
          패스포트 보기
        </Link>
      </div>
    </section>
  );
}

/** 마이페이지 패스포트 도장판 */
export function PassportBoard() {
  const done = useCompletedTemples();
  const got = new Set(done.map((temple) => temple.id));

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {previewTemples.map((temple) => {
        const stamped = got.has(temple.id);
        return (
          <div key={temple.id} className="rounded-2xl border border-dashed border-border bg-white p-4 text-center">
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full border-2 text-lg ${stamped ? "border-primary text-primary" : "border-dashed text-muted"}`}>
              {stamped ? temple.name.slice(0, 1) : "?"}
            </span>
            <b className="mt-3 block">{temple.name}</b>
            <small className="text-muted">{stamped ? "도장 받음" : "아직 없음"}</small>
          </div>
        );
      })}
    </div>
  );
}
