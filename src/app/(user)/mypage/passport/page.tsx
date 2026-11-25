import Link from "next/link";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { PassportBoard } from "@/features/home/components/organisms/TemplePassport";

export default function PassportPage() {
  return (
    <PreviewPage title="사찰 패스포트" description="체험을 마친(이용 완료) 사찰에 도장이 찍혀요.">
      <p className="text-sm text-muted">도장 디자인은 팀 ERD stampTemplateVersions로 관리해요.</p>
      <PassportBoard />
      <Link href="/mypage" className="mt-6 inline-block text-sm font-bold">마이페이지</Link>
    </PreviewPage>
  );
}
