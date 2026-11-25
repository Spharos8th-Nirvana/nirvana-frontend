"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NotificationBadge } from "@/features/guide/components/organisms/NotificationList";

const navItems = [
  {
    label: "사찰",
    href: "/temples",
    children: [
      { label: "사찰 찾기", href: "/temples" },
      { label: "지역별 사찰 지도", href: "/temples/map" },
      { label: "템플스테이란?", href: "/about/templestay" },
    ],
  },
  {
    label: "프로그램 예약",
    href: "/programs",
    children: [
      { label: "전체 프로그램", href: "/programs" },
      { label: "추천 체험", href: "/programs/recommend" },
      { label: "이벤트 체험", href: "/events" },
      { label: "단체 체험 문의", href: "/programs/group" },
    ],
  },
  {
    label: "커뮤니티",
    href: "/community",
    children: [
      { label: "동호회", href: "/community/clubs" },
      { label: "체험 후기", href: "/community/reviews" },
      { label: "공지사항", href: "/community/notices" },
    ],
  },
  {
    label: "ABOUT",
    href: "/about",
    children: [
      { label: "템플스테이란?", href: "/about/templestay" },
      { label: "너바나 소개", href: "/about" },
      { label: "고객센터", href: "/support" },
    ],
  },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [langNote, setLangNote] = useState("");
  const previousScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousY = previousScrollY.current;

      // 페이지 최상단에서는 헤더 표시
      if (currentScrollY <= 20) {
        setIsHeaderVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);

        // 아래로 스크롤하면 헤더 숨기기
        if (currentScrollY > previousY) {
          setIsHeaderVisible(false);
        }

        // 위로 스크롤하면 헤더 표시
        if (currentScrollY < previousY) {
          setIsHeaderVisible(true);
        }
      }

      previousScrollY.current = currentScrollY;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 기본은 흰 배경 헤더입니다. 최상단(스크롤 전)이면서 페이지에 hero가 있을 때만
  // over-hero: 스타일(투명 배경, 흰 글씨)이 적용됩니다. (globals.css의 over-hero 변형)
  const headerTone = isScrolled
    ? "border-border bg-white/95 text-primary shadow-sm backdrop-blur-lg"
    : "border-border bg-white/95 text-primary shadow-sm backdrop-blur-lg over-hero:border-white/20 over-hero:bg-transparent over-hero:text-white over-hero:shadow-none over-hero:backdrop-blur-none";
  const textColor = isScrolled
    ? "text-primary"
    : "text-primary over-hero:text-white";
  const separatorColor = isScrolled
    ? "text-sage-05"
    : "text-sage-05 over-hero:text-white/50";
  const subTextColor = isScrolled
    ? "text-primary/60"
    : "text-primary/60 over-hero:text-white/60";
  const loginTone = isScrolled
    ? "border-primary hover:bg-primary hover:!text-white"
    : "border-primary hover:bg-primary hover:!text-white over-hero:border-white over-hero:hover:bg-white over-hero:hover:!text-primary";
  const mobileMenuTone = isScrolled
    ? "border-border bg-background"
    : "border-border bg-background over-hero:border-white/20 over-hero:bg-primary/95 over-hero:backdrop-blur-md";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-1000 ease-in-out ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      } ${headerTone}`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-10">
        {/* 로고 */}
        <Link
          href="/"
          className={`font-serif text-2xl font-bold tracking-wide ${textColor}`}
        >
          NIRVANA
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden translate-y-0.5 items-center gap-8 md:flex">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className={`relative text-sm font-bold after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:font-bold hover:after:left-0 hover:after:w-full ${textColor}`}
              >
                {item.label}
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-border bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {item.children.map((child) => (
                  <Link key={child.href + child.label} href={child.href} className="block rounded-md px-3 py-2 text-sm text-ink-nav hover:bg-subtle hover:text-primary">
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-3">
          {/* 언어 선택 */}
          <div
            className={`hidden items-center gap-2 text-xs sm:flex ${textColor}`}
          >
            <button type="button" className="font-semibold" aria-pressed="true" onClick={() => setLangNote("")}>
              KR
            </button>
            <span className={separatorColor}>|</span>
            <button
              type="button"
              className={subTextColor}
              onClick={() => setLangNote("영어 화면은 같은 주소의 영어판(/en/…)으로 바뀔 예정이에요 (시안).")}
            >
              EN
            </button>
          </div>

          <Link href="/notifications" className={`hidden text-xs sm:inline ${textColor}`}>
            알림
            <NotificationBadge />
          </Link>
          <Link href="/mypage" className={`hidden text-xs sm:inline ${textColor}`}>
            마이페이지
          </Link>

          {/* 로그인 */}
          <Link
            href="/login"
            className={`rounded-full border px-4 py-2 text-xs transition-[color,border-color,background-color] duration-1000 ease-in-out ${textColor} ${loginTone}`}
          >
            로그인
          </Link>

          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`flex h-9 w-9 items-center justify-center text-2xl md:hidden ${textColor}`}
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className={`border-t px-6 py-4 md:hidden ${mobileMenuTone}`}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-all hover:font-bold ${textColor}`}
                >
                  {item.label}
                </Link>
                {item.children.map((child) => (
                  <Link
                    key={child.href + child.label}
                    href={child.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`pl-3 text-xs ${subTextColor}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/notifications" onClick={() => setIsMenuOpen(false)} className={`text-sm ${textColor}`}>알림<NotificationBadge /></Link>
            <Link href="/mypage" onClick={() => setIsMenuOpen(false)} className={`text-sm ${textColor}`}>마이페이지</Link>
          </div>
        </nav>
      )}
      {langNote ? <p className="bg-primary px-6 py-2 text-center text-xs text-white" role="status">{langNote}</p> : null}
    </header>
  );
}
