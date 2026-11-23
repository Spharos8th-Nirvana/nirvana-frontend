import Link from "next/link";

const stories = [
  {
    id: 1,
    category: "사찰음식",
    date: "3일 전",
    title: "스님이 차려 주신 아침, 동도사 사찰음식",
    description: "정갈하고 담백한 음식과 함께 마음까지 편안해지는 아침을 경험했어요.",
  },
  {
    id: 2,
    category: "여행 후기",
    date: "4일 전",
    title: "새벽 예불이 있는 불국사",
    description: "고요한 새벽 사찰에서 예불에 참여하며 특별한 시간을 보냈습니다.",
  },
  {
    id: 3,
    category: "체험 후기",
    date: "5일 전",
    title: "해인사 템플스테이에서의 하루",
    description: "가야산의 자연 속에서 온전히 나에게 집중할 수 있었던 시간이었어요.",
  },
];

export function CommunityStories() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* 섹션 제목 */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#B75D32] sm:text-xs sm:tracking-[0.25em]">
            COMMUNITY
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            사람들이 남긴 이야기
          </h2>

          <div className="mt-3 flex items-end justify-between gap-4 sm:mt-4">
            <p className="text-xs leading-6 text-[#756F62] sm:text-sm">
              사찰음식, 아름다운 사찰, 체험 후기 등
              <br />
              커뮤니티에서 오간 깊은 이야기를 만나보세요.
            </p>

            <Link
              href="/community"
              className="shrink-0 text-xs font-medium text-primary transition-all duration-200 hover:font-bold sm:text-sm"
            >
              모두 둘러보기 →
            </Link>
          </div>
        </div>

        {/* 커뮤니티 카드 */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group relative flex h-full flex-col overflow-hidden border border-border bg-white transition-shadow duration-300 hover:shadow-lg"
            >
              {/* 카드 전체 클릭 링크 */}
              <Link
                href={`/community/${story.id}`}
                aria-label={`${story.title} 상세 페이지로 이동`}
                className="absolute inset-0 z-10"
              />

              {/* 이미지 영역 */}
              <div className="flex h-44 shrink-0 items-center justify-center bg-[#F5F5F5] sm:h-48 lg:h-52">
                <span className="font-serif text-xs text-[#8A8173] sm:text-sm">
                  COMMUNITY IMAGE
                </span>
              </div>

              {/* 게시글 정보 */}
              <div className="relative z-20 flex flex-1 flex-col p-4 sm:p-5 pointer-events-none">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8A8173] sm:text-xs">
                    <span className="bg-[#EEE5D3] px-2 py-1 text-primary">{story.category}</span>
                    <span>{story.date}</span>
                  </div>

                  <h3 className="mt-3 h-14 overflow-hidden font-serif text-base font-semibold leading-7 text-primary sm:mt-4 sm:text-lg">
                    {story.title}
                  </h3>

                  <p className="mt-3 min-h-12 line-clamp-2 text-xs leading-6 text-[#756F62] sm:text-sm">
                    {story.description}
                  </p>
                </div>

                {/* 더 보기 */}
                <div className="mt-auto flex justify-end pt-5">
                  <Link
                    href={`/community/${story.id}`}
                    className="pointer-events-auto inline-flex items-center gap-2 text-xs font-medium text-primary transition-all duration-200 hover:font-bold sm:text-sm"
                  >
                    더 보기
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
