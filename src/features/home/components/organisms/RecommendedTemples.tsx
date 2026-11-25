import Image from "next/image";
import Link from "next/link";
import { homeTemples } from "@/features/home/data/home-preview";

export function RecommendedTemples() {
  const temples = [...homeTemples].sort((a, b) => b.fav - a.fav).slice(0, 3);

  return (
    <section className="bg-background px-4 pb-4 sm:px-6 md:px-10" aria-labelledby="h-temple">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="h-temple" className="text-[28px] font-bold text-primary md:text-4xl">
              추천 사찰
            </h2>
            <p className="mt-2 text-muted">아름다운 자연과 깊은 수행의 역사를 간직한 사찰을 소개합니다.</p>
          </div>
          <Link href="/temples" className="shrink-0 text-sm font-medium text-primary">
            전체 사찰 보기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {temples.map((temple) => (
            <article key={temple.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative aspect-[2/1]">
                <Image src={temple.img} alt={`${temple.name} 전경`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-2">
                  {temple.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-sage-05 px-2 py-0.5 text-[11px] font-bold text-sage-07">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-[22px] text-primary">{temple.name}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{temple.desc}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[13px] text-muted">{temple.region}</p>
                  <Link
                    href={`/temples/${temple.id}`}
                    className="inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-[13px] font-bold text-primary hover:bg-primary hover:text-white"
                  >
                    자세히 보기 →
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
