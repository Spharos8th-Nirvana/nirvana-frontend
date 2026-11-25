"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clubs } from "@/features/guide/data/mock-screens";
import { previewLoginServerSnapshot, previewLoginSnapshot, subscribePreviewLogin } from "@/features/guide/utils/preview-login";
import {
  joinedClubsServerSnapshot,
  joinedClubsSnapshot,
  parseJoinedClubs,
  subscribeJoinedClubs,
} from "@/features/community/utils/club-membership";

export function ClubList() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const loggedIn = useSyncExternalStore(subscribePreviewLogin, previewLoginSnapshot, previewLoginServerSnapshot) === "1";
  const joined = parseJoinedClubs(
    useSyncExternalStore(subscribeJoinedClubs, joinedClubsSnapshot, joinedClubsServerSnapshot),
  );
  const list = clubs.filter((club) => {
    if (mineOnly && !joined.includes(club.id)) {
      return false;
    }
    return !query || `${club.name}${club.desc}${club.tags.join("")}`.includes(query);
  });

  return (
    <div>
      <form
        className="mb-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(keyword.trim());
        }}
      >
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="동호회 이름이나 소개로 찾기" className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2" />
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">찾기</button>
      </form>
      <button
        type="button"
        aria-pressed={mineOnly}
        onClick={() => {
          if (!loggedIn) {
            router.push("/login?next=%2Fcommunity%2Fclubs");
            return;
          }
          setMineOnly((current) => !current);
        }}
        className={mineOnly ? "mb-4 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white" : "mb-4 rounded-full border border-border px-4 py-2 text-sm font-bold"}
      >
        내가 가입한 동호회만
      </button>
      <p className="mb-4 text-sm">총 <b>{list.length}</b>개의 동호회</p>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((club) => (
          <Link key={club.id} href={`/community/clubs/${club.id}`} className="overflow-hidden rounded-2xl border border-border bg-white">
            <span className="relative block">
              <Image src={club.img} alt="" width={640} height={160} className="h-40 w-full object-cover" />
              {joined.includes(club.id) ? (
                <span className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-xs font-bold text-primary">가입함</span>
              ) : null}
            </span>
            <div className="p-4">
              <p className="text-xs text-sage-07">{club.tags.join(" · ")}</p>
              <h2 className="mt-1 text-lg text-primary">{club.name}</h2>
              <p className="mt-1 text-sm text-muted">{club.desc}</p>
              <p className="mt-2 text-xs text-muted">회원 {club.members + (joined.includes(club.id) ? 1 : 0)}명 · {club.temple}</p>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-6 font-bold">{mineOnly ? "아직 가입한 동호회가 없어요." : "찾는 동호회가 없어요."}</p>
      ) : null}
      <p className="mt-6 text-xs text-muted">동호회 정보는 시안 예시예요. 팀 ERD에 동호회 테이블이 아직 없어서, 동호회를 누가 만들고 어떻게 저장할지 확인이 필요해요.</p>
    </div>
  );
}
