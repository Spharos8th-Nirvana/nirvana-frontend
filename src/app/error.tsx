"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * 본문을 그리다 오류가 났을 때 보여 주는 공통 화면입니다. (U-003)
 * Next.js는 이 파일을 클라이언트 컴포넌트로만 받습니다.
 */
export default function Error({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-background px-6 py-24">
      <div role="alert" className="max-w-md text-center">
        <p className="font-display text-label-12 font-bold tracking-[0.25em] text-sage-07">
          NIRVANA
        </p>

        <h1 className="mt-4 font-serif text-heading-36 font-bold text-primary">
          화면을 불러오지 못했습니다
        </h1>

        <p className="mt-3 text-body-15 text-muted">
          잠시 연결이 불안정합니다. 다시 시도하거나 홈으로 돌아가 주세요.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-primary px-5 py-2.5 text-label-14 font-bold text-white transition-colors hover:bg-primary-hover"
          >
            다시 시도
          </button>

          <Link
            href="/"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-label-14 font-bold text-primary transition-colors hover:border-primary"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
