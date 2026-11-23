import { notFound } from "next/navigation";
import Link from "next/link";
import { temples } from "@/features/temple/data/temples";
import { templeNotices } from "@/features/temple/data/temple-notices";
import { sanitizeContentHtml } from "@/lib/sanitize-html";

type NoticeDetailPageProps = {
  params: Promise<{
    id: string;
    noticeId: string;
  }>;
};

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id, noticeId } = await params;

  const temple = temples.find((item) => item.id === Number(id));

  const notice = templeNotices.find(
    (item) => item.id === Number(noticeId) && item.templeId === Number(id),
  );

  if (!temple || !notice) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[bg-background] px-4 py-12">
      <article className="mx-auto max-w-[900px] rounded-lg bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-primary">{notice.title}</h1>

          <Link
            href={`/temples/${temple.id}?tab=notices`}
            className="shrink-0 rounded-md border border-[#D8D1C5] px-5 py-2 text-sm text-primary hover:font-bold"
          >
            목록으로
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 text-sm text-[#756F62]">
          <span>{notice.nickname}</span>
          <span>·</span>
          <span>{notice.createdAt}</span>
        </div>

        <div
          className="notice-content text-primary leading-8"
          dangerouslySetInnerHTML={{
            __html: sanitizeContentHtml(notice.content),
          }}
        />
      </article>
    </main>
  );
}
