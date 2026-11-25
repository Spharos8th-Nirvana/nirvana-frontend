import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { reviews } from "@/features/guide/data/mock-screens";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = reviews.find((item) => item.id === Number(id));
  if (!review) notFound();

  return (
    <PreviewPage title={review.title} description={review.prog} image={review.img}>
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/community/reviews" />
      <p className="text-sm text-muted">{review.author} · {review.date}</p>
      <p className="mt-4 leading-8">{review.body}</p>
      <Link href="/community/reviews" className="mt-6 inline-block text-sm font-bold">체험 후기 목록</Link>
    </PreviewPage>
  );
}
