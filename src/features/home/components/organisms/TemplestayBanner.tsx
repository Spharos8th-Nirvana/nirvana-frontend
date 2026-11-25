import Image from "next/image";
import Link from "next/link";
import { homeImages } from "@/features/home/data/home-preview";

/** 시안 중간 배너. 템플스테이 소개 화면으로 이동합니다. */
export function TemplestayBanner() {
  return (
    <section className="mt-16 bg-primary text-white md:mt-24" aria-labelledby="h-band">
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-6 py-12 md:grid-cols-2 md:gap-14 md:py-16">
        <Image
          src={homeImages.tea}
          alt="한옥 창가에 놓인 찻잔과 다구"
          width={720}
          height={450}
          className="aspect-video w-full rounded-[14px] object-cover"
        />
        <div>
          <p className="text-xs font-semibold tracking-[0.35em] text-action">A PAUSE FOR THE MIND</p>
          <h2 id="h-band" className="my-4 text-[28px] font-bold leading-snug md:text-[34px] md:leading-[1.4]">
            또 하나의 여행 일정이 아닌,
            <br />
            마음의 새로운 쉼표.
          </h2>
          <p className="mb-6 leading-8 text-white/80">
            숲길 산책, 고요한 차 한 잔, 그저 나로 머무는 시간.
            <br />
            익숙한 하루를 내려놓고 사찰의 일상을 천천히 만나 보세요.
          </p>
          <Link
            href="/about/templestay"
            className="inline-flex items-center gap-2 rounded-full bg-action px-5 py-2.5 text-sm font-bold text-primary"
          >
            템플스테이 알아보기
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
