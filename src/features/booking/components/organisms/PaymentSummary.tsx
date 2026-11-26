import { useState } from "react";
import type { BookingPaymentMethod, BookingSelection } from "@/features/booking/types/booking";
import { formatWon } from "@/shared/utils/format";
import Button from "@/shared/components/ui/Button";

type PaymentSummaryProps = {
  /** 1단계에서 선택한 예약 및 금액 정보 */
  selection: BookingSelection;
  /** 현재 선택한 결제수단. 선택 전에는 null */
  paymentMethod: BookingPaymentMethod | null;
  /** 결제하기 버튼 클릭 시 상위 Template에 전달 */
  onSubmit: () => void;
  /** 결제 버튼 클릭 후 표시할 안내 메시지 */
  noticeMessage: string | null;
};

/**
 * 결제 금액 및 결제 버튼 Organism
 * - 인원별 금액과 최종 결제 금액을 표시합니다.
 * - 결제수단이 선택된 경우에만 버튼을 활성화합니다.
 * - 실제 결제 요청이나 PG 연동은 담당하지 않습니다.
 */
export default function PaymentSummary({
  selection,
  paymentMethod,
  onSubmit,
  noticeMessage,
}: PaymentSummaryProps) {
  // Figma 결제 전 확인 체크박스의 화면 상태입니다.
  // 필수 동의 여부는 아직 확정되지 않았으므로 버튼 활성 조건에는 포함하지 않습니다.
  const [noticeChecked, setNoticeChecked] = useState(false);

  // 성인과 청소년의 인원별 금액을 계산합니다.
  const adultTotal = selection.adultPrice * selection.adultCount;
  const youthTotal = selection.youthPrice * selection.youthCount;

  return (
    <section
      aria-labelledby="payment-summary-title"
      className="rounded-lg border border-border bg-white p-6"
    >
      <h2 id="payment-summary-title" className="text-xl font-bold text-ink">
        결제 금액
      </h2>

      {/* 인원별 프로그램 금액 */}
      <dl className="mt-6 space-y-4 border-b border-border pb-5 text-sm">
        {selection.adultCount > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              성인 {selection.adultCount}명
              <span className="mt-1 block text-xs">
                {formatWon(selection.adultPrice)} × {selection.adultCount}
              </span>
            </dt>
            <dd className="font-medium text-ink">{formatWon(adultTotal)}</dd>
          </div>
        )}

        {selection.youthCount > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              청소년 {selection.youthCount}명
              <span className="mt-1 block text-xs">
                {formatWon(selection.youthPrice)} × {selection.youthCount}
              </span>
            </dt>
            <dd className="font-medium text-ink">{formatWon(youthTotal)}</dd>
          </div>
        )}
      </dl>

      {/* 서버에서 전달받은 최종 금액을 그대로 표시합니다. */}
      <div className="flex items-center justify-between gap-4 pt-5">
        <span className="font-bold text-ink">최종 결제 금액</span>
        <strong className="text-2xl font-bold text-primary">
          {formatWon(selection.totalPrice)}
        </strong>
      </div>

      {/* 결제 전 확인 체크박스. 실제 필수 약관과는 별도로 관리합니다. */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-md bg-subtle p-4">
        <input
          type="checkbox"
          checked={noticeChecked}
          onChange={(event) => setNoticeChecked(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <span className="text-sm leading-6 text-ink">결제 전 안내사항을 확인했습니다.</span>
      </label>

      {/* 결제수단을 선택해야 결제하기 버튼이 활성화됩니다. */}
      <Button onClick={onSubmit} disabled={!paymentMethod} className="mt-6 w-full">
        결제하기
      </Button>

      {/* 결제 버튼 클릭 시 실제 결제가 진행되지 않는다는 안내 표시 */}

      {noticeMessage && (
        <p
          className="mt-3 rounded-md bg-subtle px-3 py-3 text-sm leading-6 text-ink"
          role="status"
          aria-live="polite"
        >
          {noticeMessage}
        </p>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        현재는 테스트 화면으로 실제 결제가 진행되지 않습니다.
      </p>
    </section>
  );
}
