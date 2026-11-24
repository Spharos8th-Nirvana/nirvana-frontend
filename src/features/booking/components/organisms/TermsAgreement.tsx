import type { BookingTerm, RefundRule } from "@/features/booking/types/booking";

type TermsAgreementProps = {
  terms: BookingTerm[];
  agreedTermIds: string[];
  refundRules: RefundRule[];
  onToggle: (termId: string, checked: boolean) => void;
};

function formatRefundRule(rule: RefundRule) {
  const when =
    rule.deadlineDaysBefore === 0
      ? "이용일 당일"
      : `이용일 ${rule.deadlineDaysBefore}일 전까지`;
  return { when, rate: `${rule.refundRate}% 환불` };
}

/** 약관 동의와 사찰 취소·환불 규정 안내 */
export default function TermsAgreement({
  terms,
  agreedTermIds,
  refundRules,
  onToggle,
}: TermsAgreementProps) {
  const sortedRules = [...refundRules].sort(
    (a, b) => b.deadlineDaysBefore - a.deadlineDaysBefore,
  );

  return (
    <section aria-labelledby="terms-title">
      <h2 id="terms-title" className="text-2xl font-bold text-ink">
        약관 확인 및 동의
      </h2>
      <p className="mt-2 text-sm text-muted">필수 항목을 확인한 뒤 다음 단계로 진행해 주세요.</p>

      {/* 취소·환불 규정 (사찰 정책 안내) */}
      <div className="mt-6 rounded-lg border border-border bg-white p-6">
        <h3 className="font-bold text-ink">취소·환불 규정</h3>
        {sortedRules.length > 0 ? (
          <ul className="mt-4 divide-y divide-border text-sm">
            {sortedRules.map((rule) => {
              const { when, rate } = formatRefundRule(rule);
              return (
                <li key={rule.deadlineDaysBefore} className="flex justify-between py-2.5">
                  <span className="text-muted">{when}</span>
                  <span className="font-semibold text-ink">{rate}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">사찰의 환불 규정을 불러오지 못했어요.</p>
        )}
        <p className="mt-3 text-xs text-muted/70">
          예약 시점의 규정이 적용되며, 자세한 내용은 사찰에 문의해 주세요.
        </p>
      </div>

      {/* 약관 동의 */}
      <ul className="mt-4 space-y-3">
        {terms.map((term) => {
          const checked = agreedTermIds.includes(term.id);
          const inputId = `term-${term.id}`;

          return (
            <li key={term.id} className="rounded-lg border border-border bg-white">
              <div className="flex items-center gap-3 px-5 py-4">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggle(term.id, event.target.checked)}
                  className="h-5 w-5 shrink-0 accent-primary"
                />
                <label htmlFor={inputId} className="flex-1 cursor-pointer text-sm text-ink">
                  <span className={term.required ? "font-bold" : "text-muted"}>
                    [{term.required ? "필수" : "선택"}]
                  </span>{" "}
                  {term.title}에 동의합니다.
                </label>
              </div>

              <details className="group border-t border-border px-5 py-3 text-xs">
                <summary className="cursor-pointer list-none text-muted hover:text-ink">
                  내용 보기 <span className="group-open:hidden">▾</span>
                  <span className="hidden group-open:inline">▴</span>
                </summary>
                <p className="mt-2 leading-6 text-muted">{term.content}</p>
                <p className="mt-1 text-muted/70">버전 {term.version}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
