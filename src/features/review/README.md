# Review Feature

후기 작성(그리고 다음 Issue의 후기 관리) 화면을 관리합니다.

## 데이터 기준

- 후기 = DB `nirvana_community.posts`(제목 최대 200자, 내용은 정제된 HTML) + `reviewDetails`(예약 연결). 별점은 없습니다.
- 작성 자격 = `reviewEligibilities`: 체험을 마친 예약이고 `consumedAt`이 비어 있을 때만 쓸 수 있습니다. 예약 한 건에 후기 하나, 삭제하면 다시 쓸 수 없습니다.
- 지금은 임시 데이터(`data/review-eligibilities.ts`)와 임시 API(`api/review-api.ts`)를 씁니다. 주소와 응답은 후기 API 확정 후 맞춥니다.
- 화면 검사는 사용자를 돕기 위한 것이고, HTML 정제와 최종 검증은 Backend가 합니다. 화면에 후기 HTML을 보여 줄 때는 서버에서 `lib/sanitize-html.ts`를 거칩니다.

## HTML 에디터 (Tiptap)

- `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` (버전 고정). 쓴 내용은 `editor.getHTML()`로 꺼냅니다.
- 쓰는 서식: 굵게 · 기울임 · 밑줄 · 소제목(h3) · 목록 · 인용 · 링크(http·https만). 사진 넣기는 업로드 API가 정해질 때까지 자리만 있습니다.
- 링크 글자에 커서를 두면 내용 칸 아래에 "연결된 주소" 줄이 겹쳐 나타납니다. 내용 칸은 높이가 고정이라 줄이 나타나도 크기가 바뀌지 않습니다.
- Next.js에서는 `immediatelyRender: false`로 브라우저에서만 에디터를 만듭니다.
- 지금은 이 기능 안에 두고, 커뮤니티 글쓰기 등에서 같이 쓰게 되면 `shared`로 옮깁니다.

## Component layers

- `components/molecules/ReviewEditorToolbar`: 서식 버튼 묶음(`ReviewEditorToolbar`)과 연결된 주소 줄(`ReviewEditorLinkBar`)
- `components/organisms/ReviewEditor`: 툴바 + 글 쓰는 칸
- `components/templates/ReviewWriteTemplate`: 체험 요약, 제목, 에디터, 등록 버튼, 완료 화면
- `hooks/useReviewForm`: 입력 상태, 화면 검사, 첫 오류 칸 포커스, 등록 요청
- `app/(user)/mypage/reviews/new`: 주소의 `booking`(예약 번호)으로 작성 자격을 확인하고 화면을 조립합니다.

## 임시 동작 확인 값

- 쓸 수 있는 예약: `/mypage/reviews/new?booking=b-0003` (예약 내역의 "체험 완료" → 상세 → 후기 작성)
- 이미 쓴 예약: `?booking=b-0099` → "후기를 쓸 수 없는 예약이에요"
