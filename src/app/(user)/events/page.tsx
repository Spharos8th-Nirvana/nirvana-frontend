import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { EventList } from "@/features/community/components/organisms/EventList";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default function EventsPage() {
  return (
    <PreviewPage title="이벤트" description="계절마다 열리는 특별한 템플스테이를 만나 보세요." image="/images/photo-19aa895269a397a6.jpg">
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/events" />
      <EventList />
    </PreviewPage>
  );
}
