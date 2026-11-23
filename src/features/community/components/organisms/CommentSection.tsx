import type { CommunityComment } from "@/features/community/types/comment";
import CommentForm from "@/features/community/components/molecules/CommentForm";
import CommentItem from "@/features/community/components/molecules/CommentItem";

type CommentSectionProps = {
  comments: CommunityComment[];
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
};

export default function CommentSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
}: CommentSectionProps) {
  const rootComments = comments.filter((comment) => comment.depth === 0);

  return (
    <section className="mt-14">
      <div className="mb-8 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-ink">댓글</h2>
        <span className="text-sm text-muted">{comments.length}</span>
      </div>

      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />

      <div className="border-t border-border">
        {rootComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} comments={comments} />
        ))}
      </div>
    </section>
  );
}
