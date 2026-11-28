# Features

사용자 기능·도메인별 코드를 응집도 있게 관리합니다. App Router 페이지는 `src/app/`에서 라우팅과 화면 조립을 맡고, 기능 구현은 이 폴더에 둡니다.

권장 구조:

```text
features/
└── <feature>/
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── templates/
    ├── hooks/
    ├── data/
    ├── types/
    ├── utils/
    └── README.md
```

기능에서 필요한 폴더만 추가합니다. 현재 구현된 기능은 `auth`, `booking`, `community`, `home`, `member`, `program`, `review`, `temple`입니다.

기능 내부에서만 사용하는 코드는 해당 기능 폴더에 두고, 여러 기능에서 함께 쓰는 코드는 `src/shared/`로 이동합니다. 공통 API 처리와 기반 설정은 `src/lib/`에서 관리합니다.

## Atomic Design 규칙

- `atoms`: 하나의 작은 UI 역할을 담당하는 기능 전용 요소입니다. 예: 댓글 작성자 아바타.
- `molecules`: 소수의 UI 요소를 묶어 하나의 입력·표시 역할을 수행합니다. 예: 댓글 항목, 검색·정렬 컨트롤.
- `organisms`: 기능 흐름의 독립된 영역을 구성합니다. 예: 댓글 영역, 게시글 표.
- `templates`: organisms를 조합해 화면의 레이아웃과 배치를 정의합니다. 상태와 상호작용이 필요한 경우에만 Client Component로 둡니다.
- `app/` 페이지는 라우팅, 서버 데이터 조회, 기능 template 조립을 담당합니다.
- 의존 방향은 `atoms → molecules → organisms → templates → app`으로 한 방향만 허용합니다. 하위 계층이 상위 계층이나 다른 feature에 의존하지 않게 합니다.
- 여러 기능에서 실제로 재사용하는 일반 UI만 `src/shared/components/ui`에 둡니다. 한 기능에서만 쓰는 요소를 조기 일반화하지 않습니다.
- 기존 컴포넌트를 계층에 끼워 맞추려고 쪼개지 않습니다. 각 파일의 책임과 독립성이 분명해지는 경계에서만 분리합니다.
