import { notFound } from "next/navigation";
import BookingPayTemplate from "@/features/booking/components/templates/BookingPayTemplate";
import { programs } from "@/features/program/data/programs";
import PageHero from "@/shared/components/layout/PageHero";

export default async function BookingPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = programs.find((item) => item.id === Number(id));
  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero title="결제하기" description={`${program.temple} · ${program.name}`} image={program.image} />
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
        <BookingPayTemplate programId={program.id} />
      </div>
    </main>
  );
}
