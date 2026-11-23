type CommunityPostControlsProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortType: "latest" | "popular";
  onSortChange: (sortType: "latest" | "popular") => void;
  searchKeyword: string;
  onSearchKeywordChange: (keyword: string) => void;
  onSearch: () => void;
};

export default function CommunityPostControls({
  categories,
  selectedCategory,
  onCategoryChange,
  sortType,
  onSortChange,
  searchKeyword,
  onSearchKeywordChange,
  onSearch,
}: CommunityPostControlsProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3 border-b border-border pb-6">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-sm border px-5 py-3 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="community-sort" className="text-sm text-muted">
            정렬
          </label>
          <select
            id="community-sort"
            value={sortType}
            onChange={(event) => onSortChange(event.target.value as "latest" | "popular")}
            className="border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="latest">최신순</option>
            <option value="popular">베스트순</option>
          </select>
        </div>

        <form
          className="flex w-full max-w-xl sm:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <input
            type="text"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="게시글 제목이나 내용을 검색하세요."
            className="min-w-0 flex-1 border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary sm:w-80"
          />
          <button
            type="submit"
            className="bg-primary px-5 text-sm font-semibold !text-white transition-colors hover:bg-primary-hover"
          >
            검색
          </button>
        </form>
      </div>
    </>
  );
}
