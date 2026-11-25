"use client";

import { useSyncExternalStore } from "react";
import ClubPostTemplate from "@/features/community/components/templates/ClubPostTemplate";
import {
  clubPosts,
  extraPostsServerSnapshot,
  extraPostsSnapshot,
  parseExtraPosts,
  subscribeExtraPosts,
} from "@/features/community/data/club-posts";

/** 시안 글과 이 브라우저에서 쓴 글을 함께 찾습니다. */
export default function ClubPostScreen({ id }: { id: number }) {
  const raw = useSyncExternalStore(subscribeExtraPosts, extraPostsSnapshot, extraPostsServerSnapshot);
  const extras = parseExtraPosts(raw).filter((post) => !post.deleted);
  const posts = [...extras, ...clubPosts.filter((post) => !extras.some((extra) => extra.id === post.id))];
  const post = posts.find((item) => item.id === id);

  if (!post || post.deleted) {
    return <p className="font-bold text-ink">글을 찾을 수 없어요.</p>;
  }

  const sameClub = posts
    .filter((item) => item.clubId === post.clubId && !item.deleted)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const index = sameClub.findIndex((item) => item.id === post.id);

  return <ClubPostTemplate post={post} previous={sameClub[index + 1] ?? null} next={sameClub[index - 1] ?? null} />;
}
