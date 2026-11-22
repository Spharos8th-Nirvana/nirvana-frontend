"use client";

import { useState } from "react";
import Link from "next/link";
import type { Program } from "@/data/programs";

type ProgramFilterProps = {
  programs: Program[];
};

export default function ProgramFilter({ programs }: ProgramFilterProps) {
  const [languageOnly, setLanguageOnly] = useState(false);

  const filteredPrograms = languageOnly
    ? programs.filter((program) => program.languageSupport)
    : programs;

  return (
    <section>
      {/* 외국어 지원 필터 */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#777777]">
        <input
          type="checkbox"
          checked={languageOnly}
          onChange={(e) => setLanguageOnly(e.target.checked)}
          className="h-4 w-4 accent-[#173F35]"
        />
        외국어 가능 프로그램만 보기
      </label>

      {/* 프로그램 목록 */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-4">
          <h2 className="text-xl font-bold text-[#173F35]">프로그램 검색 결과</h2>

          <p className="text-sm text-[#999999]">총 {filteredPrograms.length}개</p>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.id}`}
                className="group flex h-full flex-col border border-[#EAEAE5] bg-white transition-colors duration-300 hover:border-[#173F35]"
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
                  <span className="text-xs font-semibold text-[#B75D32]">{program.category}</span>

                  <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-[#333A35] transition-colors group-hover:text-[#173F35]">
                    {program.name}
                  </h3>

                  <p className="mt-3 min-h-10 text-sm leading-6 text-[#777777]">{program.temple}</p>

                  {/* 가격 */}
                  <div className="mt-auto border-t border-[#EAEAE5] pt-5">
                    <p className="text-right text-base font-bold text-[#173F35]">
                      {program.price.toLocaleString("ko-KR")}원
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 border-y border-[#EAEAE5] bg-white px-5 py-16 text-center">
            <p className="text-lg font-semibold text-[#333A35]">검색 결과가 없습니다.</p>
            <p className="mt-3 text-sm text-[#777777]">다른 조건으로 검색해 보세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
