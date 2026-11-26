import type { SignupTerm } from "@/features/auth/types/signup";
import Button from "@/shared/components/ui/Button";

type SignupTermsStepProps = {
  terms: SignupTerm[];
  agreedTermIds: string[];
  onToggle: (termId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onNext: () => void;
};

/** ① 필수 약관 동의. 모두 동의해야 다음 단계로 갈 수 있습니다. */
export default function SignupTermsStep({
  terms,
  agreedTermIds,
  onToggle,
  onToggleAll,
  onNext,
}: SignupTermsStepProps) {
  const allAgreed = terms.every((term) => agreedTermIds.includes(term.id));

  return (
    <section aria-labelledby="signup-terms-title">
      <h3 id="signup-terms-title" className="text-2xl font-bold text-ink">
        약관 동의
      </h3>
      <p className="mt-2 text-sm text-muted">회원가입을 위해 아래 약관에 모두 동의해 주세요.</p>

      {/* 전체 동의 */}
      <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-primary bg-subtle px-5 py-4">
        <input
          type="checkbox"
          checked={allAgreed}
          onChange={(event) => onToggleAll(event.target.checked)}
          className="h-5 w-5 shrink-0 accent-primary"
        />
        <span className="font-bold text-ink">전체 동의</span>
      </label>

      {/* 약관 하나씩 */}
      <ul className="mt-3 space-y-3">
        {terms.map((term) => {
          const inputId = `signup-term-${term.id}`;

          return (
            <li key={term.id} className="rounded-lg border border-border bg-white">
              <div className="flex items-center gap-3 px-5 py-4">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={agreedTermIds.includes(term.id)}
                  onChange={(event) => onToggle(term.id, event.target.checked)}
                  className="h-5 w-5 shrink-0 accent-primary"
                />
                <label htmlFor={inputId} className="flex-1 cursor-pointer text-sm text-ink">
                  <span className="font-bold">[필수]</span> {term.title}
                </label>
              </div>

              <details className="group border-t border-border px-5 py-3 text-xs">
                <summary className="cursor-pointer list-none text-muted hover:text-ink">
                  내용 보기 <span className="group-open:hidden">▾</span>
                  <span className="hidden group-open:inline">▴</span>
                </summary>
                <p className="mt-2 leading-6 text-muted">{term.content}</p>
              </details>
            </li>
          );
        })}
      </ul>

      <Button onClick={onNext} disabled={!allAgreed} className="mt-8 w-full">
        다음 <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
