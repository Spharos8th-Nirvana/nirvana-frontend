"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clubs } from "@/features/guide/data/mock-screens";

export function ClubList() {
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const list = clubs.filter((club) => !query || `${club.name}${club.desc}${club.tags.join("")}`.includes(query));

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
      <p className="mb-4 text-sm">총 <b>{list.length}</b>개의 동호회</p>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((club) => (
          <Link key={club.id} href={`/community/clubs/${club.id}`} className="overflow-hidden rounded-2xl border border-border bg-white">
            <Image src={club.img} alt="" width={640} height={160} className="h-40 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs text-sage-07">{club.tags.join(" · ")}</p>
              <h2 className="mt-1 text-lg text-primary">{club.name}</h2>
              <p className="mt-1 text-sm text-muted">{club.desc}</p>
              <p className="mt-2 text-xs text-muted">회원 {club.members}명 · {club.temple}</p>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 ? <p className="mt-6 font-bold">찾는 동호회가 없어요.</p> : null}
      <p className="mt-6 text-xs text-muted">동호회 정보는 시안 예시예요. 팀 ERD에 동호회 테이블이 아직 없어서, 동호회를 누가 만들고 어떻게 저장할지 확인이 필요해요.</p>
    </div>
  );
}
