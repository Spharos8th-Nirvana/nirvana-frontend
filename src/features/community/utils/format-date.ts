/**
 * 날짜를 YYYY.MM.DD HH:mm 형식으로 변환
 */
export function formatDateTime(dateTime: string): string {
  const [date, time] = dateTime.split("T");

  if (!date || !time) {
    return dateTime;
  }

  return `${date.replaceAll("-", ".")} ${time.slice(0, 5)}`;
}
