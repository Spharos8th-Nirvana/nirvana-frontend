const KEY = "nirvana.joined-clubs";

function readIds() {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export function joinedClubsSnapshot() {
  return JSON.stringify(readIds());
}

export function joinedClubsServerSnapshot() {
  return "[]";
}

export function subscribeJoinedClubs(onChange: () => void) {
  window.addEventListener("nirvana-clubs", onChange);
  return () => window.removeEventListener("nirvana-clubs", onChange);
}

export function parseJoinedClubs(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: number[]) {
  window.sessionStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("nirvana-clubs"));
}

export function joinClub(id: number) {
  const ids = readIds();
  if (!ids.includes(id)) {
    writeIds([...ids, id]);
  }
}

export function leaveClub(id: number) {
  writeIds(readIds().filter((item) => item !== id));
}

export function clearJoinedClubs() {
  writeIds([]);
}
