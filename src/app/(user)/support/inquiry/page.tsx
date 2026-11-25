import Link from "next/link";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";

const supportNav = [
  { href: "/support", label: "자주 묻는 질문" },
  { href: "/support/inquiry", label: "1:1 문의" },
  { href: "/community/notices", label: "공지사항" },
];

export default function InquiryPage() {
  return (
    <PreviewPage title="1:1 문의" description="답변을 마이페이지와 이메일로 받기 위해서예요.">
      <SectionNav label="고객센터 메뉴" items={supportNav} current="/support/inquiry" />
      <p className="font-bold">1:1 문의는 로그인한 뒤에 쓸 수 있어요.</p>
      <p className="mt-2 text-sm text-muted">답변을 마이페이지와 이메일로 받기 위해서예요.</p>
      <Link href="/login" className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">로그인하고 문의하기</Link>
      <p className="mt-4 text-xs text-muted">팀 ERD에서 1:1 문의 테이블을 아직 찾지 못했어요. 문의를 받을지, 어디에 저장할지 확인이 필요해요.</p>
    </PreviewPage>
  );
}
