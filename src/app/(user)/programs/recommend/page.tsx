import Link from "next/link";
import Image from "next/image";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SectionNav } from "@/shared/components/layout/SectionNav";
import { recommendedPrograms } from "@/features/guide/data/mock-screens";

const programNav = [
  { href: "/programs", label: "전체 프로그램" },
  { href: "/programs/recommend", label: "추천 프로그램" },
  { href: "/events", label: "이벤트 프로그램" },
  { href: "/programs/group", label: "단체 체험 문의" },
];

export default function RecommendPage() {
  return (
    <PreviewPage title="추천 프로그램" description="별점과 후기가 좋은 체험을 너바나가 골라 모았어요. (시안 기준: 별점 4.8 이상)">
      <SectionNav label="프로그램 예약 메뉴" items={programNav} current="/programs/recommend" />
      <div className="grid gap-4 md:grid-cols-3">
        {recommendedPrograms.map((program) => (
          <Link key={program.id} href={`/programs/${program.id}`} className="overflow-hidden rounded-2xl border border-border bg-white">
            <Image src={program.img} alt="" width={480} height={160} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-primary">{program.title}</h2>
              <p className="text-sm text-muted">{program.temple} · 별점 {program.rate.toFixed(1)}</p>
              <p className="mt-2 text-sm font-bold">{program.price.toLocaleString("ko-KR")}원</p>
            </div>
          </Link>
        ))}
      </div>
    </PreviewPage>
  );
}
