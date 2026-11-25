"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readComparisonIds } from "@/features/program/utils/comparison";

/** 목록 위쪽에 담긴 개수와 비교 화면 이동을 보여 줍니다. */
export default function ComparisonBar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readComparisonIds().length);
    sync();
    window.addEventListener("nirvana-comparison", sync);
    return () => window.removeEventListener("nirvana-comparison", sync);
  }, []);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-border bg-white px-4 py-3">
      <p className="text-sm font-bold text-ink">비교 후보 {count} / 3</p>
      {count >= 2 ? (
        <Link href="/programs/compare" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
          비교하기
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="rounded-full bg-subtle px-4 py-2 text-sm font-bold text-muted"
        >
          비교하기
        </button>
      )}
    </div>
  );
}
