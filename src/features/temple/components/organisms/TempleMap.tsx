"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { previewTemples, regions } from "@/features/guide/data/mock-screens";

/** 시안 지역 칸 지도. 같은 지역을 다시 누르면 선택이 풀립니다. */
export function TempleMap() {
  const [region, setRegion] = useState("");
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    previewTemples.forEach((temple) => {
      const key = temple.region.split(" ")[0];
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, []);
  const list = region ? previewTemples.filter((temple) => temple.region.startsWith(region)) : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="지역 고르기">
        {regions.map((name) => {
          const count = counts[name] ?? 0;
          const pressed = region === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={pressed}
              onClick={() => setRegion(pressed ? "" : name)}
              className={`rounded-lg border px-3 py-4 text-left ${
                pressed ? "border-primary bg-primary text-white" : count ? "border-primary/40 bg-white" : "border-border bg-subtle text-muted"
              }`}
            >
              <b className="block">{name}</b>
              <span className="text-xs">{count ? `사찰 ${count}곳` : "준비 중"}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">
        {region ? `${region} 지역 사찰` : "지역을 골라 주세요"}. 진한 칸은 사찰이 등록된 지역이에요. 같은 칸을 다시 누르면 선택이 풀려요. (시안: 실제 지도 모양이 아닌 칸 그림)
      </p>
      <p className="mt-6 text-sm">{region ? <>총 <b>{list.length}</b>곳의 사찰</> : "지도에서 지역을 눌러 보세요."}</p>
      <ul className="mt-4 space-y-3">
        {list.map((temple) => (
          <li key={temple.id} className="rounded-xl border border-border bg-white p-4">
            <h2 className="text-lg text-primary">{temple.name}</h2>
            <p className="text-sm text-muted">{temple.region}</p>
            <p className="mt-1 text-sm">{temple.desc}</p>
            <Link href={`/temples/${temple.id}`} className="mt-2 inline-block text-sm font-bold text-primary">
              사찰 정보 보기 →
            </Link>
          </li>
        ))}
      </ul>
      {region && list.length === 0 ? <p className="mt-4 font-bold">조건에 맞는 사찰이 없어요.</p> : null}
    </div>
  );
}
