import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { docs } from "@/features/guide/data/mock-screens";

const docNav = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
];

export default function TermsPage() {
  return (
    <PreviewPage title={docs.terms.title} description="시안 예시 문구예요. 실제 약관은 팀과 법률 검토가 필요해요.">
      <SectionNav label="약관 메뉴" items={docNav} current="/terms" />
      {docs.terms.arts.map(([title, body]) => (
        <section key={title} className="border-b border-border py-4">
          <h2 className="text-lg text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-7">{body}</p>
        </section>
      ))}
      <p className="mt-4 text-xs text-muted">시행일: 확인 필요 · 버전: 시안</p>
    </PreviewPage>
  );
}
