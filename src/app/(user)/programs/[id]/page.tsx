import { notFound } from "next/navigation";
import { programReviews } from "@/features/program/data/program-reviews";
import { programs } from "@/features/program/data/programs";
import { programSchedules } from "@/features/program/data/program-schedules";
import {
  formatStay,
  getRemainingSeats,
  isScheduleAvailable,
  parseCountParam,
  RESERVATION_PANEL_ID,
} from "@/features/program/utils/booking";
import {
  formatDayLabel,
  formatDuration,
  formatTimetableTime,
  getTotalDuration,
  sortTimetable,
} from "@/features/program/utils/timetable";
import { cancellationPolicies } from "@/features/temple/data/cancellation-policies";
import PageHero from "@/shared/components/layout/PageHero";
import { formatWon } from "@/shared/utils/format";

import BackToListLink from "@/features/program/components/molecules/BackToListLink";
import DetailSection, {
  SectionDivider,
} from "@/features/program/components/molecules/DetailSection";
import ProgramSectionNav from "@/features/program/components/molecules/ProgramSectionNav";
import ProgramGuide from "@/features/program/components/organisms/ProgramGuide";
import ProgramOverview from "@/features/program/components/organisms/ProgramOverview";
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

/**
 * 정보 상자: 연초록 제목 줄 → 흰 바탕 값 (선 없이 색 차이로 구분)
 * 프로그램 소개 요약, 참가비용에서 함께 씁니다.
 */
function OutlineBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-hidden bg-white">
      <dt className="bg-subtle px-5 py-3 text-sm font-bold text-ink">{label}</dt>
      <dd className="px-5 py-5 text-lg font-bold text-ink">{value}</dd>
    </div>
  );
}

