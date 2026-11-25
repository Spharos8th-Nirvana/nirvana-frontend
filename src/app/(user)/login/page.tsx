import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { LoginForm } from "@/features/guide/components/organisms/LoginForm";

export default function LoginPage() {
  return (
    <PreviewPage title="로그인" description="예약·찜·후기 쓰기는 로그인한 뒤에 할 수 있어요.">
      <LoginForm />
    </PreviewPage>
  );
}
