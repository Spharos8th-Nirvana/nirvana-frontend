import Link from "next/link";

const notices = [
  { id: 1, title: "너바나 서비스 이용 안내", date: "2026.11.20" },
  { id: 2, title: "템플스테이 예약 및 변경 안내", date: "2026.11.18" },
  { id: 3, title: "새로운 사찰 프로그램 오픈", date: "2026.11.15" },
  { id: 4, title: "너바나 이벤트 참여 안내", date: "2026.11.12" },
];

const events = [
  {
    id: 1,
    category: "NIRVANA SPECIAL",
    title: "가을 사찰 여행",
    description: "고요한 사찰에서 나만의 쉼을 만나보세요.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  },
  {
    id: 2,
    category: "SPECIAL EVENT",
    title: "나를 위한 하루",
    description: "일상에서 벗어나 특별한 시간을 경험하세요.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
];

export function NoticeEvents() {
  return (
    <section className="bg-[bg-background] px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* 섹션 제목 */}
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.25em]">
            NOTICE & EVENT
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            새로운 소식, 특별한 경험
          </h2>

          <p className="mt-3 text-xs leading-6 text-muted sm:mt-4 sm:text-sm">
            너바나의 새로운 소식과 특별한 사찰 체험을 만나보세요.
          </p>
        </div>

        {/* 공지사항 및 이벤트 */}
        <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 md:mt-12 md:grid-cols-2 md:gap-8">
          {/* 공지사항 */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-primary sm:text-xl">
                공지사항
              </h3>

              <Link
                href="/community/notices"
                className="shrink-0 text-[10px] text-muted hover:text-sage-07 sm:text-xs"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="border-t border-border">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/community/notices/${notice.id}`}
                  className="flex min-h-12 items-center justify-between gap-2 border-b border-border py-3 transition-colors hover:text-sage-07 sm:gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span className="shrink-0 bg-sage-05 px-2 py-1 text-[10px] text-muted">
                      공지
                    </span>

                    <span className="truncate text-xs text-primary sm:text-sm">
                      {notice.title}
                    </span>
                  </div>

                  <time className="shrink-0 text-[10px] text-muted/70 sm:text-xs">
                    {notice.date}
                  </time>
                </Link>
              ))}
            </div>
          </div>

          {/* 이벤트 배너 */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-primary sm:text-xl">
                추천 이벤트
              </h3>

              <Link
                href="/events"
                className="shrink-0 text-[10px] text-muted hover:text-sage-07 sm:text-xs"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group relative min-w-0 overflow-hidden rounded-lg"
                >
                  <div className="relative h-52 sm:h-56 lg:h-64">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                      <p className="text-[9px] font-semibold tracking-wider text-[#E7B84B] sm:text-[10px]">
                        {event.category}
                      </p>

                      <h4 className="mt-2 font-serif text-base font-semibold text-white sm:text-lg">
                        {event.title}
                      </h4>

                      <p className="mt-2 text-[10px] leading-5 text-white/80 sm:text-xs">
                        {event.description}
                      </p>

                      <span className="mt-3 inline-block text-[10px] text-white sm:text-xs">
                        자세히 보기 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
