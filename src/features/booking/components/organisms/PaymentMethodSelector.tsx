import type { BookingPaymentMethod } from "@/features/booking/types/booking";

type PaymentMethodSelectorProps = {
  /** 현재 선택된 결제수단. 선택 전에는 null */
  value: BookingPaymentMethod | null;
  /** 사용자가 결제수단을 선택하면 상위 컴포넌트에 전달 */
  onChange: (method: BookingPaymentMethod) => void;
};

// DDL에 정의된 결제수단만 제공합니다.
const paymentMethods: {
  value: BookingPaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "CARD",
    label: "신용·체크카드",
    description: "PG 결제창을 통해 카드 결제를 진행할 예정입니다.",
  },
  {
    value: "VIRTUAL_ACCOUNT",
    label: "가상계좌",
    description: "PG를 통해 가상계좌를 발급받을 예정입니다.",
  },
];

/**
 * 결제수단 선택 Organism
 * - 결제수단 선택 UI만 담당합니다.
 * - 실제 결제 요청 및 PG 연동은 담당하지 않습니다.
 */
export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <section aria-labelledby="payment-method-title">
      <h2 id="payment-method-title" className="text-xl font-bold text-ink">
        결제수단
      </h2>

      <p className="mt-2 text-sm text-muted">원하는 결제수단을 선택해 주세요.</p>

      <fieldset className="mt-5 space-y-3">
        <legend className="sr-only">결제수단 선택</legend>

        {paymentMethods.map((method) => {
          const isSelected = value === method.value;

          return (
            <label
              key={method.value}
              className={`flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-colors ${
                isSelected
                  ? "border-primary bg-subtle"
                  : "border-border bg-white hover:border-primary"
              }`}
            >
              <input
                type="radio"
                name="booking-payment-method"
                value={method.value}
                checked={isSelected}
                onChange={() => onChange(method.value)}
                className="mt-1 h-4 w-4 accent-primary"
              />

              <span className="min-w-0">
                <span className="block font-bold text-ink">{method.label}</span>

                <span className="mt-1 block text-sm leading-6 text-muted">
                  {method.description}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </section>
  );
}
