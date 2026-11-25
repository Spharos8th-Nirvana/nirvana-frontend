import Link from "next/link";
import type { ReactNode } from "react";
import CompareSelectButton from "@/features/program/components/molecules/CompareSelectButton";
import { LikeProgramButton } from "@/features/guide/components/molecules/LikeProgramButton";
import ProgramGallery from "@/features/program/components/organisms/ProgramGallery";
import type { Program } from "@/features/program/data/programs";
import { formatStay } from "@/features/program/utils/booking";

type ProgramOverviewProps = {
  program: Program;
};

/** 선 아이콘 공통 속성 (lucide 스타일) */
function LineIcon({ children, className = "h-4 w-4 text-muted" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

const MapPinIcon = () => (
  <LineIcon>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </LineIcon>
);

const GlobeIcon = () => (
  <LineIcon className="h-3.5 w-3.5 text-primary">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </LineIcon>
);

const MailIcon = () => (
  <LineIcon>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </LineIcon>
);

const PhoneIcon = () => (
  <LineIcon>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </LineIcon>
);

const ArrowUpRightIcon = () => (
  <LineIcon className="h-4 w-4 text-ink">
    <path d="M7 17 17 7M7 7h10v10" />
  </LineIcon>
);

/** 연락처 한 항목: 아이콘 + 값 (항목 이름은 화면 낭독기용) */
function ContactItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <dt className="flex items-center">
        {icon}
        <span className="sr-only">{label}</span>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

/**
 * 프로그램 상세 상단 정보 (피그마 PC B · 03 체험 상세 참고)
 * 위: 분류·외국어 지원 칩, 제목, 장소·연락처, 오른쪽 "사찰 안내" 버튼
 * 아래: 사진 최대 3장 (큰 사진 1장 + 작은 사진 2장)
 */
export default function ProgramOverview({ program }: ProgramOverviewProps) {
  const stay = formatStay(program.nights);

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {/* 칩 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-action px-3 py-1 text-xs font-bold text-primary">
              {program.category} · {stay}
            </span>
            {program.languageSupport && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-bold text-primary">
                <GlobeIcon />
                외국어 지원
              </span>
            )}
          </div>

          {/* 제목 */}
          <h1 className="mt-4 text-3xl font-bold leading-snug text-ink md:text-[40px] md:leading-tight">
            {program.name}
          </h1>

          {/* 장소 */}
          <p className="mt-5 flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon />
            {program.temple} · {program.templeAddress}
          </p>

          {/* 연락처 */}
          <dl className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <ContactItem icon={<MailIcon />} label="담당자 이메일" value={program.contactEmail} />
            <ContactItem icon={<PhoneIcon />} label="사찰 전화번호" value={program.templePhone} />
          </dl>
        </div>

        {/* 사찰 안내 (피그마 오른쪽 알약 버튼) */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <LikeProgramButton programId={program.id} programName={program.name} />
          <CompareSelectButton programId={program.id} />
          <Link
            href={`/temples/${program.templeId}`}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-primary"
          >
            사찰 안내
            <ArrowUpRightIcon />
          </Link>
        </div>
      </div>

      <ProgramGallery images={program.gallery} name={program.name} caption={program.summary} />
    </div>
  );
}
