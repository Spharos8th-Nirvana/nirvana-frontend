import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { ClubList } from "@/features/community/components/organisms/ClubList";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default function ClubsPage() {
  return (
    <PreviewPage title="동호회" description="같은 관심사를 가진 사람들과 사찰 체험 이야기를 나눠요." image="/images/photo-1f2cd05c6f795126.jpg">
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/community/clubs" />
      <ClubList />
    </PreviewPage>
  );
}
