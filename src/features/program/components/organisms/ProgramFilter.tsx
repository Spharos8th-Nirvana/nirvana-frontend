"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Program } from "@/features/program/data/programs";
import { saveProgramListUrl } from "@/features/program/utils/list-url";
import CompareSelectButton from "@/features/program/components/molecules/CompareSelectButton";
import { LikeProgramButton } from "@/features/guide/components/molecules/LikeProgramButton";
import ComparisonBar from "@/features/program/components/molecules/ComparisonBar";

type ProgramFilterProps = {
  programs: Program[];
};

export default function ProgramFilter({ programs }: ProgramFilterProps) {
  const [languageOnly, setLanguageOnly] = useState(false);

  // 상세 페이지의 "목록으로 돌아가기"가 지금 보는 목록(검색 조건 포함)으로 돌아오도록 기억합니다.
  useEffect(() => {
    saveProgramListUrl(`${window.location.pathname}${window.location.search}`);
  }, []);

  const filteredPrograms = languageOnly
    ? programs.filter((program) => program.languageSupport)
    : programs;

  return (
    <section>
      {/* 외국어 지원 필터 */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={languageOnly}
          onChange={(e) => setLanguageOnly(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        외국어 가능 프로그램만 보기
      </label>

      <ComparisonBar />

      {/* 프로그램 목록 */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold text-primary">프로그램 검색 결과</h2>

          <p className="text-sm text-muted/70">
            총 {filteredPrograms.length}개
          </p>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="flex h-full flex-col border border-border bg-white"
              >
              <Link
                href={`/programs/${program.id}`}
                className="group flex h-full flex-col transition-colors duration-300 hover:border-primary"
              >
                {/* 프로그램 이미지 */}
                <div
                  role="img"
                  aria-label={program.name}
                  className="aspect-[5/4] w-full shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${program.image}")`,
                  }}
                />

                {/* 프로그램 정보 */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold text-primary">
                    {program.category}
                  </span>

                  <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-ink transition-colors group-hover:text-primary">
                    {program.name}
                  </h3>

                  <p className="mt-3 min-h-10 text-sm leading-6 text-muted">
                    {program.temple}
                  </p>

                  {/* 가격 */}
                  <div className="mt-auto border-t border-border pt-5">
                    <p className="text-right text-base font-bold text-primary">
                      {program.adultPrice.toLocaleString("ko-KR")}원
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                <LikeProgramButton programId={program.id} programName={program.name} />
                <CompareSelectButton programId={program.id} />
              </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 border-y border-border bg-white px-5 py-16 text-center">
            <p className="text-lg font-semibold text-ink">
              검색 결과가 없습니다.
            </p>
            <p className="mt-3 text-sm text-muted">
              다른 조건으로 검색해 보세요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
