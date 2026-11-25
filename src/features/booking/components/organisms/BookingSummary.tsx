import Image from "next/image";
import Link from "next/link";
import type { BookingSelection } from "@/features/booking/types/booking";
import { formatWon } from "@/shared/utils/format";

type BookingSummaryProps = {
  selection: BookingSelection;
  canSubmit: boolean;
  /** 아직 채우지 않은 필수 항목 이름 */
  missingItems: string[];
  submitted: boolean;
  onSubmit: () => void;
};

/** 오른쪽 예약 요약 + 다음 단계 버튼 */
export default function BookingSummary({
  selection,
  canSubmit,
  missingItems,
  submitted,
  onSubmit,
}: BookingSummaryProps) {
  const headcount = [
    selection.adultCount > 0 ? `성인 ${selection.adultCount}명` : null,
    selection.youthCount > 0 ? `청소년 ${selection.youthCount}명` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const breakdown = [
    selection.adultCount > 0
      ? `${formatWon(selection.adultPrice)} × 성인 ${selection.adultCount}명`
      : null,
    selection.youthCount > 0
      ? `${formatWon(selection.youthPrice)} × 청소년 ${selection.youthCount}명`
      : null,
  ]
    .filter(Boolean)
    .join(" + ");

  const visibleMissing = missingItems.slice(0, 3);
  const restCount = missingItems.length - visibleMissing.length;

  return (
    <section
      aria-labelledby="summary-title"
      className="rounded-lg border border-border bg-white p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="summary-title" className="text-xl font-bold text-ink">
          선택한 체험
        </h2>
        <Link
          href={selection.editHref}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
        >
          날짜·인원 변경
        </Link>
      </div>

      <div className="relative mt-4 aspect-[360/170] overflow-hidden rounded-md bg-subtle">
        <Image
          src={selection.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 340px, 100vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-ink">{selection.programName}</h3>
      <p className="mt-2 text-sm text-muted">
        {selection.templeName} · {selection.category}
      </p>

      <dl className="mt-5 space-y-3 border-y border-border py-5 text-sm">
        <div className="flex gap-4">
          <dt className="w-20 shrink-0 text-muted">참여 날짜</dt>
          <dd className="font-medium text-ink">{selection.scheduleLabel}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-20 shrink-0 text-muted">머무는 기간</dt>
          <dd className="font-medium text-ink">
            {selection.stayLabel} · {selection.timeLabel}
          </dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-20 shrink-0 text-muted">참가 인원</dt>
          <dd className="font-medium text-ink">{headcount}</dd>
        </div>
      </dl>

      <p className="mt-5 text-sm text-muted">총 결제 예정 금액</p>
      <p className="mt-1 text-3xl font-bold text-ink">{formatWon(selection.totalPrice)}</p>
      <p className="mt-1 text-xs text-muted">{breakdown}</p>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-action py-4 font-bold text-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        결제 정보 확인
        <span aria-hidden="true">→</span>
      </button>

      <div className="mt-3 text-xs" aria-live="polite">
        {submitted ? (
          <p className="rounded-md bg-subtle px-3 py-2 text-ink">
            결제 확인 단계는 준비 중이에요. 입력한 정보는 저장되지 않았어요.
          </p>
        ) : canSubmit ? (
          <p className="text-muted">다음 단계에서 결제 내용을 확인합니다.</p>
        ) : (
          <p className="text-muted">
            필수 항목을 채워 주세요: {visibleMissing.join(", ")}
            {restCount > 0 && ` 외 ${restCount}개`}
          </p>
        )}
      </div>
    </section>
  );
}
