import type { CommunityNotice } from "@/features/community/data/community-notices";

export function sortCommunityNotices(notices: CommunityNotice[]): CommunityNotice[] {
  return [...notices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return Number(b.isPinned) - Number(a.isPinned);
    }

    return b.id - a.id;
  });
}
