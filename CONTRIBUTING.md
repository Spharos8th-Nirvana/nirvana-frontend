# 기여 가이드

개발 규칙은 [NIRVANA 글로벌 개발 컨벤션](https://github.com/Spharos8th-Nirvana/nirvana-docs/blob/main/nirvana-conventions/README.md)을 참고하세요.

## 작업 절차

1. Issue에서 작업 범위와 담당자를 확인합니다.
2. 최신 `develop` 브랜치에서 작업 브랜치를 만듭니다.
3. Node.js 24.22.3과 pnpm 12.21.0을 사용합니다.
4. 의존성을 변경할 때는 `pnpm add`, `pnpm add -D`, `pnpm remove` 명령을 사용하고 `pnpm-lock.yaml` 변경을 함께 커밋합니다.
5. 작업 후 `pnpm lint`, `pnpm typecheck`, `pnpm build`를 실행하고 결과를 확인합니다.
6. 변경 범위, 관련 Issue, 검증 결과, API 계약 변경 여부를 PR에 기록합니다.
7. 작성자를 제외한 리뷰어의 승인을 받은 뒤 PR로 병합합니다.

브랜치·커밋·PR 규칙은 글로벌 컨벤션을 따릅니다.

## Frontend 작업 규칙

글로벌 컨벤션에 더해 이 저장소에서 지키는 규칙입니다.

### 화면 영역과 폴더

| 영역          | 주소            | 라우트 폴더                    | 기능 폴더                 |
| ------------- | --------------- | ------------------------------ | ------------------------- |
| 사용자        | `/...`          | `src/app/(user)/`              | `src/features/<feature>/` |
| 플랫폼 관리자 | `/admin/...`    | `src/app/(admin)/admin/`       | `src/features/admin/`     |
| 사찰 운영자   | `/operator/...` | `src/app/(operator)/operator/` | `src/features/operator/`  |

- 이름은 DB의 계정 구분(`USER` / `ADMIN` / `OPERATOR`)을 따릅니다.
- 루트 레이아웃(`src/app/layout.tsx`)에는 모든 영역이 함께 쓰는 것(html·body·글꼴·전역 CSS)만 둡니다. 헤더·푸터 같은 영역별 화면은 각 영역의 `layout.tsx`에 둡니다.
- 영역별 세부 규칙은 각 기능 폴더의 `README.md`를 확인합니다. 예: `src/features/admin/README.md`

### 커밋

- 커밋 scope는 `frontend/<기능 폴더 이름>`을 사용합니다. 여러 기능에 걸친 작업이나 공통 작업은 `frontend`를 사용합니다.

  ```text
  feat(frontend/booking): 예약 3단계 결제 확인 화면 구현
  feat(frontend/admin): 관리자 사이드바 레이아웃 구현
  refactor(frontend): 사용자 헤더·푸터를 (user) 레이아웃으로 분리
  ```

- 커밋할 파일은 하나씩 지정합니다. `git add .`은 사용하지 않습니다.

  ```bash
  git add src/features/admin/components/organisms/AdminSidebar.tsx
  git status   # 커밋할 파일만 올라갔는지 확인
  ```

- `AGENTS.md`는 커밋하지 않습니다. `pnpm dev`를 실행하면 Next.js가 이 파일 끝에 영어 안내를 자동으로 추가하므로 `git status`에 계속 수정됨으로 보여도 정상입니다.

### 참고 자료

- 팀 컨벤션 저장소(`nirvana-docs`)는 비공개라 AI가 웹 링크로 읽지 못할 수 있습니다. 이 저장소와 같은 위치에 내려받아 두고 AI에게 로컬 경로로 읽게 합니다.

  ```text
  dev/
  ├── nirvana-frontend/   이 저장소
  └── nirvana-docs/       git clone https://github.com/Spharos8th-Nirvana/nirvana-docs.git
  ```

- 화면 항목·필드·역할 이름은 DB DDL을 기준으로 정합니다. DDL은 Backend 담당자에게 최신본을 받아 저장소 밖에 둡니다. 피그마는 화면 배치 참고용입니다.
- API 경로와 요청·응답 타입은 API 명세가 확정되기 전까지 임의로 만들지 않고 임시 데이터를 사용합니다.

### 자주 겪는 문제

- 페이지 파일을 옮기거나 지운 직후 `pnpm typecheck`가 `.next/types/...`에서 오류를 낼 수 있습니다. 이전 위치로 자동 생성된 타입 파일 때문입니다. `pnpm build` 또는 `pnpm dev`를 한 번 실행한 뒤 다시 확인합니다.

## 패키지 설치 규칙

- npm, Yarn 등 다른 패키지 매니저로 프로젝트 의존성을 설치하거나 변경하지 않습니다.
- 팀원은 저장소에 포함된 `pnpm-lock.yaml`을 기준으로 `pnpm install --frozen-lockfile`을 사용합니다.
- `package.json`만 변경하고 잠금 파일 변경을 누락하지 않습니다.

## 보안

- 실제 환경변수, 토큰, API Secret, 운영 URL, 개인정보를 커밋하지 않습니다.
- `.env.example`에는 키 이름과 가짜 예시값만 둡니다.
- `NEXT_PUBLIC_*` 변수는 브라우저에 노출되므로 공개 가능한 값에만 사용합니다.
- 인증과 권한은 서버에서 검증합니다.
