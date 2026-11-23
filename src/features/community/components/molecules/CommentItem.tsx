import type { CommunityComment } from "@/features/community/types/comment";
import { formatDateTime } from "@/features/community/utils/format-date";
import CommentAvatar from "@/features/community/components/atoms/CommentAvatar";

type CommentItemProps = {
  comment: CommunityComment;
  comments: CommunityComment[];
};

export default function CommentItem({ comment, comments }: CommentItemProps) {
  const replies = comments.filter((reply) => reply.parentId === comment.id);
  const depth = Math.min(comment.depth, 2);
  const itemClassName =
    depth === 0
      ? "border-b border-border py-7"
      : depth === 1
        ? "mb-6 last:mb-0"
        : "mt-5 ml-5 border-l border-border pl-5 sm:ml-7 sm:pl-6";

  return (
    <div className={itemClassName}>
      <div className="flex items-start gap-3">
        <CommentAvatar nickname={comment.nickname} depth={depth} />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-semibold text-ink">{comment.nickname}</span>
            <span className="text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
          </div>
          <p className="text-sm leading-7 text-ink">{comment.content}</p>
        </div>
      </div>

      {replies.length > 0 && (
        <div
          className={
            depth === 0
              ? "mt-6 ml-5 border-l border-border pl-5 sm:ml-8 sm:pl-6"
              : depth === 1
                ? "mt-5"
                : ""
          }
        >
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} comments={comments} />
          ))}
        </div>
      )}
    </div>
  );
}
