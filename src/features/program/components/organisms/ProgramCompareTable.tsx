"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { programs, type Program } from "@/features/program/data/programs";
import { readComparisonIds, writeComparisonIds } from "@/features/program/utils/comparison";
import { formatWon } from "@/features/program/utils/booking";

const dayLabels = [
  { label: "일", name: "일요일" },
  { label: "월", name: "월요일" },
  { label: "화", name: "화요일" },
  { label: "수", name: "수요일" },
  { label: "목", name: "목요일" },
  { label: "금", name: "금요일" },
  { label: "토", name: "토요일" },
];

function selectedPrograms(): Program[] {
  return readComparisonIds()
    .map((id) => programs.find((program) => program.id === id))
    .filter((program): program is Program => program !== undefined);
}

function stayLabel(program: Program) {
  if (program.nights <= 0) {
    return "당일";
  }

  return `${program.nights}박 ${program.nights + 1}일`;
}

function checkInTime(program: Program) {
  const firstTimed = program.timetable.find((item) => item.startTime);
  return firstTimed?.startTime ?? "정보 확인 중";
}

function operatingDays(program: Program) {
  return dayLabels.map((day) => ({
    label: day.label,
    active: program.date.includes(day.name),
  }));
}

export default function ProgramCompareTable() {
  const [items, setItems] = useState<Program[]>([]);

  useEffect(() => {
    const sync = () => setItems(selectedPrograms());
    sync();
    window.addEventListener("nirvana-comparison", sync);
    return () => window.removeEventListener("nirvana-comparison", sync);
  }, []);

  const remove = (programId: number) => {
    writeComparisonIds(readComparisonIds().filter((id) => id !== programId));
  };

  if (items.length < 2) {
    return (
      <div className="border border-border bg-white px-6 py-16 text-center">
        <p className="text-lg font-bold text-ink">비교하려면 프로그램을 2개 이상 담아 주세요.</p>
        <Link href="/programs" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
          프로그램 목록으로
        </Link>
      </div>
    );
  }

  const rows: { label: string; value: (program: Program) => string }[] = [
    { label: "성인 참가비", value: (program) => formatWon(program.adultPrice) },
    {
      label: "미성년자 참가비",
      value: (program) => (program.youthAllowed ? formatWon(program.youthPrice) : "미성년자 참가 불가"),
    },
    { label: "일정", value: (program) => `${stayLabel(program)} · ${program.date}` },
    { label: "입소 시간", value: checkInTime },
    { label: "회차 정원", value: () => "정보 확인 중" },
    { label: "식사", value: () => "정보 확인 중" },
    { label: "복장", value: (program) => program.preparation },
    { label: "묵언", value: () => "정보 확인 중" },
    { label: "강도", value: () => "정보 확인 중" },
    { label: "언어", value: (program) => (program.languageSupport ? "외국어 지원" : "한국어") },
    { label: "이용 규칙", value: (program) => program.rules },
  ];

  return (
    <div>
      <p className="text-sm text-muted">비용과 이용 조건은 시안용 예시입니다.</p>
      <div className="mt-6 overflow-x-auto border border-border bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="w-36 border-b border-border bg-subtle px-4 py-4 text-muted">항목</th>
              {items.map((program) => (
                <th key={program.id} className="border-b border-l border-border px-4 py-4 align-top">
                  <div
                    role="img"
                    aria-label={program.name}
                    className="aspect-[5/3] bg-cover bg-center"
                    style={{ backgroundImage: `url("${program.image}")` }}
                  />
                  <p className="mt-3 text-xs text-muted">
                    {program.temple} · {program.templeAddress}
                  </p>
                  <Link href={`/programs/${program.id}`} className="mt-2 block font-bold text-ink hover:text-primary">
                    {program.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(program.id)}
                    className="mt-3 text-xs font-bold text-muted underline"
                  >
                    빼기
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border-b border-border bg-subtle px-4 py-4 font-semibold text-ink">운영 요일</th>
              {items.map((program) => (
                <td key={program.id} className="border-b border-l border-border px-4 py-4">
                  <span className="flex gap-1">
                    {operatingDays(program).map((day) => (
                      <span
                        key={day.label}
                        className={
                          day.active
                            ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white"
                            : "flex h-7 w-7 items-center justify-center rounded-full bg-subtle text-xs text-muted"
                        }
                      >
                        {day.label}
                      </span>
                    ))}
                  </span>
                </td>
              ))}
            </tr>
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="border-b border-border bg-subtle px-4 py-4 font-semibold text-ink">{row.label}</th>
                {items.map((program) => (
                  <td key={program.id} className="border-b border-l border-border px-4 py-4 text-ink">
                    {row.value(program)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
