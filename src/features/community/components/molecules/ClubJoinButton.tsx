"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  joinClub,
  joinedClubsServerSnapshot,
  joinedClubsSnapshot,
  leaveClub,
  parseJoinedClubs,
  subscribeJoinedClubs,
} from "@/features/community/utils/club-membership";
import { previewLoginServerSnapshot, previewLoginSnapshot, subscribePreviewLogin } from "@/features/guide/utils/preview-login";

/** 시안 동호회 가입·탈퇴. 이 브라우저에만 가입 상태를 남깁니다. */
export function ClubJoinButton({
  clubId,
  clubName,
  nextPath,
}: {
  clubId: number;
  clubName: string;
  nextPath: string;
}) {
  const router = useRouter();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [notice, setNotice] = useState("");
  const loggedIn = useSyncExternalStore(subscribePreviewLogin, previewLoginSnapshot, previewLoginServerSnapshot) === "1";
  const joined = parseJoinedClubs(
    useSyncExternalStore(subscribeJoinedClubs, joinedClubsSnapshot, joinedClubsServerSnapshot),
  ).includes(clubId);

  const askLogin = () => {
    setNotice("동호회 가입은 로그인한 뒤에 할 수 있어요.");
    router.push(`/login?next=${encodeURIComponent(nextPath)}`);
  };

  return (
    <div className="mt-4">
      {joined ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-subtle px-3 py-1 text-xs font-bold text-primary">가입한 동호회</span>
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            className="rounded-full border border-border px-4 py-2 text-sm font-bold"
          >
            탈퇴하기
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!loggedIn) {
              askLogin();
              return;
            }
            joinClub(clubId);
            setNotice(`${clubName}에 가입했어요. 이제 글을 쓸 수 있어요 (시안: 바로 가입).`);
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
        >
          가입하기
        </button>
      )}
      {confirmLeave ? (
        <div className="mt-3 border border-border bg-subtle p-4 text-sm">
          <p className="font-bold">{clubName}에서 탈퇴할까요?</p>
          <p className="mt-1 text-muted">탈퇴해도 내가 쓴 글은 남아 있어요. 다시 가입하면 글을 쓸 수 있어요.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                leaveClub(clubId);
                setConfirmLeave(false);
                setNotice(`${clubName}에서 탈퇴했어요.`);
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
            >
              탈퇴하기
            </button>
            <button type="button" onClick={() => setConfirmLeave(false)} className="rounded-full border border-border px-4 py-2 text-sm font-bold">
              그만두기
            </button>
          </div>
        </div>
      ) : null}
      {notice ? <p className="mt-3 text-sm text-primary">{notice}</p> : null}
    </div>
  );
}
