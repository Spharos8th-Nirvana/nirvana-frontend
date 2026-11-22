"use client";

import { useState } from "react";
import ReservationCalendar from "@/components/features/programs/reservation-calendar";

type ReservationPanelProps = {
  price: number;
};

export default function ReservationPanel({ price }: ReservationPanelProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [minorCount, setMinorCount] = useState(0);

  const totalCount = adultCount + minorCount;

  return (
    <div className="sticky top-28 self-start border border-[#EAEAE5] bg-white p-6">
      <h2 className="text-xl font-bold text-[#173F35]">예약하기</h2>

      <p className="mt-3 text-sm text-[#777777]">원하는 날짜와 인원을 선택해 주세요.</p>

      {/* 날짜 선택 */}
      <div className="mt-6 border border-[#EAEAE5] p-4">
        <ReservationCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* 인원 선택 */}
      <div className="mt-6 border-t border-[#EAEAE5] pt-5">
        <h3 className="mb-4 font-semibold text-[#173F35]">참가 인원</h3>

        {/* 성인 */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-[#333A35]">성인</p>
            <p className="mt-1 text-xs text-[#999999]">만 19세 이상</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAdultCount((count) => Math.max(0, count - 1))}
              disabled={adultCount === 0}
              className="h-8 w-8 border border-[#EAEAE5] text-[#173F35] transition hover:bg-[#F5F5F3] disabled:opacity-30"
            >
              -
            </button>

            <span className="w-5 text-center font-semibold text-[#333A35]">{adultCount}</span>

            <button
              type="button"
              onClick={() => setAdultCount((count) => count + 1)}
              className="h-8 w-8 border border-[#EAEAE5] text-[#173F35] transition hover:bg-[#F5F5F3]"
            >
              +
            </button>
          </div>
        </div>

        {/* 미성년자 */}
        <div className="flex items-center justify-between border-t border-[#EAEAE5] py-3">
          <div>
            <p className="font-medium text-[#333A35]">미성년자</p>
            <p className="mt-1 text-xs text-[#999999]">만 19세 미만</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMinorCount((count) => Math.max(0, count - 1))}
              disabled={minorCount === 0}
              className="h-8 w-8 border border-[#EAEAE5] text-[#173F35] transition hover:bg-[#F5F5F3] disabled:opacity-30"
            >
              -
            </button>

            <span className="w-5 text-center font-semibold text-[#333A35]">{minorCount}</span>

            <button
              type="button"
              onClick={() => setMinorCount((count) => count + 1)}
              className="h-8 w-8 border border-[#EAEAE5] text-[#173F35] transition hover:bg-[#F5F5F3]"
            >
              +
            </button>
          </div>
        </div>

        {/* 총 참가 인원 */}
        <div className="mt-3 flex items-center justify-between border-y border-[#EAEAE5] py-3 text-sm">
          <span className="text-[#777777]">총 참가 인원</span>
          <span className="font-semibold text-[#173F35]">{totalCount}명</span>
        </div>
      </div>

      {/* 선택한 날짜 */}
      <div className="mt-6 border-t border-[#EAEAE5] pt-5">
        <p className="text-sm font-semibold text-[#173F35]">선택한 날짜</p>
        <p className="mt-2 text-sm text-[#777777]">{selectedDate || "날짜를 선택해 주세요."}</p>
      </div>

      {/* 참가 비용 */}
      <div className="mt-6 border-t border-[#EAEAE5] pt-5">
        <p className="text-sm text-[#777777]">기본 참가 비용</p>
        <p className="mt-2 text-xl font-bold text-[#173F35]">₩{price.toLocaleString("ko-KR")}</p>
        <p className="mt-1 text-xs text-[#999999]">성인·미성년자별 요금은 추후 연결 예정입니다.</p>
      </div>

      {/* 예약 버튼 */}
      <button
        type="button"
        disabled={!selectedDate || totalCount === 0}
        className="mt-6 w-full bg-[#173F35] py-4 font-semibold text-white transition hover:bg-[#102F28] disabled:cursor-not-allowed disabled:opacity-40"
      >
        예약하기
      </button>
    </div>
  );
}