export default async function ProgramDetailPage({ params, searchParams }: ProgramDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const program = programs.find((item) => item.id === Number(id));

  if (!program) {
    notFound();
  }

  const schedules = programSchedules.filter((schedule) => schedule.programId === program.id);

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

  // 사찰 취소·환불 규정 (이용일 기준 며칠 전까지 몇 % 환불)
  const refundRules =
    cancellationPolicies.find((policy) => policy.templeId === program.templeId)?.rules ?? [];

  // 하단 "이런 쉼도 만나보세요.": 목록 순서 기준 이전 프로그램, 다음 프로그램 (처음·끝은 순환)
  const currentIndex = programs.findIndex((item) => item.id === program.id);
  const previousProgram = programs[(currentIndex - 1 + programs.length) % programs.length];
  const nextProgram = programs[(currentIndex + 1) % programs.length];
  const relatedPrograms = [previousProgram, nextProgram].filter(
    // 프로그램이 1~2개뿐이면 자기 자신이나 같은 프로그램이 두 번 나오지 않게 합니다.
    (item, index, list) =>
      item.id !== program.id && list.findIndex((other) => other.id === item.id) === index,
  );

  const reviewCount = programReviews.filter((review) => review.programId === program.id).length;

  // 하루 일정표 (날짜·순서대로)
  const timetable = sortTimetable(program.timetable);
  const totalDuration = getTotalDuration(timetable);
  // 회차 시작 시각 (하루 여러 회차 프로그램 안내용)
  const sessionStartTimes = [...new Set(schedules.map((schedule) => schedule.startTime))].sort();

  const stay = formatStay(program.nights);
  const programTitle = `${program.temple} ${program.name}`;
  const highlights = [
    { label: "머무는 기간", value: stay },
    { label: "프로그램 분류", value: program.category },
    { label: "참여 대상", value: program.youthAllowed ? "성인 · 청소년" : "성인" },
  ];

  return (
    <main className="min-h-screen bg-background">
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
        <div className="border-b border-border pb-12">
          <ProgramOverview program={program} />
        </div>

        {/* 페이지 내 이동 메뉴 */}
        <ProgramSectionNav
          items={[
            { id: "introduction", label: "소개" },
            { id: "schedule", label: "일정" },
            { id: "fee", label: "비용" },
            { id: "reservation-info", label: "이용 규칙" },
            { id: "reviews", label: `리뷰 (${reviewCount})` },
          ]}
        />

        {/* 왼쪽 상세 정보 + 오른쪽 예약 영역 */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽 상세 정보: 작은 머리글 → 큰 제목 → 설명 (와이어프레임) */}
          <div className="min-w-0 space-y-16">
            <DetailSection
              id="introduction"
              eyebrow="소개"
              title="프로그램 소개"
              description={`${programTitle} 프로그램을 소개합니다.`}
            >
              <p className="leading-8 text-ink">{program.description}</p>

              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <OutlineBox key={item.label} label={item.label} value={item.value} />
                ))}
              </dl>
            </DetailSection>

            <SectionDivider />

            <DetailSection
              id="schedule"
              eyebrow="일정"
              title="프로그램 일정"
              description="프로그램 진행 순서와 상세 시간을 확인해 주세요."
            >
              {/* 하루 일정표 (운영자 입력). 같은 날의 두 번째 줄부터는 날짜를 비워 묶음으로 보이게 합니다. */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead className="bg-subtle">
                    <tr className="border-y border-ink/40">
                      <th className="w-[20%] px-4 py-3.5 font-bold text-ink">일정</th>
                      {/* 시각으로 적힌 일정은 "시간", 걸리는 시간으로 적힌 일정(하루 여러 회차)은 "소요 시간" */}
                      <th className="w-[35%] px-4 py-3.5 font-bold text-ink">
                        {totalDuration !== null ? "소요 시간" : "시간"}
                      </th>
                      <th className="px-4 py-3.5 font-bold text-ink">함께하는 일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border border-b border-ink/40 bg-white">
                    {timetable.length > 0 ? (
                      timetable.map((item, index) => {
                        const isFirstOfDay = timetable[index - 1]?.dayNo !== item.dayNo;
                        return (
                          <tr key={`${item.dayNo}-${item.sortOrder}`}>
                            <td className="px-4 py-4 font-bold text-ink">
                              {isFirstOfDay ? formatDayLabel(item.dayNo, program.nights) : ""}
                            </td>
                            <td className="px-4 py-4 text-ink/80">{formatTimetableTime(item)}</td>
                            <td className="px-4 py-4 text-ink">{item.activity}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-muted">
                          일정 정보가 아직 등록되지 않았어요.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 걸리는 시간으로 적힌 일정(하루 여러 회차)이면 총 시간과 회차 시작 시각을 알려 줍니다. */}
              {totalDuration !== null && (
                <p className="mt-4 text-sm text-ink">
                  총 소요 시간 {formatDuration(totalDuration)}
                  {sessionStartTimes.length > 0 && (
                    <>
                      {" "}
                      · 하루 {sessionStartTimes.length}회 ({sessionStartTimes.join(" · ")} 시작)
                    </>
                  )}
                </p>
              )}

              <p className="mt-4 text-right text-xs text-muted">
                ※ 실제 운영 일정은 사찰 및 프로그램별로 다를 수 있습니다.
              </p>
            </DetailSection>

            <SectionDivider />

            <DetailSection
              id="fee"
              eyebrow="가격"
              title="참가비용"
              description={`${programTitle}의 요금 안내입니다. (${stay} 기준)`}
            >
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
                <OutlineBox label="성인" value={formatWon(program.adultPrice)} />
                {/* 청소년 참여가 허용된 프로그램만 청소년 요금을 보여줍니다. */}
                {program.youthAllowed && (
                  <OutlineBox label="청소년" value={formatWon(program.youthPrice)} />
                )}
              </dl>
            </DetailSection>

            <SectionDivider />

            <DetailSection
              id="reservation-info"
              eyebrow="청규 및 이용규칙"
              title="예약 전 확인하세요"
              description={
                <>
                  {programTitle}에 참여하기 전에 아래 규칙과 준비물을 확인하세요.
                  {program.languageSupport && (
                    <>
                      <br />
                      외국어 안내가 제공됩니다.
                    </>
                  )}
                </>
              }
            >
              <ProgramGuide
                rules={program.rules}
                preparation={program.preparation}
                languageSupport={program.languageSupport}
                refundRules={refundRules}
              />
            </DetailSection>

            <SectionDivider />

            {/* 참여자 후기 */}
            <ProgramReviews programId={program.id} />
          </div>

          {/* 오른쪽: 고정 예약 영역 */}
          <aside id={RESERVATION_PANEL_ID} className="relative scroll-mt-24">
            <ReservationPanel
              programId={program.id}
              adultPrice={program.adultPrice}
              youthPrice={program.youthPrice}
              youthAllowed={program.youthAllowed}
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
