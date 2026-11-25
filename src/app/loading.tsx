/**
 * 페이지를 불러오는 동안 보여 주는 공통 화면입니다.
 * 헤더와 푸터는 루트 레이아웃에 그대로 있고, 이 화면은 그 사이 본문만 바꿉니다.
 */
export default function Loading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-background px-6 py-24">
      {/* 스크린 리더가 불러오는 중임을 차분히 알리도록 status로 표시합니다. */}
      <div role="status" aria-live="polite" aria-busy="true" className="text-center">
        <p className="font-display text-label-12 font-bold tracking-[0.25em] text-sage-07">
          NIRVANA
        </p>

        <h1 className="mt-4 font-serif text-heading-36 font-bold text-primary">
          고요히 불러오고 있습니다
        </h1>

        <p className="mt-3 text-body-15 text-muted">잠시만 기다려 주세요.</p>

        {/* 글만으로도 상태를 알 수 있게, 점은 장식입니다. */}
        <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-sage-03 motion-safe:animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse [animation-delay:200ms]" />
          <span className="h-2 w-2 rounded-full bg-action motion-safe:animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </main>
  );
}
