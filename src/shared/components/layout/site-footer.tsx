import Link from "next/link";

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
    <footer className="bg-[bg-background] px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-14 md:px-10 md:pt-16">
      <div className="mx-auto max-w-6xl">
        {/* 푸터 상단 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-[#D8D0C0] pb-8 sm:grid-cols-4 sm:gap-8 sm:pb-10 md:pb-12">
          {/* 로고 및 소개 */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wide text-primary"
            >
              NIRVANA
            </Link>

            <p className="mt-3 text-xs leading-6 text-[#756F62] sm:mt-4">
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
                      className="text-[11px] text-[#756F62] transition-colors hover:text-[#B75D32] sm:text-xs"
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
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#756F62] sm:text-[11px]">
            <Link href="/terms">이용약관</Link>

            <Link href="/privacy" className="font-semibold">
              개인정보처리방침
            </Link>

            <Link href="/support/inquiry">문의하기</Link>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#756F62] sm:text-xs">
            <span>Instagram</span>
            <span>Blog</span>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-4 border-t border-[#D8D0C0] pt-4 sm:mt-5 sm:pt-5">
          <p className="text-[10px] text-[#9A9184]">
            © 2026 NIRVANA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
