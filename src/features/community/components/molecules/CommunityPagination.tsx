type CommunityPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CommunityPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CommunityPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="게시글 페이지" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border border-border px-4 py-2 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-30"
      >
        이전
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={`border px-4 py-2 text-sm ${
            currentPage === page
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-muted hover:border-primary"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border border-border px-4 py-2 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-30"
      >
        다음
      </button>
    </nav>
  );
}
