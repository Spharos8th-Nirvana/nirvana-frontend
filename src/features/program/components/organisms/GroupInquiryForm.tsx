"use client";

import { useState } from "react";
import Link from "next/link";
import { previewTemples } from "@/features/guide/data/mock-screens";

const kinds = ["학교", "회사", "동호회·모임", "종교 단체", "기타"];

/** 시안 단체 문의. 화면에서만 확인하고 서버로 보내지 않습니다. */
export function GroupInquiryForm() {
  const [done, setDone] = useState<{ no: string; org: string; kind: string; temple: string; date: string; people: string } | null>(null);
  const [error, setError] = useState("");

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-2xl text-primary">단체 문의를 받았어요</h2>
        <p className="mt-2 text-sm text-muted">사찰과 일정을 확인한 뒤 연락드려요 (시안: 실제로 보내지 않아요).</p>
        <dl className="mt-4 space-y-1 text-sm">
          <div>접수번호 {done.no}</div>
          <div>단체 {done.org} ({done.kind})</div>
          <div>희망 사찰 {done.temple || "상관없음"}</div>
          <div>희망 날짜 {done.date}</div>
          <div>인원 {done.people}명</div>
        </dl>
        <div className="mt-4 flex gap-2">
          <Link href="/programs" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">프로그램 보기</Link>
          <Link href="/" className="rounded-full border px-4 py-2 text-sm">홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-border bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const org = String(data.get("org") ?? "").trim();
        const name = String(data.get("name") ?? "").trim();
        const tel = String(data.get("tel") ?? "").replace(/-/g, "");
        const mail = String(data.get("mail") ?? "").trim();
        const date = String(data.get("date") ?? "");
        const people = Number(data.get("people") ?? 0);
        const agree = data.get("agree") === "on";
        if (!org || !name) { setError("단체 이름과 담당자 이름을 넣어 주세요."); return; }
        if (!/^\d{9,11}$/.test(tel)) { setError("연락처를 숫자 9~11자리로 넣어 주세요."); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { setError("이메일 모양이 맞지 않아요."); return; }
        if (!date) { setError("희망 날짜를 골라 주세요."); return; }
        if (!(people >= 10)) { setError("단체 문의는 10명 이상부터예요."); return; }
        if (!agree) { setError("개인정보 동의에 체크해 주세요."); return; }
        const compact = date.replace(/-/g, "").slice(2);
        setError("");
        setDone({ no: `GR-${compact}-01`, org, kind: String(data.get("kind")), temple: String(data.get("temple") ?? ""), date, people: String(people) });
      }}
    >
      <label className="text-sm">단체 이름<input name="org" className="mt-1 w-full rounded border border-border px-3 py-2" placeholder="예: 너바나 중학교" /></label>
      <label className="text-sm">단체 종류
        <select name="kind" className="mt-1 w-full rounded border border-border px-3 py-2">{kinds.map((kind) => <option key={kind}>{kind}</option>)}</select>
      </label>
      <label className="text-sm">담당자 이름<input name="name" className="mt-1 w-full rounded border border-border px-3 py-2" /></label>
      <label className="text-sm">연락처<input name="tel" className="mt-1 w-full rounded border border-border px-3 py-2" placeholder="숫자만" /></label>
      <label className="text-sm">이메일<input name="mail" type="email" className="mt-1 w-full rounded border border-border px-3 py-2" placeholder="답변 받을 이메일" /></label>
      <label className="text-sm">희망 사찰
        <select name="temple" className="mt-1 w-full rounded border border-border px-3 py-2">
          <option value="">상관없음</option>
          {previewTemples.map((temple) => <option key={temple.id} value={temple.name}>{temple.name} ({temple.region})</option>)}
        </select>
      </label>
      <label className="text-sm">희망 날짜 (2주 뒤부터)<input name="date" type="date" className="mt-1 w-full rounded border border-border px-3 py-2" /></label>
      <label className="text-sm">인원<input name="people" type="number" min={10} max={200} placeholder="10명 이상" className="mt-1 w-full rounded border border-border px-3 py-2" /></label>
      <label className="text-sm">원하는 체험·요청 사항<textarea name="memo" className="mt-1 w-full rounded border border-border px-3 py-2" placeholder="예: 당일 3시간, 명상과 차담 위주" /></label>
      <label className="flex items-center gap-2 text-sm"><input name="agree" type="checkbox" />단체 문의를 위한 개인정보 수집·이용에 동의해요</label>
      {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
      <button type="submit" className="w-fit rounded-full bg-primary px-5 py-2 text-sm font-bold text-white">문의 보내기</button>
      <p className="text-xs text-muted">단체 문의 절차와 저장 방식은 팀 ERD에 아직 없어 확인이 필요해요.</p>
    </form>
  );
}
