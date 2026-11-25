import CommunityWriteForm from "@/features/community/components/organisms/CommunityWriteForm";
import PageHero from "@/shared/components/layout/PageHero";

export default function CommunityWritePage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="글쓰기"
        description="체험 후기와 동호회 이야기를 남겨 보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />
      <section className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10">
        <CommunityWriteForm />
      </section>
    </main>
  );
}
