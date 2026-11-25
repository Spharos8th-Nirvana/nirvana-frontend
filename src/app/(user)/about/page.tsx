import Link from "next/link";
import Image from "next/image";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";

const aboutNav = [
  { href: "/about", label: "너바나 소개" },
  { href: "/about/templestay", label: "템플스테이란?" },
  { href: "/temples", label: "운영 사찰" },
  { href: "/support", label: "고객센터" },
];

const steps = [
  ["찾기", "지역·날짜·유형으로 사찰과 프로그램을 찾아요.", "/programs"],
  ["예약", "회차와 인원을 고르고 바로 예약해요.", "/programs"],
  ["체험", "사찰에서 쉼과 배움을 경험해요.", "/about/templestay"],
  ["기록", "후기를 남기고 사찰 패스포트에 도장을 모아요.", "/community/reviews"],
];

const values = [
  ["고요함", "사찰의 일상과 예절을 존중하는 프로그램만 소개해요.", "/images/photo-d3efcceb6769df7e.jpg"],
  ["정확함", "남은 자리와 환불 규정을 예약 전에 분명히 보여 드려요.", "/images/photo-d32fe5eecc35c02c.jpg"],
  ["이어짐", "다녀온 이야기가 다음 사람의 쉼으로 이어지게 해요.", "/images/photo-30d00b5d0872922b.jpg"],
];

export default function AboutPage() {
  return (
    <PreviewPage title="산사에서 찾는 나만의 쉼" description="너바나는 전국의 사찰과 템플스테이 프로그램을 한곳에서 찾고, 예약하고, 기록하는 서비스예요. (시안 소개 문구)" image="/images/photo-414abba06b58d567.jpg">
      <SectionNav label="소개 메뉴" items={aboutNav} current="/about" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["4곳", "함께하는 사찰"], ["9개", "예약할 수 있는 프로그램"], ["17곳", "찾을 수 있는 지역"], ["4가지", "숙박·당일·체험·휴식"]].map(([value, label]) => (
          <div key={label} className="rounded-xl bg-white p-4 text-center"><b className="block text-xl text-primary">{value}</b><span className="text-sm text-muted">{label}</span></div>
        ))}
      </div>
      <h2 className="mt-10 text-2xl text-primary">너바나는 이렇게 이용해요</h2>
      <ol className="mt-4 grid gap-4 md:grid-cols-4">
        {steps.map(([title, text, href], index) => (
          <li key={title} className="rounded-xl border border-border bg-white p-4">
            <span className="text-sm text-muted">{index + 1}</span>
            <b className="mt-1 block text-primary">{title}</b>
            <p className="mt-1 text-sm">{text}</p>
            <Link href={href} className="mt-2 inline-block text-sm font-bold">바로 가기 →</Link>
          </li>
        ))}
      </ol>
      <h2 className="mt-10 text-2xl text-primary">우리가 지키는 것</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {values.map(([title, text, img]) => (
          <article key={title} className="overflow-hidden rounded-xl border border-border bg-white">
            <Image src={img} alt="" width={480} height={160} className="h-36 w-full object-cover" />
            <div className="p-4"><b>{title}</b><p className="mt-1 text-sm text-muted">{text}</p></div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/programs" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">프로그램 찾기</Link>
        <Link href="/programs/group" className="rounded-full border px-4 py-2 text-sm font-bold">단체로 문의하기</Link>
      </div>
      <p className="mt-4 text-xs text-muted">소개 문구와 숫자는 시안 데이터 기준이에요. 실제 문구는 팀과 확인이 필요해요.</p>
    </PreviewPage>
  );
}
