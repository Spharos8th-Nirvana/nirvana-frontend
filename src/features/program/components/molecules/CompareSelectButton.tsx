"use client";

import { useEffect, useState } from "react";
import { COMPARISON_LIMIT, readComparisonIds, writeComparisonIds } from "@/features/program/utils/comparison";

type CompareSelectButtonProps = {
  programId: number;
};

/** 목록·상세에서 비교 바구니에 넣거나 빼는 버튼 */
export default function CompareSelectButton({ programId }: CompareSelectButtonProps) {
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => setSelected(readComparisonIds().includes(programId));
    sync();
    window.addEventListener("nirvana-comparison", sync);
    return () => window.removeEventListener("nirvana-comparison", sync);
  }, [programId]);

  const toggle = () => {
    const current = readComparisonIds();

    if (selected) {
      writeComparisonIds(current.filter((id) => id !== programId));
      setMessage("");
      return;
    }

    if (current.length >= COMPARISON_LIMIT) {
      setMessage("비교는 3개까지 담을 수 있어요.");
      return;
    }

    writeComparisonIds([...current, programId]);
    setMessage("");
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={selected}
        className={
          selected
            ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
            : "rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-ink"
        }
      >
        {selected ? "비교 선택됨" : "비교 선택"}
      </button>
      {message && (
        <span role="alert" className="text-xs font-semibold text-primary">
          {message}
        </span>
      )}
    </span>
  );
}
