import BookingDetailTemplate from "@/features/booking/components/templates/BookingDetailTemplate";
import PageHero from "@/shared/components/layout/PageHero";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="예약 상세"
        description="예약 정보와 취소 안내를 확인하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />
      <section className="mx-auto max-w-[900px] px-6 py-12">
        <BookingDetailTemplate bookingId={Number(id)} />
      </section>
    </main>
  );
}
