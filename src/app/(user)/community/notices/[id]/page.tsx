import Link from "next/link";
import PageHero from "@/shared/components/layout/page-hero";
import { communityNotices } from "@/features/community/data/community-notices";
import { sortCommunityNotices } from "@/features/community/utils/sort-notices";

type NoticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const sortedNotices = sortCommunityNotices(communityNotices);
  const currentIndex = sortedNotices.findIndex((item) => item.id === Number(id));
  const notice = sortedNotices[currentIndex];
  const previousNotice = sortedNotices[currentIndex + 1];
  const nextNotice = sortedNotices[currentIndex - 1];

  if (!notice) {
    return (
      <main className="min-h-screen bg-background">
        <PageHero
          title="공지사항"
          description="너바나의 새로운 소식과 중요한 안내를 확인하세요."
          image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
        />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-muted">공지사항을 찾을 수 없습니다.</p>
          <Link
            href="/community/notices"
            className="mt-6 inline-block text-primary hover:underline"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="공지사항"
        description="너바나의 새로운 소식과 중요한 안내를 확인하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <section className="border-y border-border py-8">
          <h1 className="text-2xl font-semibold text-ink">{notice.title}</h1>
          <div className="mt-4 flex gap-6 text-sm text-muted">
            <span>관리자</span>
            <span>{notice.createdAt}</span>
            <span>조회수 {notice.views}</span>
          </div>
        </section>

        <section
          className="min-h-80 border-b border-border py-10 text-ink"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />

        <section className="mt-8 divide-y divide-border border-y border-border">
          <div className="flex items-center gap-6 py-5 text-sm">
            <span className="w-16 shrink-0 text-muted">다음 글</span>
            {nextNotice ? (
              <Link
                href={`/community/notices/${nextNotice.id}`}
                className="text-ink hover:text-primary"
              >
                {nextNotice.title}
              </Link>
            ) : (
              <span className="text-muted">다음 글이 없습니다.</span>
            )}
          </div>

          <div className="flex items-center gap-6 py-5 text-sm">
            <span className="w-16 shrink-0 text-muted">이전 글</span>
            {previousNotice ? (
              <Link
                href={`/community/notices/${previousNotice.id}`}
                className="text-ink hover:text-primary"
              >
                {previousNotice.title}
              </Link>
            ) : (
              <span className="text-muted">이전 글이 없습니다.</span>
            )}
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Link
            href="/community/notices"
            className="border border-border px-6 py-3 text-sm hover:bg-surface"
          >
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
