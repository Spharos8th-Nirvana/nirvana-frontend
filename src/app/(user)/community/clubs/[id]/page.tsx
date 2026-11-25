import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { clubPosts, clubs } from "@/features/guide/data/mock-screens";
import { ClubJoinButton } from "@/features/community/components/molecules/ClubJoinButton";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = clubs.find((item) => item.id === Number(id));
  if (!club) notFound();
  const posts = clubPosts.filter((post) => post.clubId === club.id);

  return (
    <PreviewPage title={club.name} description={club.desc} image={club.img}>
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/community/clubs" />
      <p className="text-sm text-sage-07">{club.tags.join(" · ")}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div>회원 {club.members}명</div>
        <div>모임 {club.how}</div>
        <div>함께하는 사찰 <Link href={`/temples/${club.templeId}`} className="font-bold text-primary">{club.temple}</Link></div>
        <div>만든 때 {club.since}</div>
      </dl>
      <ul className="mt-4 list-disc pl-5 text-sm">{club.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      <ClubJoinButton clubId={club.id} clubName={club.name} nextPath={`/community/clubs/${club.id}`} />
      <p className="mt-3 text-xs text-muted">가입 방식은 시안에서 ‘바로 가입 · 가입자만 글쓰기’예요. 실제 규칙은 팀 확인이 필요해요.</p>
      <h2 className="mt-8 text-xl text-primary">동호회 게시판</h2>
      <ul className="mt-3 divide-y border-y border-border">
        {posts.map((post) => (
          <li key={post.id} className="py-3">
            <Link href={`/community/posts/${post.id}`} className="font-bold text-primary">{post.title}</Link>
            <p className="text-sm text-muted">{post.body}</p>
            <p className="text-xs text-muted">{post.author} · {post.date}</p>
          </li>
        ))}
      </ul>
      <Link href="/community/clubs" className="mt-6 inline-block text-sm font-bold">동호회 목록</Link>
    </PreviewPage>
  );
}
