import Link from "next/link";
import { LikeTempleButton } from "@/features/guide/components/molecules/LikeTempleButton";
import { temples } from "@/features/temple/data/temples";
import PageHero from "@/shared/components/layout/PageHero";

export default function TemplesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 메인 비주얼 */}
      {/* 메인 비주얼 */}
      <PageHero
        title="사찰 찾기"
        description="템플스테이, 명상, 요가, 사찰 음식, 문화 활동을 검색하고 예약하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      {/* 검색 및 필터 */}
      <section className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">FILTER</p>

            <h2 className="mt-4 text-3xl font-bold text-primary">조건으로 사찰 찾기</h2>

            <p className="mt-5 text-sm text-muted">지역과 키워드로 원하는 사찰을 찾아보세요.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              className="flex items-center gap-3 rounded-lg border border-border px-5 py-5 text-left text-sm text-muted/70 transition-colors hover:border-primary"
            >
              <span className="text-lg">♧</span>
              지역 선택
            </button>

            <div className="flex items-center rounded-lg border border-border px-5 py-2">
              <input
                type="text"
                placeholder="키워드 검색"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted/70"
              />

              <button
                type="button"
                aria-label="검색"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white"
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 사찰 목록 */}
      <section className="px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold text-primary">사찰 목록</h2>

            <p className="text-sm text-muted">총 {temples.length}개</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {temples.map((temple) => (
              <div key={temple.id} className="group">
                <div className="relative">
                <Link href={`/temples/${temple.id}`}>
                {/* 이미지 영역 */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-subtle transition-all duration-300 group-hover:shadow-lg">
                  <span className="text-5xl text-sage-03">▧</span>
                </div>

                {/* 사찰 정보 */}
                <div className="px-2 pt-4">
                  <h3 className="text-base font-bold text-primary group-hover:font-extrabold">
                    {temple.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">{temple.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {temple.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-muted/70">주소 및 전화번호 정보 준비 중</p>
                </div>
                </Link>
                <div className="absolute left-4 top-4 z-10">
                  <LikeTempleButton templeId={temple.id} templeName={temple.name} />
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-16 flex items-center justify-center gap-5 text-sm text-primary">
            <span className="text-sage-03">〈</span>
            <span className="font-bold">1</span>
            <span className="text-muted/70">〉</span>
          </div>
        </div>
      </section>
    </main>
  );
}
