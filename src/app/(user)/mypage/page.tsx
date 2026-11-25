import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { MyPagePanel } from "@/features/guide/components/organisms/MyPagePanel";
import { demoUser } from "@/features/guide/data/mock-screens";

export default function MyPage() {
  return (
    <PreviewPage title="마이페이지" description={`${demoUser.name}님, 반가워요.`}>
      <MyPagePanel />
    </PreviewPage>
  );
}
