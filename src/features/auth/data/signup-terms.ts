import type { SignupTerm } from "@/features/auth/types/signup";

/**
 * 회원가입 필수 약관 (임시 문구).
 * 세 항목 모두 동의하면 가입 요청에 requiredTermsAgreed: true 를 보냅니다.
 * 실제 문구가 정해지면 content 만 바꿉니다.
 */
export const signupTerms: SignupTerm[] = [
  {
    id: "service",
    title: "서비스 이용약관",
    content:
      "NIRVANA 서비스 이용에 관한 기본 사항과 회원·회사의 권리, 의무를 안내합니다. (임시 약관 내용입니다.)",
  },
  {
    id: "privacy",
    title: "개인정보 수집·이용",
    content:
      "회원 가입과 서비스 제공을 위해 이메일, 이름, 닉네임, 휴대전화 번호를 수집하며, 회원 탈퇴 시까지 보관합니다. (임시 약관 내용입니다.)",
  },
  {
    id: "age",
    title: "만 14세 이상입니다",
    content: "만 14세 미만은 회원가입을 할 수 없습니다.",
  },
];
