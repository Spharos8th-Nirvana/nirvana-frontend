"use client";

import { useState } from "react";
import Link from "next/link";
import { demoUser } from "@/features/guide/data/mock-screens";

const tabs = [
  ["res", "예약 내역"],
  ["like", "찜한 프로그램"],
  ["temple", "관심 사찰"],
  ["info", "내 정보"],
] as const;

/** 시안 마이페이지. 예약·찜은 비어 있는 처음 상태입니다. */
export function MyPagePanel() {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("res");
  const [note, setNote] = useState("");

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <nav aria-label="마이페이지 메뉴" className="flex flex-col gap-2">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)} className={`rounded-lg px-3 py-2 text-left text-sm ${tab === id ? "bg-primary text-white" : "bg-white"}`}>{label}</button>
        ))}
        <Link href="/mypage/passport" className="rounded-lg bg-white px-3 py-2 text-sm">사찰 패스포트</Link>
      </nav>
      <div>
        {tab === "res" ? (
          <>
            <h2 className="text-xl text-primary">예약 내역</h2>
            <p className="mt-3 font-bold">아직 예약한 프로그램이 없어요.</p>
            <Link href="/programs" className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">프로그램 보러 가기</Link>
          </>
        ) : null}
        {tab === "like" ? <><h2 className="text-xl text-primary">찜한 프로그램</h2><p className="mt-3 font-bold">찜한 프로그램이 없어요.</p><p className="text-sm text-muted">프로그램 카드의 ♥를 눌러 보세요.</p></> : null}
        {tab === "temple" ? <><h2 className="text-xl text-primary">관심 사찰</h2><p className="mt-3 font-bold">관심 사찰이 없어요.</p><p className="text-sm text-muted">사찰 화면에서 관심 사찰 등록을 눌러 보세요.</p></> : null}
        {tab === "info" ? (
          <>
            <h2 className="text-xl text-primary">내 정보</h2>
            <dl className="mt-3 space-y-1 text-sm">
              <div>이름 {demoUser.name}</div>
              <div>아이디 {demoUser.id}</div>
              <div>이메일 {demoUser.email}</div>
            </dl>
            <p className="mt-2 text-xs text-muted">시안 예시 회원 정보예요. 실제로 로그인된 계정이 아닙니다.</p>
            <button type="button" className="mt-3 text-sm underline" onClick={() => setNote("회원 탈퇴 절차는 팀 인증 담당과 확인이 필요해요 (시안).")}>회원 탈퇴</button>
            {note ? <p className="mt-2 text-sm" role="status">{note}</p> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
