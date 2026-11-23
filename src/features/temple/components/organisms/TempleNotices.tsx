import Link from "next/link";
import type { TempleNotice } from "@/features/temple/data/temple-notices";

type TempleNoticesProps = {
  templeId: number;
  notices: TempleNotice[];
};

export default function TempleNotices({
  templeId,
  notices,
}: TempleNoticesProps) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">공지사항</h2>
        <span className="text-sm text-muted">전체 {notices.length}건</span>
      </div>

      {notices.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/temples/${templeId}/notices/${notice.id}`}
              className="flex items-center justify-between gap-4 px-4 py-6 transition-colors hover:bg-[bg-background]"
            >
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-primary">
                  {notice.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  <span>{notice.nickname}</span>
                  <span>{notice.createdAt}</span>
                </div>
              </div>

              <span className="shrink-0 text-sm text-muted">보기 →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
