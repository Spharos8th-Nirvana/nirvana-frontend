import { useState } from "react";

// 게시글 좋아요 상태와 개수를 관리하는 Custom Hook
export function usePostLike(initialLikeCount: number) {
  // 현재 사용자가 좋아요를 눌렀는지 여부
  const [isLiked, setIsLiked] = useState(false);

  // 게시글 좋아요 개수
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 좋아요 버튼 클릭
  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount((prevCount) => prevCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prevCount) => prevCount + 1);
      setIsLiked(true);
    }
  };

  return {
    isLiked,
    likeCount,
    handleToggleLike,
  };
}
