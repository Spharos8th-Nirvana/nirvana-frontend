"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 시안 첫 화면 사진 (app.js IMG.hero)
const heroImage = "/images/photo-18464fadd2d70532.jpg";

export function HeroSection() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedPeople, setSelectedPeople] = useState("");
  const [searchError, setSearchError] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    const hasDate = Boolean(checkIn || checkOut);

    if (hasDate && !selectedPeople) {
      setSearchError("날짜를 고르셨다면 누구와 가는지(인원)도 골라 주세요.");
      return;
    }

    if (selectedPeople && (!checkIn || !checkOut)) {
      setSearchError("인원을 고르셨다면 체크인·체크아웃 날짜도 골라 주세요.");
      return;
    }

    if (checkIn && checkOut && checkOut < checkIn) {
      setSearchError("체크아웃 날짜는 체크인 날짜보다 뒤여야 해요.");
      return;
    }

    setSearchError("");

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    // 목록은 기존처럼 date 하나만 받습니다. 체크인 날짜를 그 값으로 넘깁니다.
    if (checkIn) {
      params.set("date", checkIn);
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
            <span className="mb-3 block text-xs font-bold text-primary">
              어디로 떠날까요?
            </span>

            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

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
            <span className="mb-3 block text-xs font-bold text-primary">
              언제 떠날까요?
            </span>

            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>

              <span className="flex min-w-0 gap-2">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value && checkOut < e.target.value) {
                      setCheckOut("");
                    }
                  }}
                  aria-label="체크인 날짜"
                  className="min-w-0 w-full cursor-pointer bg-transparent text-sm text-primary outline-none"
                />
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) => setCheckOut(e.target.value)}
                  aria-label="체크아웃 날짜"
                  className="min-w-0 w-full cursor-pointer bg-transparent text-sm text-primary outline-none"
                />
              </span>
            </div>
          </label>

          {/* 인원 선택 */}
          <label className="min-w-0 border-t border-border px-3 py-4 md:border-l md:border-t-0 md:px-5 md:py-2">
            <span className="mb-3 block text-xs font-bold text-primary">
              누구와 함께?
            </span>

            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
        {searchError && (
          <p role="alert" className="mx-auto mt-3 max-w-5xl text-sm font-semibold text-primary">
            {searchError}
          </p>
        )}
      </section>
    </>
  );
}
