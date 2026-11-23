import { programs } from "@/features/program/data/programs";
import PageHero from "@/shared/components/layout/PageHero";
import ProgramFilter from "@/features/program/components/organisms/ProgramFilter";

type ProgramsPageProps = {
  searchParams: Promise<{
    keyword?: string;
    date?: string;
    people?: string;
  }>;
};

export default async function ProgramsPage({
  searchParams,
}: ProgramsPageProps) {
  const params = await searchParams;

  const keyword = params.keyword ?? "";
  const date = params.date ?? "";
  const people = params.people ?? "";

  // 검색어에 맞는 프로그램 찾기
  const filteredPrograms = programs.filter((program) => {
    const searchKeyword = keyword.trim().toLowerCase();

    if (!searchKeyword) {
      return true;
    }

    return (
      program.name.toLowerCase().includes(searchKeyword) ||
      program.temple.toLowerCase().includes(searchKeyword)
    );
  });

  return (
    <main className="min-h-screen bg-background">
      {/* 공통 메인 비주얼 */}
      <PageHero
        title="체험 프로그램 찾기"
        description="템플스테이, 명상, 요가, 사찰 음식, 문화 활동을 검색하고 예약하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10">
        {/* 검색 조건 */}

        {/* 검색 영역 */}
        <section className="bg-white px-5 py-20 md:px-10">
          <div className="w-full">
            {/* 검색 영역 제목 */}
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">FILTER</p>

              <h2 className="mt-4 text-3xl font-bold text-primary">
                조건으로 체험 찾기
              </h2>

              <p className="mt-5 text-sm text-muted">
                지역, 날짜, 인원, 가격, 1박/당일을 선택하세요.
              </p>
            </div>

            {/* 검색 입력 영역 */}
            <form action="/programs" method="GET" className="mt-12">
              {/* 첫 번째 줄: 지역 및 종류 */}
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex h-[68px] items-center rounded-t-lg bg-sage-04 px-5 md:rounded-l-lg md:rounded-tr-none">
                  <svg
                    className="mr-4 h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" />
                    <path d="M9 4v13.5M15 6.5V20" />
                  </svg>

                  <select
                    name="region"
                    aria-label="지역 선택"
                    defaultValue=""
                    className="w-full bg-transparent text-sm text-muted outline-none"
                  >
                    <option value="">지역 선택</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="경북">경북</option>
                    <option value="전남">전남</option>
                  </select>
                </div>

                <div className="flex h-[68px] items-center bg-sage-04 px-5 md:rounded-r-lg">
                  <span className="mr-5 hidden h-10 border-l border-sage-03 md:block" />

                  <svg
                    className="mr-3 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M9 6h12M9 12h12M9 18h12" />
                    <circle cx="4" cy="6" r="1" />
                    <circle cx="4" cy="12" r="1" />
                    <circle cx="4" cy="18" r="1" />
                  </svg>

                  <select
                    name="category"
                    aria-label="종류 선택"
                    defaultValue=""
                    className="w-full bg-transparent text-sm text-muted outline-none"
                  >
                    <option value="">종류 선택</option>
                    <option value="템플스테이">템플스테이</option>
                    <option value="명상">명상</option>
                    <option value="요가">요가</option>
                    <option value="사찰음식">사찰 음식</option>
                  </select>
                </div>
              </div>

              {/* 두 번째 줄: 키워드, 날짜, 인원, 검색 */}
              <div className="mt-3 grid grid-cols-1 overflow-hidden rounded-lg bg-sage-04 md:grid-cols-[1fr_1fr_1fr_auto]">
                {/* 키워드 */}
                <div className="flex h-[68px] items-center px-5">
                  <svg
                    className="mr-3 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>

                  <input
                    type="text"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="키워드 검색"
                    aria-label="키워드 검색"
                    className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
                  />
                </div>

                {/* 날짜 */}
                <div className="flex h-[68px] items-center px-5">
                  <span className="mr-5 hidden h-10 border-l border-sage-03 md:block" />

                  <svg
                    className="mr-3 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                  </svg>

                  <input
                    type="date"
                    name="date"
                    defaultValue={date}
                    aria-label="날짜 선택"
                    className="min-w-0 w-full bg-transparent text-sm text-muted outline-none"
                  />
                </div>

                {/* 인원 */}
                <div className="flex h-[68px] items-center px-5">
                  <span className="mr-5 hidden h-10 border-l border-sage-03 md:block" />

                  <svg
                    className="mr-3 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M20 8v6M17 11h6" />
                  </svg>

                  <select
                    name="people"
                    aria-label="인원 선택"
                    defaultValue={people}
                    className="min-w-0 w-full bg-transparent text-sm text-muted outline-none"
                  >
                    <option value="">인원 선택</option>
                    <option value="1">1명</option>
                    <option value="2">2명</option>
                    <option value="3">3명</option>
                    <option value="4">4명</option>
                    <option value="5">5명 이상</option>
                  </select>
                </div>

                {/* 검색 버튼 */}
                <div className="flex h-[68px] items-center justify-center px-4">
                  <button
                    type="submit"
                    aria-label="검색"
                    className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m16 16 4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* 프로그램 목록 및 필터 */}
        <div className="mt-12">
          <ProgramFilter programs={filteredPrograms} />
        </div>
      </div>
    </main>
  );
}
