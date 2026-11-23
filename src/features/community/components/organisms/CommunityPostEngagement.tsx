"use client";

import { useComments } from "@/features/community/hooks/useComments";
import { usePostLike } from "@/features/community/hooks/usePostLike";
import CommentSection from "@/features/community/components/organisms/CommentSection";

type CommunityPostEngagementProps = {
  postId: number;
  initialLikeCount: number;
};

export default function CommunityPostEngagement({
  postId,
  initialLikeCount,
}: CommunityPostEngagementProps) {
  const { comments, newComment, setNewComment, handleAddComment } = useComments(postId);
  const { isLiked, likeCount, handleToggleLike } = usePostLike(initialLikeCount);

  return (
    <>
      <div className="flex justify-center gap-8 border-b border-border py-6 text-sm text-muted">
        <button
          type="button"
          aria-pressed={isLiked}
          onClick={handleToggleLike}
          className={`relative z-10 flex cursor-pointer items-center gap-2 rounded-sm border border-border px-4 py-2 transition-colors ${
            isLiked
              ? "border-primary font-semibold text-primary"
              : "text-muted hover:border-primary hover:text-primary"
          }`}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
          <span>좋아요 {likeCount}</span>
        </button>

        <span className="flex items-center">댓글 {comments.length}</span>
      </div>

      <CommentSection
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />
    </>
  );
}
