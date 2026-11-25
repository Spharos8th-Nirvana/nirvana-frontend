"use client";

import { useEffect, useState } from "react";
import PhotoViewer from "@/features/community/components/molecules/PhotoViewer";

type TempleImageSliderProps = {
  templeName: string;
};

const images = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
];

export default function TempleImageSlider({ templeName }: TempleImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewer, setViewer] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section
      className="relative mt-10 h-[280px] overflow-hidden rounded-2xl md:h-[450px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label={`${templeName} 대표 사진`}
    >
      {images.map((image, index) => (
        <div
          key={image}
          role="img"
          aria-label={`${templeName} 사진 ${index + 1}`}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url("${image}")` }}
        />
      ))}

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="이전 사진"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-4 py-2 text-white transition hover:bg-black/60"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="다음 사진"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-4 py-2 text-white transition hover:bg-black/60"
      >
        ›
      </button>

      <button
        type="button"
        onClick={() => setViewer(true)}
        className="absolute bottom-5 right-5 z-10 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink"
      >
        크게 보기
      </button>
      {viewer ? (
        <PhotoViewer images={images} start={currentIndex} title={templeName} onClose={() => setViewer(false)} />
      ) : null}

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`${index + 1}번 사진 보기`}
            className={`h-2 rounded-full transition-all ${
              currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
