import { notFound } from "next/navigation";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { reviews } from "@/features/guide/data/mock-screens";
import ReviewDetail from "@/features/community/components/organisms/ReviewDetail";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const example = reviews.find((item) => String(item.id) === id);
  const localId = /^local-([1-9]\d*)$/.exec(id);
  const reservationId = localId ? Number(localId[1]) : undefined;
  if (!example && (reservationId === undefined || !Number.isSafeInteger(reservationId))) {
    notFound();
  }

  return (
    <ReviewDetail example={example} reservationId={reservationId}>
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/community/reviews" />
    </ReviewDetail>
  );
}
