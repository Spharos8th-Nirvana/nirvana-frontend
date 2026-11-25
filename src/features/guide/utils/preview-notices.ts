export type PreviewNotice = {
  id: number;
  text: string;
  date: string;
  read: boolean;
  to: string;
};

const KEY = "nirvana.preview-notices";

const welcome: PreviewNotice = {
  id: 1,
  text: "너바나에 오신 것을 환영해요. 예약과 소식은 여기서 알려 드려요.",
  date: "2026.11.24",
  read: false,
  to: "/",
};

function today() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function subscribeNotices(onChange: () => void) {
  window.addEventListener("nirvana-notices", onChange);
  return () => window.removeEventListener("nirvana-notices", onChange);
}

export function noticesSnapshot() {
  return window.sessionStorage.getItem(KEY) ?? JSON.stringify([welcome]);
}

export function noticesServerSnapshot() {
  return JSON.stringify([welcome]);
}

export function parseNotices(raw: string): PreviewNotice[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? (parsed as PreviewNotice[]) : [welcome];
  } catch {
    return [welcome];
  }
}

function save(notices: PreviewNotice[]) {
  window.sessionStorage.setItem(KEY, JSON.stringify(notices));
  window.dispatchEvent(new Event("nirvana-notices"));
}

export function pushNotice(text: string, to: string) {
  const notices = parseNotices(noticesSnapshot());
  save([{ id: Date.now(), text, date: today(), read: false, to }, ...notices]);
}

export function markNoticeRead(id: number) {
  save(parseNotices(noticesSnapshot()).map((item) => (item.id === id ? { ...item, read: true } : item)));
}

export function markAllNoticesRead() {
  save(parseNotices(noticesSnapshot()).map((item) => ({ ...item, read: true })));
}
