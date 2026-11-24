"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";

type ProgramGalleryProps = {
  images: string[];
  name: string;
  /** 큰 사진 위 한 줄 소개 캡션 */
  caption: string;
};

/** 상단에 보여줄 사진 최대 장수 (큰 사진 1장 + 작은 사진 2장) */
const MAX_GALLERY = 3;
/** 이 거리(px) 이상 옆으로 밀면 사진을 넘깁니다. */
const SWIPE_THRESHOLD = 50;

/**
 * 프로그램 상세 사진 (피그마: 큰 사진 + 작은 사진)
 * - 3장: 왼쪽 큰 사진, 오른쪽 작은 사진 2장 / 2장: 오른쪽 1장 / 1장: 가로로 긴 사진
 * - 사진을 누르면 화면 가득 크게 보기 (좌우 버튼, 키보드 ← →, 휴대폰 밀어 넘기기, Esc로 닫기)
 */
export default function ProgramGallery({ images, name, caption }: ProgramGalleryProps) {
  const photos = images.slice(0, MAX_GALLERY);
  const total = photos.length;
  const [main, ...rest] = photos;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  // 크게 보는 동안 뒤 페이지 스크롤을 막습니다.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!main) {
    return null;
  }

  const open = (index: number) => {
    setOpenIndex(index);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const move = (step: number) => {
    setOpenIndex((index) => (index === null ? index : (index + step + total) % total));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined) {
      return;
    }
    const distance = endX - startX;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      move(distance < 0 ? 1 : -1);
    }
  };

  const thumbButtonClass =
    "group relative block h-full w-full overflow-hidden rounded-2xl bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const thumbImageClass = "object-cover transition-transform duration-500 group-hover:scale-[1.03]";

  return (
    <>
      <div
        className={`mt-8 grid gap-3 sm:gap-4 ${
          rest.length > 0 ? "grid-cols-2 lg:grid-cols-[2fr_1fr] lg:grid-rows-2" : "grid-cols-1"
        }`}
      >
        {/* 큰 사진 + 한 줄 소개 캡션 */}
        <div
          className={`col-span-2 h-[240px] sm:h-[340px] lg:h-[460px] ${
            rest.length > 0 ? "lg:col-span-1 lg:row-span-2" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => open(0)}
            aria-label={`사진 1 크게 보기 (전체 ${total}장)`}
            className={thumbButtonClass}
          >
            <Image
              src={main}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className={thumbImageClass}
            />
            <span className="absolute bottom-4 left-4 right-4 w-fit max-w-xl rounded-xl bg-white/90 px-4 py-2 text-left text-xs leading-5 text-ink backdrop-blur-sm sm:bottom-5 sm:left-5 sm:text-sm">
              {caption}
            </span>
          </button>
        </div>

        {/* 작은 사진 */}
        {rest.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`h-[120px] sm:h-[180px] lg:h-auto ${
              rest.length === 1 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => open(index + 1)}
              aria-label={`사진 ${index + 2} 크게 보기 (전체 ${total}장)`}
              className={thumbButtonClass}
            >
              <Image
                src={src}
                alt={`${name} 사진 ${index + 2}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className={thumbImageClass}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 크게 보기 (브라우저 기본 대화상자: 포커스 가두기와 Esc 닫기를 브라우저가 처리) */}
      <dialog
        ref={dialogRef}
        aria-label={`${name} 사진 크게 보기`}
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          // 사진 바깥(검은 배경)을 누르면 닫습니다.
          if (event.target === event.currentTarget) {
            close();
          }
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col bg-black/90 p-0 text-white backdrop:bg-black/70 open:flex"
      >
        {openIndex !== null && (
          <>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm font-medium" aria-live="polite">
                {openIndex + 1} / {total}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div
              className="relative flex-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close();
                }
              }}
            >
              {/* 고화질 사진을 불러오는 동안 보이는 로딩 표시 (사진이 뜨면 가려집니다) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white motion-reduce:animate-none" />
              </div>

              <Image
                key={photos[openIndex]}
                src={photos[openIndex]}
                alt={openIndex === 0 ? name : `${name} 사진 ${openIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain px-4 sm:px-20"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="이전 사진"
                    className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl transition hover:bg-white/20 sm:left-6"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="다음 사진"
                    className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl transition hover:bg-white/20 sm:right-6"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <p className="px-5 py-4 text-center text-sm text-white/80">{name}</p>
          </>
        )}
      </dialog>
    </>
  );
}
