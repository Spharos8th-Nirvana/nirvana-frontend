"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/features/guide/data/mock-screens";

const categories = ["전체", "예약·취소", "참가", "시설·프로그램", "템플스테이 상식"];

export function SupportFaq() {
  const [category, setCategory] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const list = faqs.filter((item) => (category === "전체" || item[0] === category) && (!query || `${item[1]}${item[2]}`.includes(query)));

  return (
    <div>
      <form className="mb-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); setQuery(keyword.trim()); }}>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="궁금한 내용을 검색해 보세요 (예: 환불)" aria-label="자주 묻는 질문 검색" className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2" />
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">검색</button>
      </form>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-sm ${category === item ? "bg-primary text-white" : "bg-white"}`}>{item}</button>
        ))}
      </div>
      <div className="border-t border-border">
        {list.map((item) => (
          <details key={item[1]} className="border-b border-border py-3">
            <summary className="cursor-pointer font-bold text-primary">Q · {item[0]} · {item[1]}</summary>
            <p className="mt-2 text-sm leading-7 text-muted">A. {item[2]}</p>
          </details>
        ))}
      </div>
      <div className="mt-6">
        <p className="font-bold">{list.length ? "찾는 답이 없나요?" : "찾는 질문이 없어요."}</p>
        <p className="text-sm text-muted">1:1 문의를 남기면 운영팀이 답해 드려요.</p>
        <Link href="/support/inquiry" className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">1:1 문의하기</Link>
      </div>
      <p className="mt-4 text-xs text-muted">질문과 답은 시안 예시예요. 실제 운영 규칙과 확인이 필요해요.</p>
    </div>
  );
}
