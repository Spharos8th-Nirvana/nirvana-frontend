"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { homeCategories, homePrograms } from "@/features/home/data/home-preview";
import {
  likedProgramsSnapshot,
  likesServerSnapshot,
  parseLikedIds,
  subscribeLikes,
  toggleLikedProgram,
} from "@/features/guide/utils/preview-likes";
import { previewLoginSnapshot } from "@/features/guide/utils/preview-login";

export function PopularPrograms() {
  const likedRaw = useSyncExternalStore(subscribeLikes, likedProgramsSnapshot, likesServerSnapshot);
  const favoritePrograms = parseLikedIds(likedRaw);
  const [likeNote, setLikeNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 시안과 같이 분류로 거른 뒤 찜 수 상위 3개만 보여 줍니다.
  const filteredPrograms = homePrograms
    .filter((program) => selectedCategory === "전체" || program.cat === selectedCategory)
    .sort((a, b) => b.favoriteCount - a.favoriteCount || a.id - b.id)
    .slice(0, 3);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 md:px-10 md:py-24" aria-labelledby="h-prog">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="h-prog" className="text-[28px] font-bold text-primary md:text-4xl">
              지금 인기 있는 체험
            </h2>
            <p className="mt-2 text-muted">많은 분들이 선택한, 특별한 사찰 체험을 만나보세요.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="체험 분류">
            {homeCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-5 py-2 text-sm ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-ink-nav hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => {
              const liked = favoritePrograms.includes(program.id);
              return (
                <article
                  key={program.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <Link href={`/programs/${program.id}`} aria-label={`${program.title} 상세`} className="absolute inset-0 z-10" />
                  <div className="relative aspect-[4/3] overflow-hidden bg-subtle">
                    <Image
                      src={program.img}
                      alt={`${program.title} 사진`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-primary">
                      {program.badge}
                    </span>
                    <button
                      type="button"
                      aria-label={`${program.title} 찜하기`}
                      aria-pressed={liked}
                      onClick={() => {
                        if (previewLoginSnapshot() !== "1") {
                          setLikeNote("찜은 로그인한 뒤에 쓸 수 있어요. 오른쪽 위 로그인을 눌러 보세요 (시안).");
                          return;
                        }
                        toggleLikedProgram(program.id);
                        setLikeNote(liked ? "찜을 풀었어요." : "찜 목록에 담았어요.");
                      }}
                      className={`absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full ${
                        liked ? "bg-white text-[#d6453b]" : "bg-primary/35 text-white"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <span className="w-fit rounded-full bg-sage-05 px-2 py-0.5 text-[11px] font-bold text-sage-07">
                      {program.cat}
                    </span>
                    <h3 className="text-[17px] leading-snug text-primary">{program.title}</h3>
                    <p className="text-[13.5px] leading-relaxed text-muted">{program.desc}</p>
                    <p className="text-[13px] text-muted">
                      {program.temple} · {program.region}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                      <p className="text-lg font-extrabold text-primary">
                        {program.price.toLocaleString("ko-KR")}원
                        <small className="ml-1 text-xs font-normal text-muted">1인 기준</small>
                      </p>
                      <span className="text-[13px] text-muted">
                        <b className="text-[#c9a45c]">♥ {program.favoriteCount}</b> 찜
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="col-span-full py-10 text-center text-muted">이 분류에는 아직 체험이 없어요.</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">가격은 성인 1인 기준이며, 가격과 찜 순위는 시안 예시예요. {likeNote}</p>
          <Link href="/programs" className="text-sm font-medium text-primary">
            모든 체험 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
