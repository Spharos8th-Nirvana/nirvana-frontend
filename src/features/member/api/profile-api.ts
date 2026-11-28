import { myMarketingConsent, myProfile, TAKEN_NICKNAME } from "@/features/member/data/my-profile";
import type {
  MarketingConsent,
  MyProfile,
  ProfileFormValues,
  UpdateProfileResult,
} from "@/features/member/types/profile";

/**
 * 회원정보 임시 API.
 * 함수 이름과 입력·결과 모양만 정해 두고, 주소와 응답은 API가 확정되면 실제 요청으로 바꿉니다.
 */

const MOCK_DELAY_MS = 600;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 내 정보 (주소는 [백엔드 확인]) */
export async function getMyProfile(): Promise<MyProfile> {
  return myProfile;
}

/** 내 정보 저장 */
export async function updateMyProfile(values: ProfileFormValues): Promise<UpdateProfileResult> {
  await wait(MOCK_DELAY_MS);

  if (values.nickname.trim() === TAKEN_NICKNAME) {
    return { ok: false, reason: "nickname-taken" };
  }

  return {
    ok: true,
    profile: {
      ...myProfile,
      name: values.name.trim(),
      nickname: values.nickname.trim(),
      countryCode: values.countryCode,
      gender: values.gender || null,
      phone: values.phone,
    },
  };
}

/** 마케팅 수신 설정 */
export async function getMarketingConsent(): Promise<MarketingConsent> {
  return myMarketingConsent;
}

/** 마케팅 수신 하나 바꾸기. 켜면 동의 시각을 지금으로 바꿉니다. */
export async function updateMarketingConsent(
  current: MarketingConsent,
  channel: "email" | "sms",
  allowed: boolean,
): Promise<MarketingConsent> {
  await wait(MOCK_DELAY_MS / 2);
  const now = new Date().toISOString();

  return channel === "email"
    ? {
        ...current,
        emailAllowed: allowed,
        emailConsentedAt: allowed ? now : current.emailConsentedAt,
      }
    : { ...current, smsAllowed: allowed, smsConsentedAt: allowed ? now : current.smsConsentedAt };
}
