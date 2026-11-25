import Link from "next/link";
import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { previewTemples } from "@/features/guide/data/mock-screens";

export default function PassportPage() {
  return (
    <PreviewPage title="사찰 패스포트" description="체험을 마친(이용 완료) 사찰에 도장이 찍혀요.">
      <p className="text-sm text-muted">도장 디자인은 팀 ERD stampTemplateVersions로 관리해요.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {previewTemples.map((temple) => (
          <div key={temple.id} className="rounded-2xl border border-dashed border-border bg-white p-4 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-dashed text-lg text-muted">?</span>
            <b className="mt-3 block">{temple.name}</b>
            <small className="text-muted">아직 없음</small>
          </div>
        ))}
      </div>
      <Link href="/mypage" className="mt-6 inline-block text-sm font-bold">마이페이지</Link>
    </PreviewPage>
  );
}
