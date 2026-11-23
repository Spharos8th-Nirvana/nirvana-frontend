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

  const textColor = isScrolled ? "text-primary" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-1000 ease-in-out ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "border-b border-border bg-white/95 text-primary shadow-sm backdrop-blur-lg"
          : "border-b border-white/20 bg-transparent text-white"
      }`}
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
            <span className={isScrolled ? "text-[#EEE5D3]" : "text-white/50"}>
              |
            </span>
            <button
              type="button"
              className={isScrolled ? "text-primary/60" : "text-white/60"}
            >
              EN
            </button>
          </div>

          {/* 로그인 */}
          <Link
            href="/login"
            className={`rounded-full border px-4 py-2 text-xs transition-[color,border-color,background-color] duration-1000 ease-in-out ${textColor} ${
              isScrolled
                ? "border-primary hover:bg-primary hover:!text-white"
                : "border-white hover:bg-white hover:!text-primary"
            }`}
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
          className={`border-t px-6 py-4 md:hidden ${
            isScrolled
              ? "border-[#EEE5D3] bg-[bg-background]"
              : "border-white/20 bg-primary/95 backdrop-blur-md"
          }`}
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
