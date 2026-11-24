import Image from "next/image";
import { notFound } from "next/navigation";
import { programs } from "@/features/program/data/programs";
import { programSchedules } from "@/features/program/data/program-schedules";
import {
  formatStay,
  formatWon,
  getRemainingSeats,
  isScheduleAvailable,
  parseCountParam,
  RESERVATION_PANEL_ID,
} from "@/features/program/utils/booking";
import PageHero from "@/shared/components/layout/PageHero";
import BackToListLink from "@/features/program/components/molecules/BackToListLink";
import ProgramSectionNav from "@/features/program/components/molecules/ProgramSectionNav";
import RelatedPrograms from "@/features/program/components/organisms/RelatedPrograms";
import ReservationPanel from "@/features/program/components/organisms/ReservationPanel";
import ProgramReviews from "@/features/program/components/organisms/ProgramReviews";

type ProgramDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  /** 2단계에서 "변경"으로 돌아왔을 때의 회차·인원 */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProgramDetailPage({
  params,
  searchParams,
}: ProgramDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const program = programs.find((item) => item.id === Number(id));

  if (!program) {
    notFound();
  }

  const schedules = programSchedules.filter(
    (schedule) => schedule.programId === program.id,
  );

  // 2단계에서 돌아왔다면 이전 선택을 이어서 보여줍니다. 맞지 않는 값은 무시합니다.
  const initialSchedule = schedules.find(
    (schedule) => schedule.id === query.schedule && isScheduleAvailable(schedule),
  );
  const initialAdultCount = parseCountParam(query.adults);
  const initialYouthCount = program.youthAllowed ? (parseCountParam(query.youth) ?? 0) : 0;
  const hasInitialSelection =
    initialSchedule !== undefined &&
    initialAdultCount !== null &&
    initialAdultCount + initialYouthCount >= 1 &&
    initialAdultCount + initialYouthCount <= getRemainingSeats(initialSchedule);

  // 하단 "이런 쉼도 만나보세요."에 보여줄 다른 프로그램 (최대 2개)
  const relatedPrograms = programs
    .filter((item) => item.id !== program.id)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title={program.name}
        description={`${program.temple}에서 특별한 시간을 경험해 보세요.`}
        image={program.image}
      />

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        {/* 보던 목록으로 돌아가기 */}
        <div className="mb-8">
          <BackToListLink />
        </div>

        {/* 프로그램 기본 정보 */}
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-12 md:grid-cols-2 md:items-center md:gap-12">
          {/* 왼쪽: 프로그램 대표 사진 */}
          <div className="relative h-[280px] overflow-hidden bg-subtle md:h-[360px]">
            <Image
              src={program.image}
              alt={program.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* 오른쪽: 프로그램 간략 정보 */}
          <div>
            <p className="text-sm font-semibold text-primary">
              {program.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-snug text-primary md:text-4xl">
              {program.name}
            </h1>

            <p className="mt-5 leading-7 text-muted">{program.summary}</p>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              <p>
                <span className="mr-3 font-semibold text-ink">
                  담당자 이메일
                </span>
                <span className="text-muted">{program.contactEmail}</span>
              </p>

              <p>
                <span className="mr-3 font-semibold text-ink">사찰 주소</span>
                <span className="text-muted">{program.templeAddress}</span>
              </p>

              <p>
                <span className="mr-3 font-semibold text-ink">
                  사찰 전화번호
                </span>
                <span className="text-muted">{program.templePhone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 페이지 내 이동 메뉴 */}
        <ProgramSectionNav
          items={[
            { id: "introduction", label: "소개" },
            { id: "schedule", label: "일정" },
            { id: "fee", label: "비용" },
            { id: "reservation-info", label: "신청 및 규정" },
          ]}
        />

        {/* 왼쪽 상세 정보 + 오른쪽 예약 영역 */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽 상세 정보 */}
          <div className="min-w-0">
            {/* 프로그램 소개 */}
            <section id="introduction" className="scroll-mt-24 pt-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    프로그램 소개
                  </h2>
                  <p className="mt-4 text-sm text-muted">
                    어떤 시간을 보내게 되는지 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-muted/70 sm:block">
                  PROGRAM INTRODUCTION
                </span>
              </div>

              <p className="mt-8 leading-8 text-muted">
                {program.description}
              </p>
            </section>

            {/* 프로그램 일정 */}
            <section id="schedule" className="mt-20 scroll-mt-24">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    프로그램 일정
                  </h2>
                  <p className="mt-4 text-sm text-muted">
                    프로그램 진행 순서와 상세 시간을 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-muted/70 sm:block">
                  PROGRAM SCHEDULE
                </span>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-y border-border">
                      <th className="w-[20%] px-5 py-4 font-medium text-muted/70">
                        일
                      </th>
                      <th className="w-[35%] px-5 py-4 font-medium text-muted/70">
                        시간
                      </th>
                      <th className="px-5 py-4 font-medium text-muted/70">
                        일정명
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-5 py-5 font-semibold text-primary">
                        1일차
                      </td>
                      <td className="px-5 py-5 text-muted">
                        일정 정보 준비 중
                      </td>
                      <td className="px-5 py-5 text-ink">일정 정보 준비 중</td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5"></td>
                      <td className="px-5 py-5 text-muted">
                        일정 정보 준비 중
                      </td>
                      <td className="px-5 py-5 text-ink">일정 정보 준비 중</td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5"></td>
                      <td className="px-5 py-5 text-muted">
                        일정 정보 준비 중
                      </td>
                      <td className="px-5 py-5 text-ink">일정 정보 준비 중</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-muted/70">
                ※ 실제 운영 일정은 사찰 및 프로그램별로 다를 수 있습니다.
              </p>
            </section>

            {/* 참가 비용 */}
            <section id="fee" className="mt-20 scroll-mt-24">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">참가 비용</h2>
                  <p className="mt-4 text-sm text-muted">
                    프로그램 참가에 필요한 비용을 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-muted/70 sm:block">
                  PROGRAM FEE
                </span>
              </div>

              <div className="mt-8 divide-y divide-border border-y border-border">
                <div className="flex items-center justify-between gap-4 py-7">
                  <div>
                    <p className="text-sm text-muted">성인 1인</p>
                    <p className="mt-2 text-xs text-muted/70">
                      만 19세 이상 · {formatStay(program.nights)}
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-primary">
                    {formatWon(program.adultPrice)}
                  </p>
                </div>

                {/* 청소년 참여가 허용된 프로그램만 청소년 요금을 보여줍니다. */}
                {program.youthAllowed && (
                  <div className="flex items-center justify-between gap-4 py-7">
                    <div>
                      <p className="text-sm text-muted">청소년 1인</p>
                      <p className="mt-2 text-xs text-muted/70">
                        만 19세 미만 · {formatStay(program.nights)}
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-primary">
                      {formatWon(program.youthPrice)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 예약 안내 */}
            <section id="reservation-info" className="mt-20 scroll-mt-24">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">예약 안내</h2>
                  <p className="mt-4 text-sm text-muted">
                    예약 전 아래 내용을 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-muted/70 sm:block">
                  RESERVATION GUIDE
                </span>
              </div>

              <div className="mt-8 divide-y divide-border border-y border-border">
                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-ink">예약 안내</h3>
                  <p className="text-sm leading-7 text-muted">
                    예약 관련 상세 정보는 준비 중입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-ink">취소 및 환불</h3>
                  <p className="text-sm leading-7 text-muted">
                    취소 및 환불 규정은 준비 중입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-ink">참가 유의사항</h3>
                  <p className="text-sm leading-7 text-muted">
                    프로그램 참가 시 필요한 유의사항은 준비 중입니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 후기 */}
            {/* 프로그램 리뷰 */}
            <ProgramReviews programId={program.id} />
          </div>

          {/* 오른쪽: 고정 예약 영역 */}
          <aside id={RESERVATION_PANEL_ID} className="relative scroll-mt-24">
            <ReservationPanel
              programId={program.id}
              adultPrice={program.adultPrice}
              youthPrice={program.youthPrice}
              youthAllowed={program.youthAllowed}
              nights={program.nights}
              schedules={schedules}
              {...(hasInitialSelection && {
                initialScheduleId: initialSchedule.id,
                initialAdultCount,
                initialYouthCount,
              })}
            />
          </aside>
        </div>

        {/* 이런 쉼도 만나보세요. */}
        <RelatedPrograms programs={relatedPrograms} />
      </section>
    </main>
  );
}
