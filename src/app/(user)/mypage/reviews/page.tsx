import type { Metadata } from "next";
import ReviewManageTemplate from "@/features/review/components/templates/ReviewManageTemplate";
import { getMyReviews, getWritableEligibilities } from "@/features/review/api/review-api";

export const metadata: Metadata = {
  title: "후기 관리",
};

/** 마이페이지 후기 관리 (임시 데이터, 후기 API 연결 후 서버에서 조회) */
export default async function ReviewManagePage() {
  const [eligibilities, reviews] = await Promise.all([getWritableEligibilities(), getMyReviews()]);

  return <ReviewManageTemplate eligibilities={eligibilities} reviews={reviews} />;
}
