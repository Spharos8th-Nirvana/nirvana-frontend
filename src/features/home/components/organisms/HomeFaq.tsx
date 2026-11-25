import Link from "next/link";
import { homeFaqs } from "@/features/home/data/home-preview";

/** 시안 FAQ 4문항. 첫 문항만 펼쳐 두고 나머지는 눌러서 엽니다. */
export function HomeFaq() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 md:px-10 md:py-24" aria-labelledby="h-faq">
      <div className="mx-auto grid max-w-[1200px] items-start gap-10 md:grid-cols-[1fr_1.6fr] md:gap-14">
        <div>
          <p className="text-xs font-semibold tracking-[0.35em] text-sage-07">FAQ</p>
          <h2 id="h-faq" className="my-3 text-[28px] font-bold leading-snug text-primary md:text-[32px] md:leading-[1.4]">
            사찰 생활이 처음이어도,
            <br />
            편안하게 함께해요.
          </h2>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-primary"
          >
            고객센터 바로가기
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="border-t border-border">
          {homeFaqs.map((item, index) => (
            <details key={item.q} open={index === 0} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-bold text-primary">
                {item.q}
                <span className="text-[26px] font-normal text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="pb-5 leading-8 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
