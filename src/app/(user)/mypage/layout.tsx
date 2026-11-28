import type { ReactNode } from "react";
import MyPageSidebar from "@/features/member/components/organisms/MyPageSidebar";
import PageHero from "@/shared/components/layout/PageHero";

type MyPageLayoutProps = Readonly<{
  children: ReactNode;
}>;

/** 마이페이지 공통 틀: 왼쪽 메뉴 + 오른쪽 본문. 하위 주소(/mypage/...)도 이 틀을 함께 씁니다. */
export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="마이페이지"
        description="예약한 체험과 나의 기록을 한곳에서 확인하세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-12 md:flex-row md:gap-12 md:py-16">
        <aside className="md:w-[200px] md:shrink-0">
          <MyPageSidebar />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
