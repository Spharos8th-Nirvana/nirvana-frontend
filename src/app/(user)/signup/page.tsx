import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { SignupForm } from "@/features/guide/components/organisms/SignupForm";

export default function SignupPage() {
  return (
    <PreviewPage title="회원가입" description="가입하면 예약 내역과 찜 목록을 한곳에서 볼 수 있어요.">
      <SignupForm />
    </PreviewPage>
  );
}
