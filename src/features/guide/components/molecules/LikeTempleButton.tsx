"use client";

import { useState, useSyncExternalStore } from "react";
import {
  likedTemplesSnapshot,
  likesServerSnapshot,
  parseLikedIds,
  subscribeLikes,
  toggleLikedTemple,
} from "@/features/guide/utils/preview-likes";
import { previewLoginSnapshot } from "@/features/guide/utils/preview-login";

/** 시안 관심 사찰. 로그인 뒤에만 바뀝니다. */
export function LikeTempleButton({ templeId, templeName }: { templeId: number; templeName: string }) {
  const raw = useSyncExternalStore(subscribeLikes, likedTemplesSnapshot, likesServerSnapshot);
  const liked = parseLikedIds(raw).includes(templeId);
  const [note, setNote] = useState("");

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        aria-pressed={liked}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (previewLoginSnapshot() !== "1") {
            setNote("관심 사찰은 로그인한 뒤에 등록할 수 있어요. 오른쪽 위 로그인을 눌러 보세요 (시안).");
            return;
          }
          toggleLikedTemple(templeId);
          setNote(liked ? `${templeName} 관심 등록을 풀었어요.` : `${templeName}을(를) 관심 사찰로 등록했어요.`);
        }}
        className={liked ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-ink"}
      >
        {liked ? "관심 사찰" : "관심 사찰 등록"}
      </button>
      {note ? <span className="text-xs text-primary">{note}</span> : null}
    </span>
  );
}
