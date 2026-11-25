import ClubPostScreen from "@/features/community/components/templates/ClubPostScreen";
import PageHero from "@/shared/components/layout/PageHero";

export default async function ClubPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="동호회 게시글"
        description="동호회에서 나눈 이야기예요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />
      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        <ClubPostScreen id={Number(id)} />
      </section>
    </main>
  );
}
