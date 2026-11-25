import Image from "next/image";
import Link from "next/link";
import { homeReviews } from "@/features/home/data/home-preview";

export function CommunityStories() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 md:px-10 md:py-24" aria-labelledby="h-story">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="h-story" className="text-[28px] font-bold text-primary md:text-4xl">
              사람들이 남긴 이야기
            </h2>
            <p className="mt-2 text-muted">NirVaNa를 통해 특별한 시간을 보낸 분들의 이야기를 만나보세요.</p>
          </div>
          <Link href="/community" className="shrink-0 text-sm font-medium text-primary">
            더 많은 이야기 보기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {homeReviews.map((review) => (
            <Link
              key={review.id}
              href={`/community/${review.id}`}
              className="grid grid-cols-[76px_1fr] gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <Image src={review.img} alt="" width={76} height={76} className="h-[76px] w-[76px] rounded-full object-cover" />
              <div>
                <q className="block text-[15px] leading-7 text-ink">{review.quote}</q>
                <p className="mt-2 text-sm">
                  <b>{review.name}</b>
                  <span className="text-muted"> · {review.prog}</span>
                </p>
                <p className="mt-1 text-sm tracking-wider text-[#c9a45c]">
                  {"★★★★★".slice(0, review.rate)}
                  <span className="ml-1.5 font-sans tracking-normal text-xs text-muted">{review.rate.toFixed(1)}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
