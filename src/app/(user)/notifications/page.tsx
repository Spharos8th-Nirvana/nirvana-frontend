import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { NotificationList } from "@/features/guide/components/organisms/NotificationList";

export default function NotificationsPage() {
  return (
    <PreviewPage title="알림" description="예약 확정 · 취소 · 이용 완료 소식을 모아 보여 줘요.">
      <NotificationList />
    </PreviewPage>
  );
}
