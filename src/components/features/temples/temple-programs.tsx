"use client";

import { useState } from "react";
import Link from "next/link";
import type { Program } from "@/data/programs";

type TempleProgramsProps = {
  programs: Program[];
};

export default function TemplePrograms({ programs }: TempleProgramsProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", ...new Set(programs.map((program) => program.category))];

  const filteredPrograms =
    selectedCategory === "전체"
      ? programs
      : programs.filter((program) => program.category === selectedCategory);

  return (
    <section>
      {/* 프로그램 종류 선택 */}
      <div className="mb-10">
        <label
          htmlFor="program-category"
          className="mb-3 block text-sm font-semibold text-[#173F35]"
        >
          프로그램 종류
        </label>

        <select
          id="program-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full max-w-xl rounded-lg bg-[#EEE5D3] px-5 py-4 text-sm text-[#173F35] outline-none focus:ring-2 focus:ring-[#173F35]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "전체" ? "종류 선택" : category}
            </option>
          ))}
        </select>
      </div>

      {/* 프로그램 목록 */}
      <div className="space-y-6">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <article
              key={program.id}
              className="relative flex flex-col overflow-hidden bg-[#EEE5D3] sm:flex-row"
            >
              {/* 프로그램 이미지 */}
              <div
                role="img"
                aria-label={program.name}
                className="h-52 w-full shrink-0 bg-cover bg-center sm:h-auto sm:w-40 md:w-52"
                style={{
                  backgroundImage: `url("${program.image}")`,
                }}
              />

              {/* 프로그램 정보 */}
              <div className="relative flex flex-1 flex-col p-5 sm:p-7">
                <span className="absolute right-0 top-0 bg-[#F7F3EA] px-4 py-2 text-xs font-semibold text-[#173F35]">
                  체험형
                </span>

                <span className="text-xs font-semibold text-[#B75D32]">{program.category}</span>

                <h3 className="mt-2 pr-16 text-xl font-bold text-[#173F35]">{program.name}</h3>

                <p className="mt-3 text-sm font-semibold text-[#756F62]">{program.date}</p>

                <div className="mt-3 flex-1 bg-white p-4">
                  <p className="text-sm leading-7 text-[#756F62]">{program.description}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/programs/${program.id}`}
                    className="rounded-sm bg-[#F7F3EA] px-5 py-3 text-sm font-semibold text-[#173F35] transition hover:font-bold"
                  >
                    예약하러 가기
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="border border-dashed border-[#D8CCB8] px-5 py-16 text-center">
            <p className="text-[#173F35]">해당 종류의 프로그램이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
