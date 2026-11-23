import PageHero from "@/shared/components/layout/PageHero";
import CommunityNavigation from "@/features/community/components/molecules/CommunityNavigation";
import CommunityNoticeList from "@/features/community/components/organisms/CommunityNoticeList";
import { communityNotices } from "@/features/community/data/community-notices";
import { sortCommunityNotices } from "@/features/community/utils/sort-notices";

export default function CommunityNoticesPage() {
  const sortedNotices = sortCommunityNotices(communityNotices);

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="공지사항"
        description="너바나의 새로운 소식과 중요한 안내를 확인하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <CommunityNavigation activePage="notices" />

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-ink">공지사항</h1>
          <p className="mt-3 text-sm text-muted">너바나의 소식과 중요한 안내를 확인해 보세요.</p>
        </div>
        <CommunityNoticeList notices={sortedNotices} />
      </section>
    </main>
  );
}
