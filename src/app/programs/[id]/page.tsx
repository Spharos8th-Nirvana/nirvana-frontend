import { notFound } from "next/navigation";
import { programs } from "@/data/programs";
import PageHero from "@/components/layout/page-hero";
import ReservationPanel from "@/components/features/programs/reservation-panel";
import ProgramReviews from "@/components/features/programs/program-reviews";

type ProgramDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;

  const program = programs.find((item) => item.id === Number(id));

  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title={program.name}
        description={`${program.temple}에서 특별한 시간을 경험해 보세요.`}
        image={program.image}
      />

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        {/* 프로그램 기본 정보 */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#EAEAE5] pb-12 md:grid-cols-2 md:items-center md:gap-12">
          {/* 왼쪽: 프로그램 대표 사진 */}
          <div className="h-[280px] overflow-hidden bg-[#EEEAE5] md:h-[360px]">
            <img src={program.image} alt={program.name} className="h-full w-full object-cover" />
          </div>

          {/* 오른쪽: 프로그램 간략 정보 */}
          <div>
            <p className="text-sm font-semibold text-[#B75D32]">{program.category}</p>

            <h1 className="mt-3 text-3xl font-bold leading-snug text-[#173F35] md:text-4xl">
              {program.name}
            </h1>

            <p className="mt-5 leading-7 text-[#777777]">{program.summary}</p>

            <div className="mt-8 space-y-3 border-t border-[#EAEAE5] pt-6 text-sm">
              <p>
                <span className="mr-3 font-semibold text-[#333A35]">담당자 이메일</span>
                <span className="text-[#777777]">{program.contactEmail}</span>
              </p>

              <p>
                <span className="mr-3 font-semibold text-[#333A35]">사찰 주소</span>
                <span className="text-[#777777]">{program.templeAddress}</span>
              </p>

              <p>
                <span className="mr-3 font-semibold text-[#333A35]">사찰 전화번호</span>
                <span className="text-[#777777]">{program.templePhone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 페이지 내 이동 메뉴 */}
        <nav className="sticky top-16 z-40 border-b border-[#EAEAE5] bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-8 overflow-x-auto px-6 py-5 md:gap-14 md:px-10">
            <a
              href="#introduction"
              className="shrink-0 text-sm font-semibold text-[#333A35] transition-colors hover:text-[#173F35]"
            >
              소개
            </a>
            <a
              href="#schedule"
              className="shrink-0 text-sm font-semibold text-[#333A35] transition-colors hover:text-[#173F35]"
            >
              일정
            </a>
            <a
              href="#fee"
              className="shrink-0 text-sm font-semibold text-[#333A35] transition-colors hover:text-[#173F35]"
            >
              비용
            </a>
            <a
              href="#reservation-info"
              className="shrink-0 text-sm font-semibold text-[#333A35] transition-colors hover:text-[#173F35]"
            >
              신청 및 규정
            </a>
          </div>
        </nav>

        {/* 왼쪽 상세 정보 + 오른쪽 예약 영역 */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽 상세 정보 */}
          <div className="min-w-0">
            {/* 프로그램 소개 */}
            <section id="introduction" className="scroll-mt-36 pt-8">
              <h2 className="text-2xl font-bold text-[#173F35]">프로그램 소개</h2>

              <p className="mt-5 leading-8 text-[#756F62]">{program.description}</p>
            </section>

            {/* 프로그램 일정 */}
            <section id="schedule" className="mt-20 scroll-mt-36">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#173F35]">프로그램 일정</h2>
                  <p className="mt-4 text-sm text-[#777777]">
                    프로그램 진행 순서와 상세 시간을 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-[#999999] sm:block">
                  PROGRAM SCHEDULE
                </span>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-y border-[#EAEAE5]">
                      <th className="w-[20%] px-5 py-4 font-medium text-[#999999]">일</th>
                      <th className="w-[35%] px-5 py-4 font-medium text-[#999999]">시간</th>
                      <th className="px-5 py-4 font-medium text-[#999999]">일정명</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EAEAE5]">
                    <tr>
                      <td className="px-5 py-5 font-semibold text-[#173F35]">1일차</td>
                      <td className="px-5 py-5 text-[#777777]">일정 정보 준비 중</td>
                      <td className="px-5 py-5 text-[#333A35]">일정 정보 준비 중</td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5"></td>
                      <td className="px-5 py-5 text-[#777777]">일정 정보 준비 중</td>
                      <td className="px-5 py-5 text-[#333A35]">일정 정보 준비 중</td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5"></td>
                      <td className="px-5 py-5 text-[#777777]">일정 정보 준비 중</td>
                      <td className="px-5 py-5 text-[#333A35]">일정 정보 준비 중</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-[#999999]">
                ※ 실제 운영 일정은 사찰 및 프로그램별로 다를 수 있습니다.
              </p>
            </section>

            {/* 참가 비용 */}
            <section id="fee" className="mt-20 scroll-mt-36">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#173F35]">참가 비용</h2>
                  <p className="mt-4 text-sm text-[#777777]">
                    프로그램 참가에 필요한 비용을 확인해 주세요.
                  </p>
                </div>
                <span className="hidden text-xs tracking-wider text-[#999999] sm:block">
                  PROGRAM FEE
                </span>
              </div>

              <div className="mt-8 border-y border-[#EAEAE5] py-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#777777]">1인 참가 비용</p>
                    <p className="mt-2 text-xs text-[#999999]">기본 참가 비용 기준</p>
                  </div>

                  <p className="text-2xl font-bold text-[#173F35]">
                    ₩{program.price.toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </section>

            {/* 예약 안내 */}
            <section id="reservation-info" className="mt-20 scroll-mt-36">
              <div>
                <h2 className="text-2xl font-bold text-[#173F35]">예약 안내</h2>
                <p className="mt-4 text-sm text-[#777777]">예약 전 아래 내용을 확인해 주세요.</p>
              </div>

              <div className="mt-8 divide-y divide-[#EAEAE5] border-y border-[#EAEAE5]">
                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-[#333A35]">예약 안내</h3>
                  <p className="text-sm leading-7 text-[#777777]">
                    예약 관련 상세 정보는 준비 중입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-[#333A35]">취소 및 환불</h3>
                  <p className="text-sm leading-7 text-[#777777]">
                    취소 및 환불 규정은 준비 중입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-[#333A35]">참가 유의사항</h3>
                  <p className="text-sm leading-7 text-[#777777]">
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
          <aside className="relative">
            <ReservationPanel price={program.price} />
          </aside>
        </div>
      </section>
    </main>
  );
}
