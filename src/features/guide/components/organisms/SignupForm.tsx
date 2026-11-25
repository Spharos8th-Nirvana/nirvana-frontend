"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** 시안 회원가입. 입력값은 저장하지 않습니다. */
export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      className="mx-auto grid max-w-md gap-3 rounded-2xl border border-border bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const id = String(data.get("id") ?? "");
        const pw = String(data.get("pw") ?? "");
        const nick = String(data.get("nick") ?? "").trim();
        const mail = String(data.get("mail") ?? "").trim();
        if (!/^[A-Za-z0-9]{4,}$/.test(id)) { setError("아이디는 영문·숫자 4자 이상이에요."); return; }
        if (pw.length < 8) { setError("비밀번호는 8자 이상이에요."); return; }
        if (pw !== String(data.get("pw2") ?? "")) { setError("비밀번호 확인이 달라요."); return; }
        if (!String(data.get("name") ?? "").trim()) { setError("이름을 넣어 주세요."); return; }
        if (nick.length < 2 || nick.length > 10) { setError("닉네임은 2~10자로 넣어 주세요."); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { setError("이메일 모양이 맞지 않아요."); return; }
        if (data.get("terms") !== "on" || data.get("priv") !== "on") { setError("필수 동의 2개에 체크해 주세요."); return; }
        router.push("/mypage");
      }}
    >
      <label className="text-sm">아이디<input name="id" className="mt-1 w-full rounded border px-3 py-2" placeholder="영문·숫자 4자 이상" /></label>
      <label className="text-sm">비밀번호<input name="pw" type="password" autoComplete="new-password" className="mt-1 w-full rounded border px-3 py-2" placeholder="8자 이상" /></label>
      <label className="text-sm">비밀번호 확인<input name="pw2" type="password" autoComplete="new-password" className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="text-sm">이름<input name="name" className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="text-sm">닉네임<input name="nick" className="mt-1 w-full rounded border px-3 py-2" placeholder="2~10자" /></label>
      <label className="text-sm">이메일<input name="mail" type="email" className="mt-1 w-full rounded border px-3 py-2" placeholder="name@example.com" /></label>
      <label className="text-sm"><input name="terms" type="checkbox" /> [필수] 이용약관 동의</label>
      <label className="text-sm"><input name="priv" type="checkbox" /> [필수] 개인정보 수집·이용 동의</label>
      <label className="text-sm"><input name="mkt" type="checkbox" /> [선택] 이벤트·소식 받기</label>
      {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
      <button type="submit" className="rounded-full bg-primary py-2 text-sm font-bold text-white">가입하기</button>
      <p className="text-xs text-muted">입력 칸과 규칙은 시안 예시예요. 실제로 저장되지 않아요.</p>
    </form>
  );
}
