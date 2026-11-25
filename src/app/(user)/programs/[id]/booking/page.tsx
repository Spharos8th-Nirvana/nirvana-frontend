import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { heldFromCookie } from "@/features/booking/utils/pending-payment";
import BookingProgress from "@/features/booking/components/organisms/BookingProgress";
import BookingInfoTemplate from "@/features/booking/components/templates/BookingInfoTemplate";
import { bookingTerms } from "@/features/booking/data/booking-terms";
import { programSchedules } from "@/features/program/data/program-schedules";
import { programs } from "@/features/program/data/programs";
import {
  buildReservationEditHref,
  calculateTotalPrice,
  formatScheduleRange,
  formatScheduleTime,
  formatStay,
  getRemainingSeats,
  isScheduleAvailable,
  parseCountParam,
} from "@/features/program/utils/booking";
import { cancellationPolicies } from "@/features/temple/data/cancellation-policies";
import PageHero from "@/shared/components/layout/PageHero";

export const metadata: Metadata = {
  title: "예약 정보 입력",
};

type BookingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const program = programs.find((item) => item.id === Number(id));
  if (!program) {
    notFound();
  }

  const programPath = `/programs/${program.id}`;
  const schedule = programSchedules.find(
    (item) => item.programId === program.id && item.id === query.schedule,
  );
  const adultCount = parseCountParam(query.adults);
  const youthCount = parseCountParam(query.youth) ?? 0;

  // 1단계에서 넘어온 값 확인 (화면용 확인이며, 최종 검증은 Backend가 합니다)
  const isValidSelection =
    schedule !== undefined &&
    isScheduleAvailable(schedule) &&
    adultCount !== null &&
    (program.youthAllowed || youthCount === 0) &&
    adultCount + youthCount >= 1 &&
    adultCount + youthCount <= getRemainingSeats(schedule);

  if (!isValidSelection) {
    redirect(programPath);
  }

  // 쿠키는 첫 화면에만 참고합니다. 현재 탭 예약 기록으로 다시 검사한 뒤 입력을 엽니다.
  const holdCookie = (await cookies()).get("nirvana-holds")?.value;
  const serverMayBeFull = adultCount + youthCount > getRemainingSeats(schedule, heldFromCookie(holdCookie, schedule.id));

  const refundRules =
    cancellationPolicies.find((policy) => policy.templeId === program.templeId)?.rules ?? [];

  // 1단계로 돌아가는 주소. 고른 회차·인원을 그대로 넘겨 선택이 유지되게 합니다.
  const editHref = buildReservationEditHref({
    programId: program.id,
    scheduleId: schedule.id,
    adultCount,
    youthCount,
  });

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="고요한 하루를 예약하세요."
        description={`${program.temple} · ${program.name}`}
        image={program.image}
      />

      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <BookingProgress currentStep={2} stepHrefs={{ 1: editHref }} />

        <div className="mt-12">
          <BookingInfoTemplate
            schedule={schedule}
            serverMayBeFull={serverMayBeFull}
            selection={{
              programName: program.name,
              templeName: program.temple,
              category: program.category,
              image: program.image,
              scheduleLabel: formatScheduleRange(schedule),
              stayLabel: formatStay(program.nights),
              timeLabel:
                schedule.operationStartDate === schedule.operationEndDate
                  ? formatScheduleTime(schedule)
                  : `입실 ${schedule.startTime}`,
              adultCount,
              youthCount,
              adultPrice: program.adultPrice,
              youthPrice: program.youthPrice,
              totalPrice: calculateTotalPrice(program, { adultCount, youthCount }),
              editHref,
              programId: program.id,
              scheduleId: schedule.id,
              scheduleStart: schedule.operationStartDate,
            }}
            terms={bookingTerms}
            refundRules={refundRules}
            genderRequired={program.categoryCode === "OVERNIGHT"}
          />
        </div>
      </div>
    </main>
  );
}
