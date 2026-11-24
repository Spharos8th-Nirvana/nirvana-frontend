/**
 * 사용자가 마지막으로 본 프로그램 목록 주소(검색 조건 포함)를 기억합니다.
 * 상세 페이지의 "목록으로" 링크가 이 주소로 돌아갑니다.
 * 브라우저 탭 안에서만 유지되며(sessionStorage), 개인정보는 담지 않습니다.
 */
const STORAGE_KEY = "nirvana:last-program-list-url";
export const DEFAULT_PROGRAM_LIST_URL = "/programs";

export function saveProgramListUrl(url: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, url);
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 기본 목록으로 돌아갑니다.
  }
}

export function readProgramListUrl(): string {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    // 같은 사이트의 목록 주소만 사용합니다.
    return saved && saved.startsWith(DEFAULT_PROGRAM_LIST_URL) ? saved : DEFAULT_PROGRAM_LIST_URL;
  } catch {
    return DEFAULT_PROGRAM_LIST_URL;
  }
}
