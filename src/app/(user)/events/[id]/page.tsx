import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { events, recommendedPrograms } from "@/features/guide/data/mock-screens";

const communityNav = [
  { href: "/community/clubs", label: "동호회" },
  { href: "/community/reviews", label: "체험 후기" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/events", label: "이벤트" },
];

const programTitles: Record<number, string> = {
  1: "마음 비우기 2박 3일 템플스테이",
  4: "고요한 집중, 명상 리트릿",
  5: "숲길 걷기와 다도, 반나절 쉼",
  6: "새벽 예불과 함께하는 1박 2일",
  7: "지리산 품에서 쉬어 가기",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((item) => item.id === Number(id));
  if (!event) notFound();
  const others = events.filter((item) => item.id !== event.id);

  return (
    <PreviewPage title={event.title} description={event.period} image={event.img}>
      <SectionNav label="커뮤니티 메뉴" items={communityNav} current="/events" />
      <p className="text-sm font-bold">{event.open ? "진행 중" : "종료"}</p>
      <h2 className="mt-4 text-xl text-primary">이벤트 내용</h2>
      <p className="mt-2">{event.desc} (시안 예시 이벤트)</p>
      <h2 className="mt-6 text-xl text-primary">참여 방법</h2>
      <ol className="mt-2 list-decimal pl-5 text-sm">{event.how.map((step) => <li key={step}>{step}</li>)}</ol>
      <h2 className="mt-6 text-xl text-primary">대상 프로그램</h2>
      <ul className="mt-2 space-y-2">
        {event.programIds.map((programId) => (
          <li key={programId}>
            <Link href={`/programs/${programId}`} className="font-bold text-primary">
              {programTitles[programId] ?? recommendedPrograms.find((item) => item.id === programId)?.title ?? `프로그램 ${programId}`}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">이벤트 테이블은 팀 ERD에서 아직 찾지 못했어요. 이벤트를 어떻게 저장할지 확인이 필요해요.</p>
      <ul className="mt-4 space-y-1 text-sm">
        {others.map((item) => (
          <li key={item.id}><Link href={`/events/${item.id}`}>{item.open ? "진행 중" : "종료"} · {item.title}</Link></li>
        ))}
      </ul>
      <Link href="/events" className="mt-4 inline-block text-sm font-bold">이벤트 목록</Link>
    </PreviewPage>
  );
}
