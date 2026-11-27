import Link from "next/link";
import type { SignupSummary } from "@/features/auth/types/signup";
import { primaryButtonClassName } from "@/shared/components/ui/Button";

type SignupCompleteProps = {
  summary: SignupSummary;
};

/** 보조 링크 버튼 (홈으로) */
const secondaryLinkClass =
  "inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-4 font-bold text-ink transition-colors hover:border-primary hover:bg-subtle";

/**
 * ④ 가입 완료.
 * 가입 응답(202 Accepted)에는 userUuid만 오고, 닉네임은 가입 후 백엔드가 Kafka로 만들기 때문에 입력한 이름으로 인사합니다.
 * 자동 로그인은 없으므로 로그인 화면으로 안내합니다.
 */
export default function SignupComplete({ summary }: SignupCompleteProps) {
  const rows = [
    { label: "이메일", value: summary.email },
    { label: "이름", value: summary.name },
    { label: "휴대폰", value: summary.phone },
  ];

  return (
    <section aria-labelledby="signup-complete-title" className="text-center">
      <p
        aria-hidden="true"
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-action text-2xl font-bold text-primary"
      >
        ✓
      </p>
      <h3 id="signup-complete-title" className="mt-8 text-2xl font-bold text-ink">
        {summary.name}님, 가입을 환영합니다
      </h3>
      <p className="mt-2 text-sm text-muted">로그인하고 고요한 사찰 체험을 예약해 보세요.</p>

      <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-white px-5 text-left text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-4 py-4">
            <dt className="w-16 shrink-0 text-muted">{row.label}</dt>
            <dd className="min-w-0 break-all font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      {/* API 연결 전 임시 동작이라는 안내 */}
      <p className="mt-4 text-xs text-muted/70">임시 화면이에요. 실제 가입은 아직 되지 않아요.</p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link href="/login" className={`${primaryButtonClassName} flex-1`}>
          로그인하기
        </Link>
        <Link href="/" className={`${secondaryLinkClass} flex-1`}>
          홈으로
        </Link>
      </div>
    </section>
  );
}
