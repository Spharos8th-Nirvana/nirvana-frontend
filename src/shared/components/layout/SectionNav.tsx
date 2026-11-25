import Link from "next/link";

type SectionNavProps = {
  label: string;
  items: { href: string; label: string }[];
  current: string;
};

/** 시안 상단 묶음 메뉴. 현재 주소만 강조합니다. */
export function SectionNav({ label, items, current }: SectionNavProps) {
  return (
    <nav aria-label={label} className="mb-8 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === current ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-sm ${
            item.href === current ? "border-primary bg-primary text-white" : "border-border bg-white text-primary"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
