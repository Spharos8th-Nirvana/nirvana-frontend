"use client";

import { useEffect, useState } from "react";

/** 시안 사진 크게 보기. 이전·다음·닫기를 지원합니다. */
export default function PhotoViewer({
  images,
  start,
  title,
  onClose,
}: {
  images: string[];
  start: number;
  title: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(start);
  const current = (index + images.length) % images.length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setIndex((value) => value - 1);
      if (event.key === "ArrowRight") setIndex((value) => value + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 사진 크게 보기`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute right-4 top-4 text-2xl text-white">×</button>
      <button type="button" aria-label="이전 사진" onClick={() => setIndex((value) => value - 1)} className="absolute left-4 text-3xl text-white">‹</button>
      <div
        role="img"
        aria-label={`${title} 사진 ${current + 1}`}
        className="h-[70vh] w-full max-w-3xl bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${images[current]}")` }}
      />
      <button type="button" aria-label="다음 사진" onClick={() => setIndex((value) => value + 1)} className="absolute right-4 text-3xl text-white">›</button>
      <p className="absolute bottom-6 text-sm text-white">{current + 1} / {images.length}</p>
    </div>
  );
}
