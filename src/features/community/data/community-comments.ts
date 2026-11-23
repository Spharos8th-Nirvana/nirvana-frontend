import { CommunityComment } from "@/features/community/types/comment";

// 댓글 테스트 데이터
export const communityComments: CommunityComment[] = [
  // 1번 게시글의 원댓글
  {
    id: 1,
    uuid: "comment-uuid-001",
    postId: 1,
    authorType: "USER",
    authorUuid: "user-uuid-001",
    nickname: "연꽃향기",
    content: "저도 템플스테이에서 먹었던 사찰 음식이 기억에 남아요!",
    hidden: false,
    deleted: false,
    createdAt: "2026-11-23T10:00:00",
    updatedAt: "2026-11-23T10:00:00",
    depth: 0,
    parentId: null,
  },

  // 1번 댓글에 대한 대댓글
  {
    id: 2,
    uuid: "comment-uuid-002",
    postId: 1,
    authorType: "USER",
    authorUuid: "user-uuid-002",
    nickname: "산책하는곰",
    content: "맞아요! 특히 연잎밥이 정말 맛있었어요.",
    hidden: false,
    deleted: false,
    createdAt: "2026-11-23T11:00:00",
    updatedAt: "2026-11-23T11:00:00",
    depth: 1,
    parentId: 1,
  },

  // 2번 댓글에 대한 대대댓글
  {
    id: 3,
    uuid: "comment-uuid-003",
    postId: 1,
    authorType: "USER",
    authorUuid: "user-uuid-003",
    nickname: "초록마음",
    content: "저도 연잎밥을 먹어보고 싶네요!",
    hidden: false,
    deleted: false,
    createdAt: "2026-11-23T12:00:00",
    updatedAt: "2026-11-23T12:00:00",
    depth: 2,
    parentId: 2,
  },

  // 1번 게시글의 또 다른 원댓글
  {
    id: 4,
    uuid: "comment-uuid-004",
    postId: 1,
    authorType: "USER",
    authorUuid: "user-uuid-004",
    nickname: "산사의하루",
    content: "다음에는 직접 만들어 보시는 것도 좋겠네요!",
    hidden: false,
    deleted: false,
    createdAt: "2026-11-24T09:00:00",
    updatedAt: "2026-11-24T09:00:00",
    depth: 0,
    parentId: null,
  },

  // 2번 게시글의 원댓글
  {
    id: 5,
    uuid: "comment-uuid-005",
    postId: 2,
    authorType: "USER",
    authorUuid: "user-uuid-005",
    nickname: "마음수련",
    content: "저도 아침 명상을 시작해 보고 싶어요.",
    hidden: false,
    deleted: false,
    createdAt: "2026-11-23T10:00:00",
    updatedAt: "2026-11-23T10:00:00",
    depth: 0,
    parentId: null,
  },
];
