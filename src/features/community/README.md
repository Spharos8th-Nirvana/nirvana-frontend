# Community Feature

커뮤니티 게시글, 공지, 댓글 UI와 기능 전용 상태·데이터를 관리합니다.

## Component layers

- `components/atoms`: 댓글 아바타처럼 작은 기능 전용 표시 요소
- `components/molecules`: 댓글 항목, 작성 폼, 목록 메뉴처럼 작은 UI를 조합한 요소
- `components/organisms`: 댓글 영역, 게시글 표처럼 기능 단위 화면 영역
- `components/templates`: 기능 organism을 화면 순서로 조립하고 상호작용 상태를 연결
- `app/(user)/community`: URL과 서버 렌더링 진입점 관리

의존 방향은 atom에서 template 쪽으로만 흐릅니다. 게시글·공지 데이터와 타입은 이 feature 안에 두고, 다른 기능에서 재사용이 확인된 UI만 shared로 올립니다.
