import Link from "next/link";

type CommunityNavigationProps = {
  activePage: "community" | "notices";
};

const navigationItems = [
  { href: "/community", label: "커뮤니티", page: "community" },
  { href: "/community/notices", label: "공지사항", page: "notices" },
  { href: "/community/faq", label: "자주 묻는 질문", page: "faq" },
] as const;

export default function CommunityNavigation({ activePage }: CommunityNavigationProps) {
  return (
    <nav aria-label="커뮤니티 메뉴" className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1200px] px-6 md:px-10">
        {navigationItems.map((item) => {
          const isActive = item.page === activePage;

          return (
            <Link
              key={item.page}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "border-b-2 border-primary px-5 py-4 text-sm font-bold text-primary"
                  : "px-5 py-4 text-sm text-muted transition-colors hover:text-primary"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
