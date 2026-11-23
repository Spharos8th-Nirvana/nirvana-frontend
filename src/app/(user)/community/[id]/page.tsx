import Link from "next/link";
import PageHero from "@/shared/components/layout/PageHero";
import { communityPosts } from "@/features/community/data/community-posts";
import { sanitizeContentHtml } from "@/lib/sanitize-html";
import CommunityPostEngagement from "@/features/community/components/organisms/CommunityPostEngagement";

type CommunityPostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityPostDetailPage({ params }: CommunityPostDetailPageProps) {
  const { id } = await params;
  const post = communityPosts.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <PageHero
          title="커뮤니티"
          description="너바나에서 다양한 경험과 이야기를 나눠보세요."
          image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
        />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-muted">게시글을 찾을 수 없습니다.</p>
          <Link href="/community" className="mt-6 inline-block text-primary hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="커뮤니티"
        description="너바나에서 다양한 경험과 이야기를 나눠보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <section className="border-y border-border py-8">
          <div className="mb-4 text-sm text-primary">{post.category}</div>
          <h1 className="text-2xl font-semibold text-ink">{post.title}</h1>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-muted">
            <span>{post.nickname}</span>
            <span>{post.createdAt}</span>
            <span>조회수 {post.views}</span>
          </div>
        </section>

        <section
          className="min-h-80 border-b border-border py-10 leading-8 text-ink [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizeContentHtml(post.content) }}
        />

        <CommunityPostEngagement postId={post.id} initialLikeCount={post.likes} />

        <div className="mt-8 flex justify-end">
          <Link href="/community" className="border border-border px-6 py-3 text-sm hover:bg-surface">
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
