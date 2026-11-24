/**
 * 사찰 취소·환불 정책(임시 데이터).
 * DB nirvana_temple.cancellationPolicySets / cancellationPolicyRules 구조를 참고했습니다.
 */
export type CancellationPolicy = {
  templeId: number;
  versionNo: number;
  rules: {
    /** 이용일 기준 며칠 전까지 */
    deadlineDaysBefore: number;
    /** 환불 비율 (%) */
    refundRate: number;
  }[];
};

export const cancellationPolicies: CancellationPolicy[] = [
  {
    templeId: 1,
    versionNo: 1,
    rules: [
      { deadlineDaysBefore: 7, refundRate: 100 },
      { deadlineDaysBefore: 3, refundRate: 50 },
      { deadlineDaysBefore: 0, refundRate: 0 },
    ],
  },
  {
    templeId: 2,
    versionNo: 1,
    rules: [
      { deadlineDaysBefore: 3, refundRate: 100 },
      { deadlineDaysBefore: 1, refundRate: 50 },
    ],
  },
  {
    templeId: 3,
    versionNo: 1,
    rules: [
      { deadlineDaysBefore: 10, refundRate: 100 },
      { deadlineDaysBefore: 5, refundRate: 70 },
      { deadlineDaysBefore: 2, refundRate: 30 },
    ],
  },
];
