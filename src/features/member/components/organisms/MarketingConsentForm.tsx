"use client";

import { useState } from "react";
import { updateMarketingConsent } from "@/features/member/api/profile-api";
import type { MarketingConsent } from "@/features/member/types/profile";
import { formatConsentDate } from "@/features/member/utils/validate-profile";

type MarketingConsentFormProps = {
  consent: MarketingConsent;
};

const channels = [
  { key: "email", label: "이메일", allowedKey: "emailAllowed", dateKey: "emailConsentedAt" },
  { key: "sms", label: "SMS", allowedKey: "smsAllowed", dateKey: "smsConsentedAt" },
] as const;

/** 마케팅 수신: 이메일·SMS 각각 켜고 끄기 (누르면 바로 저장) */
export default function MarketingConsentForm({
  consent: initialConsent,
}: MarketingConsentFormProps) {
  const [consent, setConsent] = useState(initialConsent);
  const [savingChannel, setSavingChannel] = useState<"email" | "sms" | null>(null);

  const toggle = async (channel: "email" | "sms", allowed: boolean) => {
    setSavingChannel(channel);
    setConsent(await updateMarketingConsent(consent, channel, allowed));
    setSavingChannel(null);
  };

  return (
    <section
      aria-labelledby="marketing-title"
      className="rounded-default border border-border bg-surface p-5 md:p-7"
    >
      <h3 id="marketing-title" className="text-base font-bold text-ink">
        알림 수신
      </h3>
      <p className="mt-1 text-sm text-muted">
        템플스테이 주요 사업 안내, 행사 일정 등을 받을지 정해요.
      </p>

      <ul className="mt-5 divide-y divide-border">
        {channels.map((channel) => {
          const allowed = consent[channel.allowedKey];
          const consentedAt = consent[channel.dateKey];

          return (
            <li key={channel.key} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p id={`marketing-${channel.key}`} className="font-medium text-ink">
                  {channel.label} 수신
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {allowed && consentedAt
                    ? `${formatConsentDate(consentedAt)}에 동의했어요`
                    : "받지 않아요"}
                </p>
              </div>
              {/* 켜고 끄는 스위치. role="switch"와 aria-checked로 지금 상태를 알려 줍니다. */}
              <button
                type="button"
                role="switch"
                aria-checked={allowed}
                aria-labelledby={`marketing-${channel.key}`}
                disabled={savingChannel !== null}
                onClick={() => toggle(channel.key, !allowed)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:cursor-wait disabled:opacity-60 ${
                  allowed ? "bg-primary" : "bg-sage-03"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                    allowed ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
