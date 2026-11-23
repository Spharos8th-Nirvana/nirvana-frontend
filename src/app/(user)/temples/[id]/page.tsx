import { notFound } from "next/navigation";
import { temples } from "@/features/temple/data/temples";
import PageHero from "@/shared/components/layout/PageHero";
import TempleImageSlider from "@/features/temple/components/organisms/TempleImageSlider";
import TempleDetailTabs from "@/features/temple/components/organisms/TempleDetailTabs";
import { templeFacilities } from "@/features/temple/data/temple-facilities";
import { programs } from "@/features/program/data/programs";
import { templeReviews } from "@/features/temple/data/temple-reviews";
import { templeNotices } from "@/features/temple/data/temple-notices";

type TempleDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function TempleDetailPage({
  params,
  searchParams,
}: TempleDetailPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  const temple = temples.find((item) => item.id === Number(id));

  if (!temple) {
    notFound();
  }
  const facilities = templeFacilities.filter(
    (facility) => facility.templeId === temple.id,
  );
  const templePrograms = programs.filter(
    (program) => program.templeId === temple.id,
  );
  const reviews = templeReviews.filter(
    (review) => review.templeId === temple.id,
  );
  const notices = templeNotices.filter(
    (notice) => notice.templeId === temple.id,
  );

  return (
    <main className="min-h-screen bg-[bg-background]">
      <PageHero
        title={temple.name}
        description={temple.description}
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        <TempleImageSlider templeName={temple.name} />

        <TempleDetailTabs
          templeId={temple.id}
          initialTab={tab}
          templeName={temple.name}
          address={temple.address}
          phone={temple.phone}
          introduction={temple.introduction}
          directions={temple.directions}
          facilities={facilities}
          programs={templePrograms}
          reviews={reviews}
          notices={notices}
        />
      </section>
    </main>
  );
}
