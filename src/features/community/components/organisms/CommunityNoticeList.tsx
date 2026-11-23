import Link from "next/link";
import type { CommunityNotice } from "@/features/community/data/community-notices";

type CommunityNoticeListProps = {
  notices: CommunityNotice[];
};

export default function CommunityNoticeList({ notices }: CommunityNoticeListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-[80px_minmax(320px,1fr)_140px_100px] border-y border-border bg-subtle py-4 text-center text-sm font-semibold text-ink">
          <span>번호</span>
          <span>제목</span>
          <span>날짜</span>
          <span>조회수</span>
        </div>

        {notices.map((notice) => (
          <div
            key={notice.id}
            className="grid grid-cols-[80px_minmax(320px,1fr)_140px_100px] items-center border-b border-border py-5 text-center text-sm"
          >
            <span className="font-semibold text-primary">{notice.isPinned ? "공지" : notice.id}</span>
            <Link
              href={`/community/notices/${notice.id}`}
              className="px-4 text-left font-medium text-ink hover:text-primary"
            >
              {notice.title}
            </Link>
            <span className="text-muted">{notice.createdAt}</span>
            <span className="text-muted">{notice.views}</span>
          </div>
        ))}

        {notices.length === 0 && (
          <div className="border-b border-border py-16 text-center text-sm text-muted">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
