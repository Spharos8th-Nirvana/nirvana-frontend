import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { reviews } from "@/features/guide/data/mock-screens";
import ReviewList from "@/features/community/components/organisms/ReviewList";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default function ReviewsPage() {
  return (
    <PreviewPage title="체험 후기" description="직접 다녀온 분들의 이야기를 들어 보세요." image="/images/photo-84d4d4aa801678ba.jpg">
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/community/reviews" />
      <ReviewList examples={reviews} />
    </PreviewPage>
  );
}
