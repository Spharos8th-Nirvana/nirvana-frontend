"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { safeNextPath, setPreviewLogin } from "@/features/guide/utils/preview-login";

/** 시안 로그인. 계정을 확인하거나 비밀번호를 저장하지 않습니다. */
export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const next = safeNextPath(nextPath);
  const [tab, setTab] = useState<"member" | "guest">("member");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-6">
      <div className="mb-4 flex gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "member"} onClick={() => setTab("member")} className={`rounded-full px-3 py-1.5 text-sm ${tab === "member" ? "bg-primary text-white" : "border"}`}>회원 로그인</button>
        <button type="button" role="tab" aria-selected={tab === "guest"} onClick={() => setTab("guest")} className={`rounded-full px-3 py-1.5 text-sm ${tab === "guest" ? "bg-primary text-white" : "border"}`}>비회원 예약 조회</button>
      </div>
      {nextPath ? <p className="mb-3 text-sm text-muted">로그인하면 보던 화면으로 돌아가요.</p> : null}
      {tab === "member" ? (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (!String(data.get("id") ?? "").trim()) { setError("아이디를 넣어 주세요."); return; }
            if (!String(data.get("pw") ?? "")) { setError("비밀번호를 넣어 주세요."); return; }
            setPreviewLogin(true);
            router.push(next);
          }}
        >
          <label className="text-sm">아이디<input name="id" className="mt-1 w-full rounded border px-3 py-2" placeholder="아이디를 넣어 주세요" /></label>
          <label className="text-sm">비밀번호<input name="pw" type="password" autoComplete="off" className="mt-1 w-full rounded border px-3 py-2" placeholder="비밀번호를 넣어 주세요" /></label>
          <label className="text-sm"><input type="checkbox" /> 아이디 저장</label>
          {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
          <button type="submit" className="rounded-full bg-primary py-2 text-sm font-bold text-white">로그인</button>
          <p className="text-xs text-muted">시안이라 실제 계정을 확인하지 않아요. 아무 글자나 넣으면 로그인돼요. 진짜 비밀번호는 넣지 마세요.</p>
        </form>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (!String(data.get("name") ?? "").trim() || !String(data.get("no") ?? "").trim()) {
              setError("이름과 예약번호를 모두 넣어 주세요.");
              return;
            }
            setError("비회원 예약을 받을지는 팀 결정 전이에요. 시안에서는 조회되지 않아요 (확인 필요).");
          }}
        >
          <p className="text-sm text-muted">회원가입 없이 예약했다면 이름과 예약번호로 예약 내역을 볼 수 있어요.</p>
          <label className="text-sm">이름<input name="name" className="mt-1 w-full rounded border px-3 py-2" /></label>
          <label className="text-sm">예약번호<input name="no" className="mt-1 w-full rounded border px-3 py-2" placeholder="예: NV-2026-0001" /></label>
          {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
          <button type="submit" className="rounded-full bg-primary py-2 text-sm font-bold text-white">예약 내역 조회</button>
        </form>
      )}
      <div className="mt-4 grid gap-2">
        {["카카오로 시작하기", "네이버로 시작하기", "구글로 시작하기"].map((label) => (
          <button key={label} type="button" onClick={() => setNote("소셜 로그인을 쓸지는 팀 인증 담당과 확인이 필요해요 (시안).")} className="rounded-full border py-2 text-sm">{label}</button>
        ))}
        <button type="button" onClick={() => setNote("아이디·비밀번호 찾기 방식은 팀 인증 담당과 확인이 필요해요 (시안).")} className="text-sm underline">아이디 · 비밀번호 찾기</button>
        <Link href="/signup" className="text-sm font-bold text-primary">회원가입</Link>
        {note ? <p className="text-sm" role="status">{note}</p> : null}
      </div>
    </div>
  );
}
