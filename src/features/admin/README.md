# Admin Feature

플랫폼 관리자(`admins`, 역할 `ADMIN` / `SUPER_ADMIN`) 화면을 관리합니다.
관리자 화면은 사용자 헤더·푸터 없이 별도 레이아웃을 사용합니다.

사찰 운영자(`operatorAccounts`) 화면은 이 폴더가 아니라 `features/operator`, 주소 `/operator/...`에 둡니다.

## 폴더 위치

```text
src/app/(admin)/
├── layout.tsx            관리자 공통 레이아웃 (사이드바 등)
└── admin/
    ├── page.tsx          /admin
    └── <화면>/page.tsx    /admin/<화면>

src/features/admin/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── data/                 API 확정 전 임시 데이터
├── types/
├── utils/
└── README.md
```

필요한 폴더만 만듭니다.

## 작성 규칙

### 1. 관리자 코드는 `features/admin` 한 폴더에 모읍니다

관리자 화면이 여러 개 생겨도 기능 폴더는 하나만 씁니다.

```text
✅ src/features/admin/components/organisms/AdminProgramTable.tsx
✅ src/features/admin/components/organisms/AdminBookingTable.tsx

❌ src/features/admin-program/...   (화면별로 폴더를 새로 만들지 않음)
❌ src/features/admin-booking/...
```

이유: 관리자 화면들은 사이드바·표·검색창처럼 같은 부품을 함께 씁니다. 폴더가 나뉘면 서로 가져다 쓸 수 없어 같은 부품을 여러 번 만들게 됩니다.

### 2. 파일 이름 앞에 `Admin` + 화면 이름을 붙입니다

한 폴더에 여러 화면의 코드가 모이므로, 이름만 보고 어느 화면용인지 알 수 있게 합니다.

| 화면          | 컴포넌트                | 임시 데이터              | 타입                     |
| ------------- | ----------------------- | ------------------------ | ------------------------ |
| 프로그램 관리 | `AdminProgramTable.tsx` | `data/admin-programs.ts` | `types/admin-program.ts` |
| 예약 관리     | `AdminBookingTable.tsx` | `data/admin-bookings.ts` | `types/admin-booking.ts` |

여러 화면에서 함께 쓰는 관리자 부품은 화면 이름 없이 씁니다. 예: `AdminSidebar.tsx`, `AdminPageHeader.tsx`

### 3. `page.tsx`는 조립만, 기능은 `features/admin`에 만듭니다

- `src/app/(admin)/admin/.../page.tsx`: 데이터를 가져와서 template에 넘기는 일만 합니다.
- 표, 버튼, 입력창 같은 실제 화면 코드는 `features/admin/components/`에 만듭니다.
- 클릭·입력처럼 브라우저에서 동작해야 하는 컴포넌트에만 맨 위에 `'use client'`를 씁니다.

### 4. 사용자 화면 코드(`features/program`, `features/booking` 등)는 가져다 쓰지 않습니다

```tsx
❌ import { ProgramGallery } from "@/features/program/components/organisms/ProgramGallery";
```

사용자 화면 코드가 바뀌면 관리자 화면까지 깨질 수 있기 때문입니다.
같은 타입이나 부품이 필요하면 직접 복사하지 말고 Frontend 담당자에게 먼저 이야기합니다. `src/shared`로 옮길지 함께 정합니다.

### 5. 공통 부품(`src/shared`)은 쓰기만 하고 고치지 않습니다

```tsx
✅ import { Button } from "@/shared/components/ui/Button";
```

- `Button`, `SelectField`, `Icons` 등은 자유롭게 가져다 씁니다.
- 공통 부품을 고쳐야 하면 직접 고치지 말고 별도 Issue로 요청합니다. 사용자 화면 전체에 영향을 주기 때문입니다.

### 6. 아래 파일은 수정하지 않습니다

| 파일·폴더                            | 이유                               |
| ------------------------------------ | ---------------------------------- |
| `src/app/layout.tsx`                 | 모든 화면에 적용되는 루트 레이아웃 |
| `src/app/globals.css`                | 서비스 전체 색상·글꼴              |
| `src/shared/`, `src/lib/`            | 여러 기능이 함께 쓰는 코드         |
| `src/app/(user)/`, 다른 `features/*` | 사용자 화면                        |

수정이 필요하면 Frontend 담당자와 먼저 이야기합니다.

### 작업 전 스스로 확인하기

- [ ] 새 파일이 `src/app/(admin)/` 또는 `src/features/admin/` 안에 있다
- [ ] 파일 이름이 `Admin`으로 시작한다 (`page.tsx`, `layout.tsx` 제외)
- [ ] `git status`에 위 6번 표의 파일이 없다

## 데이터 기준

- 화면 항목과 필드 이름은 DB DDL을 따릅니다. 피그마는 화면 배치 참고용입니다.
- API 확정 전까지 `data/`의 임시 데이터를 사용합니다. API 경로와 요청·응답 타입은 임의로 만들지 않습니다.
- 관리자 로그인과 접근 제한은 인증 방식이 확정된 뒤 별도 Issue로 진행합니다.
- 최종 권한 검증과 데이터 처리는 Backend가 합니다.

## 커밋

- scope는 `frontend/admin`을 사용합니다. 예: `feat(frontend/admin): 관리자 사이드바 레이아웃 구현`
