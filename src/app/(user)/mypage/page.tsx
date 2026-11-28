import type { Metadata } from "next";
import MyBookingsTemplate from "@/features/booking/components/templates/MyBookingsTemplate";
import { myBookings } from "@/features/booking/data/my-bookings";

export const metadata: Metadata = {
  title: "예약 내역",
};

type MyPageBookingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * 마이페이지 기본 화면: 예약 내역 (임시 데이터, 예약 API 연결 후 서버에서 조회)
 * 주소에 ?booking=예약번호가 있으면 그 예약의 상세 패널을 연 채로 보여 줍니다. (후기 작성에서 돌아올 때)
 */
export default async function MyPageBookingsPage({ searchParams }: MyPageBookingsPageProps) {
  const { booking } = await searchParams;

  return (
    <MyBookingsTemplate
      bookings={myBookings}
      initialBookingUuid={typeof booking === "string" ? booking : undefined}
    />
  );
}
