import Link from "next/link";
import { temples } from "@/data/temples";

export function RecommendedTemples() {
  return (
    <section className="bg-[#F7F3EA] px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* 섹션 제목 */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#B75D32] sm:text-xs sm:tracking-[0.25em]">
            TEMPLE
          </p>

          <div className="mt-3 flex items-end justify-between text-left">
            <h2 className="font-serif text-2xl font-bold text-[#173F35] sm:text-3xl md:text-4xl">
              추천 사찰
            </h2>
          </div>

          <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
            <p className="text-xs leading-6 text-[#756F62] sm:text-sm">
              한국의 아름다운 사찰을 만나보세요.
              <br />각 사찰이 이야기를 가진 특별한 체험을 확인하세요.
            </p>

            <Link
              href="/temples"
              className="shrink-0 text-xs font-medium text-[#173F35] transition-all duration-200 hover:font-bold sm:text-sm"
            >
              모두 둘러보기 →
            </Link>
          </div>
        </div>

        {/* 사찰 카드 */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {temples.map((temple) => (
            <article
              key={temple.id}
              className="group relative overflow-hidden border border-[#D8D0C0] bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <Link
                href={`/temples/${temple.id}`}
                aria-label={`${temple.name} 상세 페이지로 이동`}
                className="absolute inset-0 z-10"
              />
              {/* 이미지 자리 */}
              <div className="flex h-44 items-center justify-center bg-[#EEE5D3] sm:h-48 lg:h-52">
                <span className="font-serif text-base text-[#8A8173] sm:text-lg">
                  {temple.name} 이미지
                </span>
              </div>

              {/* 사찰 정보 */}
              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-lg font-semibold text-[#173F35] sm:text-xl">
                  {temple.name}
                </h3>

                <p className="mt-2 min-h-12 text-xs leading-6 text-[#756F62] sm:text-sm">
                  {temple.description}
                </p>

                {/* 특징 태그 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {temple.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#EEE5D3] px-2 py-1 text-[10px] text-[#173F35] sm:text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
