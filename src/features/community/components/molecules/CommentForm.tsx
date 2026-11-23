type CommentFormProps = {
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
};

// 새 댓글 입력 및 등록을 담당하는 컴포넌트
export default function CommentForm({
  newComment,
  setNewComment,
  handleAddComment,
}: CommentFormProps) {
  return (
    <div className="mb-8">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력해 주세요."
        rows={3}
        className="w-full resize-none border border-border bg-white p-4 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          등록
        </button>
      </div>
    </div>
  );
}
