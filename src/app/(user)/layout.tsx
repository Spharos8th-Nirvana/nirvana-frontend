import type { ReactNode } from "react";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";

type UserLayoutProps = Readonly<{
  children: ReactNode;
}>;

/** 사용자 화면 공통 레이아웃: 헤더와 푸터를 붙입니다. */
export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
