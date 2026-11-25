/**
 * 금액을 "80,000원" 형식으로 표시합니다. (서비스 전체 금액 표기 기준)
 * 프로그램, 예약, 홈 등 여러 기능에서 함께 쓰는 도메인 중립 함수라 shared에 둡니다.
 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}
