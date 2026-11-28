import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/organisms/LoginForm";
import PageHero from "@/shared/components/layout/PageHero";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="로그인"
        description="NIRVANA에 로그인하고 고요한 사찰 체험을 예약해 보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto max-w-[440px] px-6 py-16 md:py-24">
        <LoginForm />
      </div>
    </main>
  );
}
