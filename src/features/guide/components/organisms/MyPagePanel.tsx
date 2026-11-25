"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { demoUser, previewTemples } from "@/features/guide/data/mock-screens";
import { homePrograms } from "@/features/home/data/home-preview";
import { programs } from "@/features/program/data/programs";
import { temples } from "@/features/temple/data/temples";
import {
  likedProgramsSnapshot,
  likedTemplesSnapshot,
  likesServerSnapshot,
  parseLikedIds,
  subscribeLikes,
} from "@/features/guide/utils/preview-likes";
import {
  bookingRecordsSnapshot,
  parseBookingRecords,
  pendingPaymentServerSnapshot,
  subscribePendingPayment,
  type BookingStatus,
} from "@/features/booking/utils/pending-payment";

const tabs = [
  ["res", "예약 내역"],
  ["like", "찜한 프로그램"],
  ["temple", "관심 사찰"],
  ["info", "내 정보"],
] as const;

/** 시안 마이페이지. 예약·찜은 비어 있는 처음 상태입니다. */
const filters: { id: string; label: string; match: (status: BookingStatus) => boolean }[] = [
  { id: "all", label: "전체", match: () => true },
  { id: "up", label: "진행 예정", match: (status) => status === "결제대기" || status === "예약 확정" },
  { id: "done", label: "이용 완료", match: (status) => status === "이용 완료" },
  { id: "end", label: "취소·만료·노쇼", match: (status) => status === "취소 완료" || status === "만료" || status === "노쇼" },
];

export function MyPagePanel() {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("res");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState("all");
  const raw = useSyncExternalStore(subscribePendingPayment, bookingRecordsSnapshot, pendingPaymentServerSnapshot);
  const records = parseBookingRecords(raw);
  const likedProgramIds = parseLikedIds(useSyncExternalStore(subscribeLikes, likedProgramsSnapshot, likesServerSnapshot));
  const likedTempleIds = parseLikedIds(useSyncExternalStore(subscribeLikes, likedTemplesSnapshot, likesServerSnapshot));
  const likedPrograms = likedProgramIds.map((id) => {
    const team = programs.find((item) => item.id === id);
    if (team) return { id, title: team.name, href: `/programs/${id}` };
    const home = homePrograms.find((item) => item.id === id);
    return home ? { id, title: home.title, href: `/programs/${id}` } : null;
  }).filter((item): item is { id: number; title: string; href: string } => item !== null);
  const likedTemples = likedTempleIds.map((id) => temples.find((item) => item.id === id) ?? previewTemples.find((item) => item.id === id)).filter((item) => item !== undefined);

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
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-3 py-1 text-sm ${filter === item.id ? "bg-primary text-white" : "border"}`}>
                  {item.label} {records.filter((record) => item.match(record.status)).length}
                </button>
              ))}
            </div>
            {records.filter((record) => filters.find((item) => item.id === filter)?.match(record.status)).length === 0 ? (
              <>
                <p className="mt-3 font-bold">{records.length ? "이 상태의 예약이 없어요." : "아직 예약한 프로그램이 없어요."}</p>
                <Link href="/programs" className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">프로그램 보러 가기</Link>
              </>
            ) : (
              <ul className="mt-4 divide-y border-y border-border">
                {records.filter((record) => filters.find((item) => item.id === filter)?.match(record.status)).map((record) => (
                  <li key={record.id} className="py-3">
                    <Link href={`/mypage/bookings/${record.id}`} className="font-bold text-primary">{record.programName}</Link>
                    <p className="text-sm text-muted">{record.status} · {record.reservationNo} · {record.templeName} · {record.scheduleLabel} · {record.peopleLabel}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
        {tab === "like" ? (
          <>
            <h2 className="text-xl text-primary">찜한 프로그램</h2>
            {likedPrograms.length === 0 ? (
              <><p className="mt-3 font-bold">찜한 프로그램이 없어요.</p><p className="text-sm text-muted">프로그램 카드의 ♥를 눌러 보세요.</p></>
            ) : (
              <ul className="mt-3 space-y-2">{likedPrograms.map((item) => <li key={item.id}><Link href={item.href} className="font-bold text-primary">{item.title}</Link></li>)}</ul>
            )}
          </>
        ) : null}
        {tab === "temple" ? (
          <>
            <h2 className="text-xl text-primary">관심 사찰</h2>
            {likedTemples.length === 0 ? (
              <><p className="mt-3 font-bold">관심 사찰이 없어요.</p><p className="text-sm text-muted">사찰 화면에서 관심 사찰 등록을 눌러 보세요.</p></>
            ) : (
              <ul className="mt-3 space-y-2">{likedTemples.map((item) => <li key={item.id}><Link href={`/temples/${item.id}`} className="font-bold text-primary">{item.name}</Link></li>)}</ul>
            )}
          </>
        ) : null}
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
