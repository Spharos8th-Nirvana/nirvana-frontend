"use client";

import { useSyncExternalStore } from "react";
import {
  heldFromSnapshot,
  seatHoldsServerSnapshot,
  seatHoldsSnapshot,
  subscribeSeatHolds,
} from "@/features/booking/utils/pending-payment";
import type { ProgramSchedule } from "@/features/program/data/program-schedules";
import type { Program } from "@/features/program/data/programs";
import { hasMatchingSchedule } from "@/features/program/utils/booking";
import ProgramFilter from "./ProgramFilter";

type ProgramSeatResultsProps = {
  programs: Program[];
  schedules: ProgramSchedule[];
  date: string;
  people: number;
};

export default function ProgramSeatResults({ programs, schedules, date, people }: ProgramSeatResultsProps) {
  const holds = useSyncExternalStore(subscribeSeatHolds, seatHoldsSnapshot, seatHoldsServerSnapshot);
  if (holds === null) {
    return <p role="status" className="text-sm text-muted">남은 자리를 확인하고 있습니다.</p>;
  }

  const matchingPrograms = programs.filter((program) => hasMatchingSchedule(
    schedules.filter((schedule) => schedule.programId === program.id),
    { date, people },
    (id) => heldFromSnapshot(holds, id),
  ));

  return <ProgramFilter programs={matchingPrograms} />;
}
