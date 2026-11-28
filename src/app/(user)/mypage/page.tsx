import type { Metadata } from "next";
import MyBookingsTemplate from "@/features/booking/components/templates/MyBookingsTemplate";
import { myBookings } from "@/features/booking/data/my-bookings";

export const metadata: Metadata = {
  title: "예약 내역",
};

/** 마이페이지 기본 화면: 예약 내역 (임시 데이터, 예약 API 연결 후 서버에서 조회) */
export default function MyPageBookingsPage() {
  return <MyBookingsTemplate bookings={myBookings} />;
}
