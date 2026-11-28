# Member Feature

마이페이지 공통 영역과 회원 정보 화면을 관리합니다.

## 현재 구현

- `components/organisms/MyPageSidebar`: 마이페이지 왼쪽 메뉴(휴대폰에서는 위쪽 가로 목록). 지금 주소의 메뉴를 강조합니다.
  - 화면이 아직 없는 메뉴는 `ready: false`로 두어 누를 수 없고 "준비 중"으로 보입니다. 화면을 만들면 `true`로 바꿉니다.
- 마이페이지 틀(왼쪽 메뉴 + 본문)은 `app/(user)/mypage/layout.tsx`가 조립합니다. 각 메뉴의 본문은 해당 기능 폴더(예: 예약 내역은 `features/booking`)에서 만듭니다.

## 참고

- `globals.css`의 `a { color: inherit }` 규칙이 링크에 직접 준 `text-*` 색보다 우선합니다. 메뉴 링크의 글자색은 감싸는 `<li>`에 줍니다.

## 다음 작업

- 회원정보 수정 화면 (`/mypage/profile`)
- 로그인한 사람만 마이페이지에 들어오게 막기 (로그인 상태 Issue)
