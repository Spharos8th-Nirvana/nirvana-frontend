import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { GroupInquiryForm } from "@/features/program/components/organisms/GroupInquiryForm";

const programNav = [
  { href: "/programs", label: "전체 프로그램" },
  { href: "/programs/recommend", label: "추천 프로그램" },
  { href: "/events", label: "이벤트 프로그램" },
  { href: "/programs/group", label: "단체 체험 문의" },
];

export default function GroupPage() {
  return (
    <PreviewPage title="단체 체험 문의" description="학교·회사·동호회처럼 10명 이상이 함께 오시려면 먼저 문의해 주세요.">
      <SectionNav label="프로그램 예약 메뉴" items={programNav} current="/programs/group" />
      <GroupInquiryForm />
    </PreviewPage>
  );
}
