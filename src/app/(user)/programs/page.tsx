import { programs } from "@/features/program/data/programs";
import PageHero from "@/shared/components/layout/PageHero";
import ProgramFilter from "@/features/program/components/organisms/ProgramFilter";
import { CalendarIcon, SearchIcon, UsersIcon } from "@/shared/components/ui/Icons";
import SelectField from "@/shared/components/ui/SelectField";

type ProgramsPageProps = {
  searchParams: Promise<{
    keyword?: string;
    date?: string;
    people?: string;
  }>;
};

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
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
        <section className="px-5 py-20 md:px-10">
          <div className="w-full">
            {/* 검색 영역 제목 */}
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">FILTER</p>

              <h2 className="mt-4 text-3xl font-bold text-primary">조건으로 체험 찾기</h2>

              <p className="mt-5 text-sm text-muted">
                지역, 날짜, 인원, 가격, 1박/당일을 선택하세요.
              </p>
            </div>

            {/* 검색 입력 영역 */}
            <form
              action="/programs"
              method="GET"
              className="mt-12 rounded-lg bg-white p-4 shadow-[0_12px_35px_rgba(23,63,53,0.10)] sm:p-5 md:p-3"
            >
              {/* 첫 번째 줄: 지역 및 종류 */}
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex h-[68px] items-center rounded-t-lg bg-white px-5 md:rounded-l-lg md:rounded-tr-none">
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

                  <SelectField
                    variant="bare"
                    name="region"
                    aria-label="지역 선택"
                    defaultValue=""
                    wrapperClassName="min-w-0 w-full"
                    className="text-muted"
                  >
                    <option value="">지역 선택</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="경북">경북</option>
                    <option value="전남">전남</option>
                  </SelectField>
                </div>

                <div className="flex h-[68px] items-center bg-white px-5 md:rounded-r-lg">
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

                  <SelectField
                    variant="bare"
                    name="category"
                    aria-label="종류 선택"
                    defaultValue=""
                    wrapperClassName="min-w-0 w-full"
                    className="text-muted"
                  >
                    <option value="">종류 선택</option>
                    <option value="템플스테이">템플스테이</option>
                    <option value="명상">명상</option>
                    <option value="요가">요가</option>
                    <option value="사찰음식">사찰 음식</option>
                  </SelectField>
                </div>
              </div>

              {/* 두 번째 줄: 키워드, 날짜, 인원, 검색 */}
              <div className="mt-3 grid grid-cols-1 overflow-hidden rounded-lg bg-white md:grid-cols-[1fr_1fr_1fr_auto]">
                {/* 키워드 */}
                <div className="flex h-[68px] items-center px-5">
                  <SearchIcon className="mr-3 h-4 w-4 shrink-0" />

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

                  <CalendarIcon className="mr-3 h-4 w-4 shrink-0" strokeWidth={1.8} />

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

                  <UsersIcon className="mr-3 h-4 w-4 shrink-0" strokeWidth={1.8} />

                  <SelectField
                    variant="bare"
                    name="people"
                    aria-label="인원 선택"
                    defaultValue={people}
                    wrapperClassName="min-w-0 w-full"
                    className="text-muted"
                  >
                    <option value="">인원 선택</option>
                    <option value="1">1명</option>
                    <option value="2">2명</option>
                    <option value="3">3명</option>
                    <option value="4">4명</option>
                    <option value="5">5명 이상</option>
                  </SelectField>
                </div>

                {/* 검색 버튼 */}
                <div className="flex h-[68px] items-center justify-center px-4">
                  <button
                    type="submit"
                    aria-label="검색"
                    className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover"
                  >
                    <SearchIcon className="h-5 w-5" />
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
