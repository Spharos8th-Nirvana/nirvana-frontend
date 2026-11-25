import { notFound } from "next/navigation";
import ClubPostTemplate from "@/features/community/components/templates/ClubPostTemplate";
import { clubPosts } from "@/features/community/data/club-posts";
import PageHero from "@/shared/components/layout/PageHero";

export default async function ClubPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = clubPosts.find((item) => item.id === Number(id));
  if (!post) {
    notFound();
  }

  const sameClub = clubPosts
    .filter((item) => item.clubId === post.clubId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const index = sameClub.findIndex((item) => item.id === post.id);

  return (
    <main className="min-h-screen bg-background">
      <PageHero title={post.clubName} description="동호회 게시글" image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg" />
      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        <ClubPostTemplate post={post} previous={sameClub[index + 1] ?? null} next={sameClub[index - 1] ?? null} />
      </section>
    </main>
  );
}
