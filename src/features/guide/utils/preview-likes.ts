const PROGRAM_KEY = "nirvana.liked-programs";
const TEMPLE_KEY = "nirvana.liked-temples";

function readIds(key: string) {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: number[]) {
  window.sessionStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event("nirvana-likes"));
}

export function subscribeLikes(onChange: () => void) {
  window.addEventListener("nirvana-likes", onChange);
  return () => window.removeEventListener("nirvana-likes", onChange);
}

export function likedProgramsSnapshot() {
  return window.sessionStorage.getItem(PROGRAM_KEY) ?? "[]";
}

export function likedTemplesSnapshot() {
  return window.sessionStorage.getItem(TEMPLE_KEY) ?? "[]";
}

export function likesServerSnapshot() {
  return "[]";
}

export function parseLikedIds(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

export function toggleLikedProgram(id: number) {
  const current = readIds(PROGRAM_KEY);
  writeIds(PROGRAM_KEY, current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
}

export function toggleLikedTemple(id: number) {
  const current = readIds(TEMPLE_KEY);
  writeIds(TEMPLE_KEY, current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
}
