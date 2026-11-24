/**
 * 프로그램 회차(임시 데이터).
 * DB nirvana_catalog_query.schedules 구조를 참고했습니다. 실제 타입은 API 확정 후 맞춥니다.
 */
export type ProgramSchedule = {
  /** 회차 식별자. 실제 API에서는 UUID(scheduleUuid)입니다. */
  id: string;
  programId: number;
  /** 입실일 (YYYY-MM-DD) */
  operationStartDate: string;
  /** 퇴실일 (YYYY-MM-DD) */
  operationEndDate: string;
  /** 시작 시각 (HH:mm) */
  startTime: string;
  /** 종료 시각 (HH:mm) */
  endTime: string;
  capacity: number;
  /** 결제 대기 + 확정 인원 */
  reservedCount: number;
  bookable: boolean;
};

export const programSchedules: ProgramSchedule[] = [
  // 1. 새벽 숲, 나를 깨우는 시간 (1박 2일)
  {
    id: "schedule-1-20261205",
    programId: 1,
    operationStartDate: "2026-12-05",
    operationEndDate: "2026-12-06",
    startTime: "14:00",
    endTime: "11:00",
    capacity: 20,
    reservedCount: 12,
    bookable: true,
  },
  {
    id: "schedule-1-20261212",
    programId: 1,
    operationStartDate: "2026-12-12",
    operationEndDate: "2026-12-13",
    startTime: "14:00",
    endTime: "11:00",
    capacity: 20,
    reservedCount: 20,
    bookable: false,
  },
  {
    id: "schedule-1-20261219",
    programId: 1,
    operationStartDate: "2026-12-19",
    operationEndDate: "2026-12-20",
    startTime: "14:00",
    endTime: "11:00",
    capacity: 20,
    reservedCount: 17,
    bookable: true,
  },
  {
    id: "schedule-1-20270109",
    programId: 1,
    operationStartDate: "2027-01-09",
    operationEndDate: "2027-01-10",
    startTime: "14:00",
    endTime: "11:00",
    capacity: 20,
    reservedCount: 0,
    bookable: true,
  },
  // 2. 스님과 함께 빚는 사찰의 맛 (당일)
  {
    id: "schedule-2-20261205",
    programId: 2,
    operationStartDate: "2026-12-05",
    operationEndDate: "2026-12-05",
    startTime: "10:00",
    endTime: "15:00",
    capacity: 12,
    reservedCount: 4,
    bookable: true,
  },
  {
    id: "schedule-2-20261212",
    programId: 2,
    operationStartDate: "2026-12-12",
    operationEndDate: "2026-12-12",
    startTime: "10:00",
    endTime: "15:00",
    capacity: 12,
    reservedCount: 10,
    bookable: true,
  },
  // 3. 몸과 마음을 잇는 선무도 (2박 3일)
  {
    id: "schedule-3-20261211",
    programId: 3,
    operationStartDate: "2026-12-11",
    operationEndDate: "2026-12-13",
    startTime: "15:00",
    endTime: "12:00",
    capacity: 10,
    reservedCount: 3,
    bookable: true,
  },
  {
    id: "schedule-3-20261225",
    programId: 3,
    operationStartDate: "2026-12-25",
    operationEndDate: "2026-12-27",
    startTime: "15:00",
    endTime: "12:00",
    capacity: 10,
    reservedCount: 9,
    bookable: true,
  },
];
