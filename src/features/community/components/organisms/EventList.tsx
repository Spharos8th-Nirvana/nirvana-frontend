"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { events } from "@/features/guide/data/mock-screens";

export function EventList() {
  const [tab, setTab] = useState<"open" | "end">("open");
  const openCount = events.filter((item) => item.open).length;
  const endCount = events.length - openCount;
  const list = useMemo(() => events.filter((item) => item.open === (tab === "open")), [tab]);

  return (
    <div>
      <div className="mb-4 flex gap-2" role="group" aria-label="이벤트 상태">
        <button type="button" aria-pressed={tab === "open"} onClick={() => setTab("open")} className={`rounded-full border px-4 py-2 text-sm ${tab === "open" ? "bg-primary text-white" : "bg-white"}`}>진행 중 {openCount}</button>
        <button type="button" aria-pressed={tab === "end"} onClick={() => setTab("end")} className={`rounded-full border px-4 py-2 text-sm ${tab === "end" ? "bg-primary text-white" : "bg-white"}`}>종료 {endCount}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((item) => (
          <Link key={item.id} href={`/events/${item.id}`} className="overflow-hidden rounded-2xl border border-border bg-white">
            <Image src={item.img} alt="" width={640} height={160} className="h-40 w-full object-cover" />
            <div className="p-4">
              <span className="text-xs font-bold">{item.open ? "진행 중" : "종료"}</span>
              <h2 className="mt-1 text-lg text-primary">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
              <p className="mt-2 text-xs text-muted">{item.period}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
