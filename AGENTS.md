# 저장소 작업 지침

작업 전에 다음 문서를 확인합니다.

- [README.md](README.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [NIRVANA 글로벌 개발 컨벤션](https://github.com/Spharos8th-Nirvana/nirvana-docs/blob/main/nirvana-conventions/README.md)
- [Frontend 컨벤션](https://github.com/Spharos8th-Nirvana/nirvana-docs/blob/main/nirvana-conventions/06-frontend-nextjs.md)

## 구현 원칙

- 기존 폴더 구조, API 계약, 인증 모듈을 먼저 확인하고 재사용합니다.
- App Router와 TypeScript를 사용합니다.
- Server Component를 기본으로 사용하고 필요한 컴포넌트에만 `'use client'`를 선언합니다.
- API 요청·타입·UI·페이지 로직을 분리합니다.
- 핵심 비즈니스 규칙, 데이터 정합성, 트랜잭션은 Spring Boot가 최종 처리합니다.
- Server Action, Route Handler, DAL에서 인증과 리소스 권한을 검증합니다.
- 비밀정보를 클라이언트 번들, 로그, 오류 응답에 노출하지 않습니다.
- 확정되지 않은 API·DB·인증 규칙을 임의로 만들지 않습니다.
- 과도한 추상화와 요청 범위를 벗어난 리팩터링을 피합니다.
- 의존성 설치와 변경은 pnpm만 사용하고 잠금 파일을 함께 변경합니다.

## 프론트엔드 구조

- 기능 전용 코드는 `src/features/<feature>/`에 둡니다. 여러 기능에서 재사용하는 도메인 중립 코드만 `src/shared/`에 둡니다.
- App Router 페이지는 라우팅, 서버 데이터 조회, feature 화면 조립을 맡습니다. Server Component를 기본으로 하고 인터랙션이 필요한 최소 영역만 Client Component로 분리합니다.
- Atomic Design 계층은 `src/features/README.md`를 따릅니다. 의존성은 atom → molecule → organism → template → app 방향으로만 흐르게 합니다.
- 모든 작은 요소를 별도 컴포넌트로 만들지 않습니다. 책임이 분명하고 재사용 또는 독립 변경의 이점이 있을 때만 분리합니다.
- 공통 UI는 실제로 여러 feature에서 재사용되는 경우에만 `src/shared/components/ui/`로 이동합니다.

## 변경 후 검증

가능한 경우 다음 명령을 실행합니다.

```bash
pnpm lint
pnpm typecheck
pnpm build
```

실행하지 않은 검증을 통과했다고 보고하지 않습니다.
