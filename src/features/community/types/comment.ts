// 댓글 작성자 유형
export type CommentAuthorType = "USER" | "OPERATOR" | "ADMIN";

// 댓글 데이터 구조
export type CommunityComment = {
  id: number;
  uuid: string;
  postId: number;
  authorType: CommentAuthorType;
  authorUuid: string;
  nickname: string;
  content: string;
  hidden: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  depth: number;
  parentId: number | null;
};
