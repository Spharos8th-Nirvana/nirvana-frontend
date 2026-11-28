"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 마이페이지 메뉴 (와이어프레임 순서).
 * ready: false인 메뉴는 화면이 아직 없어서 누를 수 없고 "준비 중"으로 보입니다.
 * 화면을 만들면 ready를 true로 바꿉니다.
 */
const myPageMenus = [
  { label: "예약 내역", href: "/mypage", ready: true },
  { label: "패스포트", href: "/mypage/passport", ready: false },
  { label: "즐겨찾기", href: "/mypage/favorites", ready: false },
  { label: "후기 관리", href: "/mypage/reviews", ready: false },
  { label: "게시글", href: "/mypage/posts", ready: false },
  { label: "회원정보 수정", href: "/mypage/profile", ready: false },
];

export default function MyPageSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="마이페이지 메뉴"
      className="md:overflow-hidden md:rounded-default md:border md:border-border md:bg-surface"
    >
      {/* 휴대폰: 위쪽 가로 목록(옆으로 밀기) / 넓은 화면: 왼쪽 세로 목록 */}
      <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-col md:gap-0 md:divide-y md:divide-border md:overflow-visible md:px-0 md:pb-0">
        {myPageMenus.map((menu) => {
          if (!menu.ready) {
            return (
              <li key={menu.href} className="shrink-0">
                <span className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted/70 md:rounded-default md:px-4 md:py-3">
                  {menu.label}
                  <span className="rounded-full bg-subtle px-2 py-0.5 text-[11px] text-muted">
                    준비 중
                  </span>
                </span>
              </li>
            );
          }

          const isActive = pathname === menu.href;

          return (
            // 글자색은 <li>에 둡니다. globals.css의 a { color: inherit } 규칙이
            // 링크에 직접 준 text-* 색보다 우선해서, 링크는 부모 색을 물려받게 합니다.
            <li key={menu.href} className={`shrink-0 ${isActive ? "text-white" : "text-ink"}`}>
              <Link
                href={menu.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex rounded-full px-4 py-2 text-sm font-semibold transition md:rounded-none md:py-3 ${
                  isActive ? "bg-primary" : "hover:bg-subtle"
                }`}
              >
                {menu.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
