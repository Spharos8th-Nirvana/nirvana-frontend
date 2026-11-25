"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, SearchIcon, UsersIcon } from "@/shared/components/ui/icons";

const heroImage = "https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg";

export function HeroSection() {
  const [selectedDate, setSelectedDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedPeople, setSelectedPeople] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    if (selectedDate) {
      params.set("date", selectedDate);
    }

    if (selectedPeople) {
      params.set("people", selectedPeople);
    }

    router.push(`/programs?${params.toString()}`);
  };

  return (
    <>
      {/* 메인 비주얼 */}
      <section
        data-page-hero
        className="relative flex min-h-[420px] items-center justify-center bg-cover bg-center px-5 py-16 sm:min-h-[480px] md:min-h-[560px] md:px-6 md:py-20"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 max-w-3xl text-center">
          <p className="text-[10px] font-medium tracking-[0.25em] text-[#E7B84B] sm:text-xs sm:tracking-[0.3em]">
            TEMPLE EXPERIENCE
          </p>

          <h1 className="mt-5 text-[28px] font-semibold leading-snug text-white sm:text-[32px] md:mt-6 md:text-[40px]">
            고요한 사찰에서의 하루
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-white/90 sm:text-sm md:mt-6 md:text-base">
            바쁜 일상에서 벗어나 나를 만나는 특별한 시간을 경험해 보세요.
          </p>
        </div>
      </section>

      {/* 프로그램 검색 */}
      <section className="bg-background px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-[0_12px_35px_rgba(23,63,53,0.10)] sm:p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:gap-0 md:p-3">
          {/* 지역 및 사찰 검색 */}
          <label className="min-w-0 px-3 py-2 md:px-5">
            <span className="mb-3 block text-xs font-bold text-primary">어디로 떠날까요?</span>

            <div className="flex items-center gap-3">
              <SearchIcon size={21} className="text-primary" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="지역 또는 사찰 이름"
                className="min-w-0 w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted/70"
              />
            </div>
          </label>

          {/* 날짜 선택 */}
          <label className="min-w-0 border-t border-border px-3 py-4 md:border-l md:border-t-0 md:px-5 md:py-2">
            <span className="mb-3 block text-xs font-bold text-primary">언제 떠날까요?</span>

            <div className="flex it{ems-center gap-3">
              <CalendarIcon size={21} className="text-muted" />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="체험 날짜 선택"
                className="min-w-0 w-full cursor-pointer bg-transparent text-sm text-primary outline-none"
              />
            </div>
          </label>

          {/* 인원 선택 */}
          <label className="min-w-0 border-t border-border px-3 py-4 md:border-l md:border-t-0 md:px-5 md:py-2">
            <span className="mb-3 block text-xs font-bold text-primary">누구와 함께?</span>

            <div className="flex items-center gap-3">
              <UsersIcon size={21} className="text-muted" />

              <select
                value={selectedPeople}
                onChange={(e) => setSelectedPeople(e.target.value)}
                aria-label="참여 인원 선택"
                className="min-w-0 w-full bg-transparent text-sm text-primary outline-none"
              >
                <option value="" disabled>
                  인원 선택
                </option>
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명 이상</option>
              </select>
            </div>
          </label>

          {/* 검색 버튼 */}
          <div className="border-t border-border pt-3 md:border-l md:border-t-0 md:pl-3 md:pt-0">
            <button
              type="button"
              onClick={handleSearch}
              aria-label="프로그램 검색"
              className="flex h-14 w-full items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover md:w-14"
            >
              <SearchIcon size={23} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
