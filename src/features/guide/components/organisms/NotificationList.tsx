"use client";

import { useState } from "react";
import Link from "next/link";
import { demoNotice } from "@/features/guide/data/mock-screens";

export function NotificationList() {
  const [read, setRead] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p>안 읽은 알림 <b>{read ? 0 : 1}</b>개</p>
        <button type="button" onClick={() => setRead(true)} className="rounded-full border px-3 py-1.5 text-sm">모두 읽음으로</button>
      </div>
      <Link href={demoNotice.href} onClick={() => setRead(true)} className={`block rounded-xl border p-4 ${read ? "border-border" : "border-primary"}`}>
        <p>{demoNotice.text}</p>
        <time className="text-xs text-muted">{demoNotice.date}</time>
      </Link>
      <p className="mt-4 text-xs text-muted">시안은 화면 안 알림만 보여 줘요. 알림 종류 · 받는 방법은 팀에서 정해요.</p>
    </div>
  );
}
