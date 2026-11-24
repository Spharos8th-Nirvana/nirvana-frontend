import Image from "next/image";
import Link from "next/link";
import type { Program } from "@/features/program/data/programs";
import { formatStay, formatWon } from "@/features/program/utils/booking";

type RelatedProgramsProps = {
  programs: Program[];
};

/** 프로그램 상세 하단 "이런 쉼도 만나보세요." (피그마 PC B · 03 체험 상세) */
export default function RelatedPrograms({ programs }: RelatedProgramsProps) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-programs-title" className="mt-24">
      <h2 id="related-programs-title" className="text-2xl font-bold text-ink">
        이런 쉼도 만나보세요.
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {programs.map((program) => (
          <li key={program.id}>
            <Link
              href={`/programs/${program.id}`}
              className="group flex h-full min-h-[170px] overflow-hidden rounded-lg bg-subtle transition-colors hover:bg-sage-05"
            >
              <div className="relative w-[38%] shrink-0 overflow-hidden">
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 20vw, 38vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="text-xs text-muted">
                  {program.temple} · {program.category} · {formatStay(program.nights)}
                </p>
                <h3 className="mt-3 line-clamp-2 font-bold leading-6 text-ink">{program.name}</h3>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <p className="text-lg font-bold text-ink">{formatWon(program.adultPrice)}</p>
                  <span
                    aria-hidden="true"
                    className="text-lg text-ink transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
