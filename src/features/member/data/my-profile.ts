import type { MarketingConsent, MyProfile } from "@/features/member/types/profile";

/**
 * 내 정보 임시 데이터 (로그인 임시 계정과 같은 사람). API 연결 후 삭제합니다.
 */
export const myProfile: MyProfile = {
  userUuid: "u-0001",
  email: "test@nirvana.test",
  phone: "+821012345678",
  gender: "MALE",
  name: "김민수",
  nickname: "고요한소나무",
  countryCode: "KR",
};

export const myMarketingConsent: MarketingConsent = {
  emailAllowed: true,
  smsAllowed: false,
  emailConsentedAt: "2026-11-27T14:20:00",
  smsConsentedAt: null,
};

/** 이미 다른 사람이 쓰는 닉네임 (임시 동작 확인용) */
export const TAKEN_NICKNAME = "너바나";
