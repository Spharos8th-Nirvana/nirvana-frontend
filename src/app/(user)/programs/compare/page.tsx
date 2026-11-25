import ProgramCompareTable from "@/features/program/components/organisms/ProgramCompareTable";
import PageHero from "@/shared/components/layout/PageHero";

export default function ProgramComparePage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="프로그램 비교"
        description="담아 둔 프로그램을 나란히 살펴보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />
      <section className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10">
        <ProgramCompareTable />
      </section>
    </main>
  );
}
