import Link from "next/link";

const emptyStamps = ["?", "?", "?", "?", "?"];

/** 시안 미니 패스포트. 아직 도장이 없는 처음 상태를 보여 줍니다. */
export function TemplePassport() {
  return (
    <section className="bg-background px-4 sm:px-6 md:px-10" aria-label="미니 패스포트">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 rounded-[18px] bg-gradient-to-r from-primary to-[#2a4636] px-5 py-4 text-white sm:flex-row sm:items-center sm:gap-6 sm:px-7">
        <div className="min-w-0 flex-1">
          <b className="text-base">나의 사찰 패스포트</b>
          <br />
          <span className="text-[13px] text-white/75">
            아직 모은 도장이 없어요. 체험을 마치면 도장이 찍혀요.
          </span>
        </div>

        <div className="flex gap-2" aria-hidden="true">
          {emptyStamps.map((mark, index) => (
            <span
              key={index}
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-action/45 text-xs font-bold text-white/55"
            >
              {mark}
            </span>
          ))}
        </div>

        <Link
          href="/mypage/passport"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-action px-5 py-2.5 text-sm font-bold text-primary"
        >
          패스포트 보기
        </Link>
      </div>
    </section>
  );
}
