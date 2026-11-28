import type { Metadata } from "next";
import PasswordChangeForm from "@/features/auth/components/organisms/PasswordChangeForm";
import WithdrawalSection from "@/features/auth/components/organisms/WithdrawalSection";
import { getMarketingConsent, getMyProfile } from "@/features/member/api/profile-api";
import MarketingConsentForm from "@/features/member/components/organisms/MarketingConsentForm";
import ProfileForm from "@/features/member/components/organisms/ProfileForm";

export const metadata: Metadata = {
  title: "회원정보 수정",
};

/**
 * 마이페이지 회원정보 수정 (임시 데이터)
 * 내 정보·알림 수신은 회원(member), 비밀번호·탈퇴는 계정(auth) 기능이라 여기서 함께 조립합니다.
 */
export default async function ProfilePage() {
  const [profile, consent] = await Promise.all([getMyProfile(), getMarketingConsent()]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">회원정보 수정</h2>
      <ProfileForm profile={profile} />
      <PasswordChangeForm />
      <MarketingConsentForm consent={consent} />
      <WithdrawalSection />
    </div>
  );
}
