/** 시안과 같은 비교 바구니. 브라우저를 닫으면 사라집니다. */
export const COMPARISON_STORAGE_KEY = "nirvana.program-comparison";

export const COMPARISON_LIMIT = 3;

export function readComparisonIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(
      window.sessionStorage.getItem(COMPARISON_STORAGE_KEY) ?? "[]",
    );

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((id): id is number => Number.isInteger(id))
      .slice(0, COMPARISON_LIMIT);
  } catch {
    return [];
  }
}

export function writeComparisonIds(ids: number[]) {
  window.sessionStorage.setItem(
    COMPARISON_STORAGE_KEY,
    JSON.stringify(ids.slice(0, COMPARISON_LIMIT)),
  );
  window.dispatchEvent(new Event("nirvana-comparison"));
}
