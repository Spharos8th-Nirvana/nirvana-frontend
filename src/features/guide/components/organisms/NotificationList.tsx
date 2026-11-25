"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  markAllNoticesRead,
  markNoticeRead,
  noticesServerSnapshot,
  noticesSnapshot,
  parseNotices,
  subscribeNotices,
} from "@/features/guide/utils/preview-notices";
import {
  previewLoginServerSnapshot,
  previewLoginSnapshot,
  safeNextPath,
  subscribePreviewLogin,
} from "@/features/guide/utils/preview-login";

export function NotificationList() {
  const router = useRouter();
  const loggedIn = useSyncExternalStore(subscribePreviewLogin, previewLoginSnapshot, previewLoginServerSnapshot) === "1";
  const raw = useSyncExternalStore(subscribeNotices, noticesSnapshot, noticesServerSnapshot);
  const notices = parseNotices(raw);
  const unread = notices.filter((item) => !item.read).length;

  useEffect(() => {
    if (loggedIn) {
      return;
    }
    router.replace(`/login?next=${encodeURIComponent(safeNextPath("/notifications"))}`);
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p>안 읽은 알림 <b>{unread}</b>개</p>
        <button type="button" onClick={() => markAllNoticesRead()} className="rounded-full border px-3 py-1.5 text-sm">모두 읽음으로</button>
      </div>
      {notices.length === 0 ? <p className="font-bold">알림이 없어요.</p> : null}
      <ul className="space-y-3">
        {notices.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                markNoticeRead(item.id);
                router.push(item.to || "/");
              }}
              className={`block w-full rounded-xl border p-4 text-left ${item.read ? "border-border" : "border-primary"}`}
            >
              <p>{item.text}</p>
              <time className="text-xs text-muted">{item.date}</time>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">시안은 화면 안 알림만 보여 줘요. 알림 종류 · 받는 방법은 팀에서 정해요.</p>
    </div>
  );
}

/** 헤더에 안 읽은 알림 개수를 보여 줍니다. */
export function NotificationBadge() {
  const raw = useSyncExternalStore(subscribeNotices, noticesSnapshot, noticesServerSnapshot);
  const unread = parseNotices(raw).filter((item) => !item.read).length;
  if (!unread) {
    return null;
  }
  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-action px-1 text-[10px] font-bold text-primary">
      {unread}
    </span>
  );
}
