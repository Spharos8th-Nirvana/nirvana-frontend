"use client";

import { useState } from "react";
import PageHero from "@/shared/components/layout/PageHero";
import { communityNotices } from "@/features/community/data/community-notices";
import { communityPosts } from "@/features/community/data/community-posts";
import CommunityNavigation from "@/features/community/components/molecules/CommunityNavigation";
import CommunityPagination from "@/features/community/components/molecules/CommunityPagination";
import CommunityPostControls from "@/features/community/components/molecules/CommunityPostControls";
import CommunityPostTable from "@/features/community/components/organisms/CommunityPostTable";

const categories = ["전체", "절밥 세끼", "마음 수행 중", "절로 가는 길", "속세 수다방"];
const postsPerPage = 5;

export default function CommunityListTemplate() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = communityPosts
    .filter((post) => {
      const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
      const matchesKeyword = post.title.toLowerCase().includes(submittedKeyword.toLowerCase());

      return matchesCategory && matchesKeyword;
    })
    .sort((a, b) =>
      sortType === "popular" ? b.likes - a.likes || b.id - a.id : b.id - a.id,
    );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );
  const pinnedNotices = communityNotices.filter((notice) => notice.isPinned);

  const emptyMessage = submittedKeyword
    ? "검색 결과가 없습니다."
    : communityPosts.length === 0
      ? "등록된 게시글이 없습니다."
      : "해당 카테고리에 등록된 게시글이 없습니다.";

  const resetPage = () => setCurrentPage(1);

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="커뮤니티"
        description="너바나에서 다양한 경험과 이야기를 나눠보세요."
        image="https://www.bulkwang.co.kr/news/photo/202209/37881_20706_4159.jpg"
      />

      <CommunityNavigation activePage="community" />

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-ink">커뮤니티</h1>
          <p className="mt-3 text-sm text-muted">마음을 나누고, 일상을 나누는 너바나의 이야기</p>
        </div>

        <CommunityPostControls
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            resetPage();
          }}
          sortType={sortType}
          onSortChange={(nextSortType) => {
            setSortType(nextSortType);
            resetPage();
          }}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={setSearchKeyword}
          onSearch={() => {
            setSubmittedKeyword(searchKeyword.trim());
            resetPage();
          }}
        />

        <CommunityPostTable
          pinnedNotices={pinnedNotices}
          posts={paginatedPosts}
          emptyMessage={emptyMessage}
        />

        <CommunityPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
