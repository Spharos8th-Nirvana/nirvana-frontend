import Link from "next/link";
import type { CommunityNotice } from "@/features/community/data/community-notices";
import type { CommunityPost } from "@/features/community/data/community-posts";

type CommunityPostTableProps = {
  pinnedNotices: CommunityNotice[];
  posts: CommunityPost[];
  emptyMessage: string;
};

const gridClassName =
  "grid grid-cols-[70px_130px_minmax(320px,1fr)_120px_120px_90px]";

export default function CommunityPostTable({
  pinnedNotices,
  posts,
  emptyMessage,
}: CommunityPostTableProps) {
  return (
    <div className="mt-6 overflow-x-auto">
      <div className="min-w-[900px]">
        <div
          className={`${gridClassName} border-y border-border bg-[#F5F5F5] py-4 text-center text-sm font-semibold text-ink`}
        >
          <span>번호</span>
          <span>분류</span>
          <span>제목</span>
          <span>작성자</span>
          <span>날짜</span>
          <span>조회수</span>
        </div>

        {pinnedNotices.map((notice) => (
          <div
            key={notice.id}
            className={`${gridClassName} items-center border-b border-border bg-[#F5F5F5] py-5 text-center text-sm`}
          >
            <span className="font-semibold text-primary">공지</span>
            <span className="text-primary">공지사항</span>
            <span className="px-4 text-left font-semibold text-ink">{notice.title}</span>
            <span className="text-muted">관리자</span>
            <span className="text-muted">{notice.createdAt}</span>
            <span className="text-muted">{notice.views}</span>
          </div>
        ))}

        {posts.map((post) => (
          <div
            key={post.id}
            className={`${gridClassName} items-center border-b border-border py-5 text-center text-sm text-muted`}
          >
            <span>{post.id}</span>
            <span>{post.category}</span>
            <span className="flex items-center gap-2 px-4 text-left font-medium text-ink">
              <Link href={`/community/${post.id}`} className="hover:text-primary">
                {post.title}
              </Link>
              {post.likes >= 10 && (
                <span className="shrink-0 text-xs font-bold text-accent">BEST</span>
              )}
            </span>
            <span>{post.nickname}</span>
            <span>{post.createdAt}</span>
            <span>{post.views}</span>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="border-b border-border py-16 text-center text-sm text-muted">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
