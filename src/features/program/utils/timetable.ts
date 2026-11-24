import type { ProgramTimetableItem } from "@/features/program/data/programs";

const dayNames = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째"];

/** 몇째 날을 "첫째 날"로 표시합니다. 당일 프로그램(박수 0)은 "당일" */
export function formatDayLabel(dayNo: number, nights: number): string {
  if (nights === 0) {
    return "당일";
  }
  return dayNames[dayNo - 1] ? `${dayNames[dayNo - 1]} 날` : `${dayNo}일차`;
}

/** 걸리는 시간(분)을 "1시간 30분"으로 표시합니다. */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}분`;
  }
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

/**
 * 일정 한 줄의 시간을 표시합니다.
 * - 시작 시각이 있으면 "14:00 – 15:00" (끝 시각이 없으면 "14:00")
 * - 시작 시각 없이 걸리는 시간만 있으면 "1시간 30분" (하루 여러 회차인 당일형)
 */
export function formatTimetableTime(item: ProgramTimetableItem): string {
  if (item.startTime) {
    return item.endTime ? `${item.startTime} – ${item.endTime}` : item.startTime;
  }
  return item.durationMinutes ? formatDuration(item.durationMinutes) : "";
}

/** 날짜·순서대로 정렬합니다. */
export function sortTimetable(items: ProgramTimetableItem[]): ProgramTimetableItem[] {
  return [...items].sort((a, b) => a.dayNo - b.dayNo || a.sortOrder - b.sortOrder);
}

/** 시각 없이 걸리는 시간으로만 적힌 일정이면 총 걸리는 시간(분)을 돌려줍니다. */
export function getTotalDuration(items: ProgramTimetableItem[]): number | null {
  if (items.length === 0 || items.some((item) => item.startTime || !item.durationMinutes)) {
    return null;
  }
  return items.reduce((sum, item) => sum + (item.durationMinutes ?? 0), 0);
}
