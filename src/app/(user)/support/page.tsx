import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { SupportFaq } from "@/features/guide/components/organisms/SupportFaq";

const supportNav = [
  { href: "/support", label: "자주 묻는 질문" },
  { href: "/support/inquiry", label: "1:1 문의" },
  { href: "/community/notices", label: "공지사항" },
];

export default function SupportPage() {
  return (
    <PreviewPage title="고객센터" description="자주 묻는 질문에서 먼저 찾아보고, 없으면 1:1로 문의해 주세요.">
      <SectionNav label="고객센터 메뉴" items={supportNav} current="/support" />
      <SupportFaq />
    </PreviewPage>
  );
}
