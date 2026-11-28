"use client";

import { useRef, useState } from "react";
import { requestWithdrawal } from "@/features/auth/api/account-api";

type WithdrawalStatus = "idle" | "submitting" | "requested" | "error";

/** 회원 탈퇴: 안내 → 확인 창(동의 체크) → 탈퇴 신청 */
export default function WithdrawalSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState<WithdrawalStatus>("idle");

  const openDialog = () => {
    setAcknowledged(false);
    setStatus("idle");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleConfirm = async () => {
    setStatus("submitting");
    const result = await requestWithdrawal();
    setStatus(result.ok ? "requested" : "error");
    if (result.ok) {
      closeDialog();
    }
  };

  if (status === "requested") {
    return (
      <section
        aria-labelledby="withdrawal-title"
        className="rounded-default border border-border bg-surface p-5 md:p-7"
      >
        <h3 id="withdrawal-title" className="text-base font-bold text-ink">
          회원 탈퇴
        </h3>
        <p role="status" className="mt-2 text-sm text-ink">
          탈퇴 신청을 받았어요. 처리되면 로그인할 수 없어요.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="withdrawal-title"
      className="rounded-default border border-border bg-surface p-5 md:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 id="withdrawal-title" className="text-base font-bold text-ink">
            회원 탈퇴
          </h3>
          <p className="mt-1 text-sm text-muted">
            탈퇴하면 예약 내역, 후기, 패스포트를 볼 수 없어요.
          </p>
        </div>
        <button
          type="button"
          onClick={openDialog}
          className="h-11 shrink-0 rounded-full border border-border px-6 text-sm font-bold text-error transition-colors hover:border-error hover:bg-error/5"
        >
          탈퇴 신청
        </button>
      </div>

      {/* 브라우저 기본 대화상자: 포커스 가두기와 Esc 닫기를 브라우저가 처리합니다. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="withdrawal-dialog-title"
        aria-describedby="withdrawal-dialog-desc"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-default bg-surface p-6 text-ink shadow-xl backdrop:bg-black/40"
      >
        <h4 id="withdrawal-dialog-title" className="text-lg font-bold">
          정말 탈퇴할까요?
        </h4>
        <ul
          id="withdrawal-dialog-desc"
          className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted"
        >
          <li>탈퇴 신청 후에는 로그인할 수 없어요.</li>
          <li>예약 내역, 후기, 패스포트 기록을 더 이상 볼 수 없어요.</li>
          <li>진행 중인 예약이 있다면 먼저 확인해 주세요.</li>
        </ul>

        <label className="mt-5 flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          안내를 확인했고 탈퇴에 동의해요.
        </label>

        {status === "error" && (
          <p role="alert" className="mt-3 text-sm text-error">
            탈퇴 신청을 하지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeDialog}
            className="h-11 rounded-full border border-border px-5 text-sm font-bold text-ink transition-colors hover:bg-subtle"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!acknowledged || status === "submitting"}
            className="h-11 rounded-full bg-error px-5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "submitting" ? "신청 중…" : "탈퇴 신청"}
          </button>
        </div>
      </dialog>
    </section>
  );
}
