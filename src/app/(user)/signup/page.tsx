import type { Metadata } from "next";
import SignupFlowTemplate from "@/features/auth/components/templates/SignupFlowTemplate";
import { signupTerms } from "@/features/auth/data/signup-terms";
import PageHero from "@/shared/components/layout/PageHero";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="회원가입"
        description="NIRVANA 회원이 되어 고요한 사찰 체험을 예약해 보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <div className="mx-auto max-w-[560px] px-6 py-16 md:py-24">
        <SignupFlowTemplate terms={signupTerms} />
      </div>
    </main>
  );
}
