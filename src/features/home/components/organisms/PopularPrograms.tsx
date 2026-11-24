"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { programs } from "@/features/program/data/programs";

const categories = ["전체", "템플스테이", "사찰음식", "선무도", "마음챙김"];

export function PopularPrograms() {
  const [favoritePrograms, setFavoritePrograms] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredPrograms =
    selectedCategory === "전체"
      ? programs
      : programs.filter((program) => program.category === selectedCategory);

  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* 섹션 제목 */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.25em]">
            CURATED FOR YOU
          </p>

          <div className="mt-3 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
              지금 인기 있는 체험
            </h2>

            <Link
              href="/programs"
              className="shrink-0 text-xs font-medium text-primary transition-all duration-200 hover:font-bold sm:text-sm"
            >
              모두 둘러보기 →
            </Link>
          </div>

          <p className="mt-3 text-xs leading-6 text-muted sm:text-sm">
            많은 이들이 찾는 특별한 사찰 체험을 만나보세요.
          </p>
        </div>

        {/* 카테고리 */}
        <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:mt-8 sm:px-0">
          <div className="flex w-max gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors duration-200 sm:px-5 ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-transparent text-primary hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 프로그램 카드 */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <article
                key={program.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg"
              >
                <Link
                  href={`/programs/${program.id}`}
                  aria-label={`${program.name} 상세 페이지로 이동`}
                  className="absolute inset-0 z-10"
                />
                {/* 프로그램 이미지 */}
                <div className="relative h-48 overflow-hidden sm:h-52 lg:h-56">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <button
                    type="button"
                    aria-label="찜하기"
                    aria-pressed={favoritePrograms.includes(program.id)}
                    onClick={() => {
                      setFavoritePrograms((current) =>
                        current.includes(program.id)
                          ? current.filter((id) => id !== program.id)
                          : [...current, program.id],
                      );
                    }}
                    className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(15,26,21,0.25)] shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95 ${
                      favoritePrograms.includes(program.id)
                        ? "text-[#D76855]"
                        : "text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill={
                        favoritePrograms.includes(program.id)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5a5.5 5.5 0 0 0 1-8.9Z" />
                    </svg>
                  </button>

                  <span className="absolute left-3 top-3 rounded bg-background px-3 py-1 text-xs text-primary">
                    {program.category}
                  </span>
                </div>

                {/* 프로그램 정보 */}
                <div className="p-4 sm:p-5">
                  <p className="text-xs text-muted">{program.temple}</p>

                  <h3 className="mt-2 h-14 overflow-hidden line-clamp-2 font-serif text-base font-semibold leading-7 text-primary sm:text-lg">
                    {program.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <p className="font-semibold text-primary">
                      ₩{Number(program.adultPrice).toLocaleString("ko-KR")}
                      <span className="ml-1 text-xs font-normal text-muted">
                        / 1인
                      </span>
                    </p>

                    <Link
                      href={`/programs/${program.id}`}
                      aria-label={`${program.name} 상세 페이지로 이동`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
                    >
                      →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold text-primary">
                준비 중인 프로그램입니다.
              </p>
              <p className="mt-2 text-sm text-muted">
                새로운 프로그램을 준비하고 있어요. 조금만 기다려 주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
