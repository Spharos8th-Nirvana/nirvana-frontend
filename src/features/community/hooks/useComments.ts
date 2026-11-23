import { useState } from "react";
import { communityComments } from "@/features/community/data/community-comments";
import type { CommunityComment } from "@/features/community/types/comment";

// 댓글 상태와 등록 기능을 관리하는 Custom Hook
export function useComments(postId: number) {
  // 현재 게시글에 해당하는 댓글 목록
  const [comments, setComments] = useState<CommunityComment[]>(() =>
    communityComments.filter((comment) => comment.postId === postId).sort((a, b) => a.id - b.id),
  );

  // 새 댓글 입력 내용
  const [newComment, setNewComment] = useState("");

  // 댓글 등록
  const handleAddComment = () => {
    // 공백만 입력한 경우 등록하지 않음
    if (!newComment.trim()) {
      return;
    }

    // 기존 댓글 중 가장 큰 ID 다음 번호 사용
    const newId =
      Math.max(0, ...communityComments.map((comment) => comment.id)) +
      comments.length -
      communityComments.filter((comment) => comment.postId === postId).length +
      1;

    // 현재 시간 생성
    const now = new Date();
    const createdAt = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19);

    // 새 댓글 데이터 생성
    const newCommentData: CommunityComment = {
      id: newId,
      uuid: `comment-uuid-${newId}`,
      postId,
      authorType: "USER",
      authorUuid: "user-uuid-current",
      nickname: "나",
      content: newComment.trim(),
      hidden: false,
      deleted: false,
      createdAt,
      updatedAt: createdAt,
      depth: 0,
      parentId: null,
    };

    // 댓글 목록에 추가
    setComments((prevComments) => [...prevComments, newCommentData]);

    // 입력창 초기화
    setNewComment("");
  };

  return {
    comments,
    newComment,
    setNewComment,
    handleAddComment,
  };
}
