import Link from "next/link";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { TempleMap } from "@/features/temple/components/organisms/TempleMap";

const templeNav = [
  { href: "/temples", label: "사찰 목록" },
  { href: "/temples/map", label: "지역별 사찰 지도" },
  { href: "/about/templestay", label: "템플스테이란?" },
];

export default function TempleMapPage() {
  return (
    <PreviewPage title="지역별 사찰 지도" description="지역을 누르면 그 지역의 템플스테이 운영 사찰이 아래에 나와요." image="/images/photo-fe525463d346dbd5.jpg">
      <SectionNav label="사찰 메뉴" items={templeNav} current="/temples/map" />
      <TempleMap />
      <p className="mt-6 text-sm"><Link href="/temples" className="font-bold text-primary">사찰 목록으로</Link></p>
    </PreviewPage>
  );
}
