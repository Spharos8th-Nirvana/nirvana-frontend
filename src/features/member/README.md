# Member Feature

마이페이지 공통 영역과 회원 정보 화면을 관리합니다.

## 현재 구현

- `components/organisms/MyPageSidebar`: 마이페이지 왼쪽 메뉴(휴대폰에서는 위쪽 가로 목록). 지금 주소의 메뉴를 강조합니다.
  - 화면이 아직 없는 메뉴는 `ready: false`로 두어 누를 수 없고 "준비 중"으로 보입니다. 화면을 만들면 `true`로 바꿉니다.
- 회원정보 수정 (`/mypage/profile`, 임시 데이터). 카드 순서: 내 정보 → 비밀번호 변경 → 알림 수신 → 회원 탈퇴. 카드마다 따로 저장
  - `components/organisms/ProfileForm`: 이름·성별 → 국가·휴대폰 → 닉네임·이메일(보기만). 바뀐 것이 없으면 저장 버튼 비활성
  - `components/organisms/MarketingConsentForm`: 이메일·SMS 수신 스위치. 누르면 바로 저장하고 동의한 날짜를 보여 줌
  - 이름·휴대폰 규칙은 회원가입과 같음 (`src/shared/utils/validate-user.ts`). 닉네임은 30자까지 (`utils/validate-profile.ts`)
  - 비밀번호 변경·회원 탈퇴는 계정 기능이라 `features/auth`에 있음
- 마이페이지 틀(왼쪽 메뉴 + 본문)은 `app/(user)/mypage/layout.tsx`가 조립합니다. 각 메뉴의 본문은 해당 기능 폴더(예: 예약 내역은 `features/booking`)에서 만듭니다.

## 다음 작업

- 회원정보 API 연결 (주소·응답은 [백엔드 확인]), 닉네임 중복 확인 방식
- 회원정보 화면에 들어올 때 비밀번호 재인증 (백엔드 API 확인 후, 로그인 상태 Issue와 함께)
- 로그인한 사람만 마이페이지에 들어오게 막기 (로그인 상태 Issue)
