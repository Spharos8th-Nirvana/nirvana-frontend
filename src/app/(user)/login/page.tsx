import { PreviewPage } from "@/shared/components/layout/PreviewPage";
import { LoginForm } from "@/features/guide/components/organisms/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <PreviewPage title="로그인" description="예약·찜·후기 쓰기는 로그인한 뒤에 할 수 있어요.">
      <LoginForm nextPath={params.next} />
    </PreviewPage>
  );
}
