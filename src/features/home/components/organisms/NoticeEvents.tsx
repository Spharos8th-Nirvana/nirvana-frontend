import Link from "next/link";
import { homeImages, homeNotices } from "@/features/home/data/home-preview";

export function NoticeEvents() {
  return (
    <section className="bg-background px-4 pb-4 sm:px-6 md:px-10" aria-label="공지사항과 추천 이벤트">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-border bg-white px-6 py-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[19px] text-primary">공지사항</h3>
            <Link href="/community/notices" className="text-[13px] font-medium text-muted">
              더보기 →
            </Link>
          </div>
          <div>
            {homeNotices.map((notice) => (
              <Link
                key={notice.id}
                href={`/community/notices/${notice.id}`}
                className="flex items-center gap-3 border-t border-border py-3 text-sm hover:text-sage-07"
              >
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    notice.tag === "중요" ? "bg-[#f8ecd2] text-[#8a5a00]" : "bg-subtle text-muted"
                  }`}
                >
                  {notice.tag}
                </span>
                <span className="min-w-0 flex-1 truncate">{notice.title}</span>
                <time className="shrink-0 text-xs text-muted">{notice.date}</time>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white px-6 py-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[19px] text-primary">추천 이벤트</h3>
            <Link href="/events" className="text-[13px] font-medium text-muted">
              더보기 →
            </Link>
          </div>
          <Link
            href="/events/1"
            className="relative block h-[186px] overflow-hidden rounded-[14px] bg-[#e9ece6]"
            style={{
              backgroundImage: `url("${homeImages.event}")`,
              backgroundPosition: "right center",
              backgroundSize: "58% auto",
              backgroundRepeat: "no-repeat",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#f3f1ea] from-40% to-transparent" />
            <span className="relative block max-w-[62%] px-6 py-6">
              <span className="inline-block rounded-full bg-[#efe2c4] px-2.5 py-0.5 text-xs font-bold text-[#7a5a1d]">
                시즌 이벤트
              </span>
              <span className="mt-2 block text-[23px] leading-snug text-primary">
                겨울, 산사에서 만나는
                <br />
                마음의 온기
              </span>
              <span className="mt-1 block text-[13px] text-muted">겨울 한정 템플스테이 프로그램을 만나보세요.</span>
            </span>
            <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-white" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
