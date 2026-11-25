import Link from "next/link";
import { NewsletterForm } from "@/shared/components/layout/NewsletterForm";

const footerMenus = [
  {
    title: "탐색",
    links: [
      { label: "사찰", href: "/temples" },
      { label: "프로그램", href: "/programs" },
      { label: "커뮤니티", href: "/community" },
      { label: "공지사항", href: "/community/notices" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "자주 묻는 질문", href: "/support/faq" },
      { label: "1:1 문의", href: "/support/inquiry" },
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "너바나 소개", href: "/about" },
      { label: "서비스 소개", href: "/about/service" },
      { label: "제휴 문의", href: "/support/partnership" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-background px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-14 md:px-10 md:pt-16">
      <div className="mx-auto max-w-6xl">
        {/* 푸터 상단 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-border pb-8 sm:grid-cols-4 sm:gap-8 sm:pb-10 md:pb-12">
          {/* 로고 및 소개 */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wide text-primary"
            >
              NIRVANA
            </Link>

            <p className="mt-3 text-xs leading-6 text-muted sm:mt-4">
              일상과 산사 사이,
              <br />
              나를 위한 작은 여행.
            </p>
          </div>

          {/* 메뉴 */}
          {footerMenus.map((menu) => (
            <div key={menu.title}>
              <h3 className="mb-3 text-xs font-semibold text-primary sm:mb-4 sm:text-sm">
                {menu.title}
              </h3>

              <ul className="space-y-3">
                {menu.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-muted transition-colors hover:text-sage-07 sm:text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 푸터 하단 */}
        <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted sm:text-[11px]">
            <Link href="/terms">이용약관</Link>

            <Link href="/privacy" className="font-semibold">
              개인정보처리방침
            </Link>

            <Link href="/support/inquiry">문의하기</Link>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-muted sm:text-xs">
            <span>Instagram</span>
            <span>Blog</span>
          </div>
        </div>

        {/* 시안 뉴스레터 */}
        <div className="mt-6 rounded-2xl bg-primary px-5 py-5 text-white/80 sm:px-6">
          <h3 className="text-sm font-semibold text-white">뉴스레터 구독</h3>
          <p className="mt-1 text-[13.5px] leading-7">
            새로운 프로그램과 특별한 소식을 가장 먼저 받아보세요.
          </p>
          <NewsletterForm />
        </div>

        {/* 저작권 */}
        <div className="mt-4 border-t border-border pt-4 sm:mt-5 sm:pt-5">
          <p className="text-[10px] text-muted/70">
            © 2026 NIRVANA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
