"use client";

import { useState, useSyncExternalStore } from "react";
import {
  likedProgramsSnapshot,
  likesServerSnapshot,
  parseLikedIds,
  subscribeLikes,
  toggleLikedProgram,
} from "@/features/guide/utils/preview-likes";
import { previewLoginSnapshot } from "@/features/guide/utils/preview-login";

/** 시안 프로그램 찜. 로그인 뒤에만 바뀝니다. */
export function LikeProgramButton({ programId, programName }: { programId: number; programName: string }) {
  const raw = useSyncExternalStore(subscribeLikes, likedProgramsSnapshot, likesServerSnapshot);
  const liked = parseLikedIds(raw).includes(programId);
  const [note, setNote] = useState("");

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        aria-pressed={liked}
        aria-label={`${programName} 찜하기`}
        onClick={() => {
          if (previewLoginSnapshot() !== "1") {
            setNote("찜은 로그인한 뒤에 쓸 수 있어요. 오른쪽 위 로그인을 눌러 보세요 (시안).");
            return;
          }
          toggleLikedProgram(programId);
          setNote(liked ? "찜을 풀었어요." : "찜 목록에 담았어요.");
        }}
        className={liked ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-ink"}
      >
        {liked ? "찜했어요" : "찜하기"}
      </button>
      {note ? <span className="text-xs text-primary">{note}</span> : null}
    </span>
  );
}
