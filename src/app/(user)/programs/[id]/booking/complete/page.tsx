import { notFound } from "next/navigation";
import BookingCompleteTemplate from "@/features/booking/components/templates/BookingCompleteTemplate";
import { programs } from "@/features/program/data/programs";
import PageHero from "@/shared/components/layout/PageHero";

export default async function BookingCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = programs.find((item) => item.id === Number(id));
  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero title="예약 완료" description={`${program.temple} · ${program.name}`} image={program.image} />
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
        <BookingCompleteTemplate programId={program.id} />
      </div>
    </main>
  );
}
