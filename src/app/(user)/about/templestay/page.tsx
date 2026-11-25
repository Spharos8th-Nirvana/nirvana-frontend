import Link from "next/link";
import Image from "next/image";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { faqs } from "@/features/guide/data/mock-screens";

const aboutNav = [
  { href: "/about", label: "너바나 소개" },
  { href: "/about/templestay", label: "템플스테이란?" },
  { href: "/temples", label: "운영 사찰" },
  { href: "/support", label: "고객센터" },
];

const types = [
  ["숙박형", "하룻밤 이상 머물며 사찰의 하루 전체를 경험해요.", "/programs"],
  ["당일형", "몇 시간 동안 핵심 체험만 가볍게 해 봐요.", "/programs"],
  ["체험형", "명상·사찰음식·선무도처럼 정해진 체험 위주예요.", "/programs"],
  ["휴식형", "정해진 일정 없이 나만의 속도로 쉬어요.", "/programs"],
];

const mains = [
  ["사찰 안내", "전각과 문화유산에 담긴 이야기를 들어요."],
  ["명상", "호흡에 집중하며 생각을 내려놓아요."],
  ["차담", "스님과 차를 마시며 이야기를 나눠요."],
  ["발우공양", "음식을 남기지 않는 전통 식사법을 배워요."],
  ["예불", "새벽과 저녁, 부처님께 예를 올려요."],
  ["108배", "절을 하며 몸과 마음을 가다듬어요."],
];

export default function TemplestayPage() {
  return (
    <PreviewPage title="템플스테이란?" description="사찰에 머물며 스님의 하루를 따라가 보는 전통문화 체험이에요." image="/images/photo-fe525463d346dbd5.jpg">
      <SectionNav label="소개 메뉴" items={aboutNav} current="/about/templestay" />
      <section id="ts-what" className="grid items-center gap-6 md:grid-cols-2">
        <Image src="/images/photo-fe525463d346dbd5.jpg" alt="산사 풍경" width={720} height={256} className="h-64 w-full rounded-2xl object-cover" />
        <div>
          <p className="text-xs tracking-[0.2em] text-action">WHAT IS TEMPLESTAY</p>
          <h2 className="mt-2 text-2xl text-primary">산사에서 보내는 하루</h2>
          <p className="mt-2 leading-8">새벽 예불로 하루를 열고, 공양과 명상, 차 한 잔의 대화로 하루를 닫아요. 종교와 상관없이 누구나 참여할 수 있어요. (시안 소개 문구)</p>
          <Link href="/programs" className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">프로그램 찾아보기</Link>
        </div>
      </section>
      <section id="ts-type" className="mt-12">
        <h2 className="text-2xl text-primary">프로그램 유형</h2>
        <p className="text-sm text-muted">유형을 누르면 프로그램 목록으로 가요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {types.map(([title, text, href]) => (
            <Link key={title} href={href} className="rounded-xl border border-border bg-white p-4">
              <b className="text-primary">{title}</b>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section id="ts-main" className="mt-12">
        <h2 className="text-2xl text-primary">주요 체험</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {mains.map(([title, text], index) => (
            <div key={title} className="rounded-xl bg-white p-4"><span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span><b className="mt-1 block">{title}</b><p className="text-sm text-muted">{text}</p></div>
          ))}
        </div>
      </section>
      <section id="ts-bring" className="mt-12">
        <h2 className="text-2xl text-primary">준비물</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[["세면도구", "칫솔·치약·샴푸"], ["수건", "개인 수건 1~2장"], ["편한 양말", "법당은 맨발 대신 양말"], ["얇은 겉옷", "산사의 아침은 쌀쌀해요"], ["상비약", "개인 복용 약"], ["수련복", "사찰에서 빌려줘요"]].map(([title, text]) => (
            <li key={title} className="rounded-lg bg-white p-3 text-sm"><b>✓ {title}</b> · {text}</li>
          ))}
        </ul>
      </section>
      <section id="ts-faq" className="mt-12">
        <h2 className="text-2xl text-primary">자주 묻는 질문</h2>
        {faqs.slice(3, 7).map((item) => (
          <details key={item[1]} className="border-b border-border py-3">
            <summary className="cursor-pointer font-bold">Q. {item[1]}</summary>
            <p className="mt-2 text-sm text-muted">A. {item[2]}</p>
          </details>
        ))}
        <Link href="/support" className="mt-4 inline-block text-sm font-bold">자주 묻는 질문 전체 보기 →</Link>
      </section>
    </PreviewPage>
  );
}
