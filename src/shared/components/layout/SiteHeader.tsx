"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "사찰", href: "/temples" },
  { label: "프로그램 예약", href: "/programs" },
  { label: "커뮤니티", href: "/community" },
  { label: "ABOUT", href: "/about" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
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
            <Link
              key={item.label}
              href={item.href}
              className={`relative text-sm font-bold after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:font-bold hover:after:left-0 hover:after:w-full ${textColor}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-3">
          {/* 언어 선택 */}
          <div
            className={`hidden items-center gap-2 text-xs sm:flex ${textColor}`}
          >
            <button type="button" className="font-semibold">
              KR
            </button>
            <span className={separatorColor}>|</span>
            <button type="button" className={subTextColor}>
              EN
            </button>
          </div>

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
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-all hover:font-bold ${textColor}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
