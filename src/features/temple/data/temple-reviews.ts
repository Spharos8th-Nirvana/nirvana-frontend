export type TempleReview = {
  id: number;
  templeId: number;
  category: string;
  title: string;
  nickname: string;
  createdAt: string;
  content: string;
};

export const templeReviews: TempleReview[] = [
  {
    id: 1,
    templeId: 1,
    category: "템플스테이",
    title: "일상에서 벗어나 온전히 쉬었던 시간",
    nickname: "초록여행",
    createdAt: "2026-11-10",
    content: `
      <p>조용한 자연 속에서 명상하며 마음의 여유를 찾을 수 있었습니다.</p>
      <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8" alt="사찰 주변 자연 풍경" />
      <p>아름다운 풍경을 보며 잠시 쉬어 갔습니다.</p>
      <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="자연 풍경" />
    `,
  },
  {
    id: 2,
    templeId: 1,
    category: "템플스테이",
    title: "처음 경험한 사찰에서의 하루",
    nickname: "마음산책",
    createdAt: "2026-11-08",
    content: `
      <p>평소 경험하지 못했던 사찰 생활을 경험할 수 있어 좋았습니다.</p>
      <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba" alt="산과 자연 풍경" />
    `,
  },
  {
    id: 3,
    templeId: 1,
    category: "명상 체험",
    title: "나를 돌아보는 소중한 시간",
    nickname: "오늘도맑음",
    createdAt: "2026-11-05",
    content: `
      <p>차분한 분위기에서 자신을 돌아볼 수 있었던 시간이었습니다.</p>
      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e" alt="숲 풍경" />
    `,
  },
  {
    id: 4,
    templeId: 1,
    category: "템플스테이",
    title: "자연과 함께한 힐링 여행",
    nickname: "산책하는날",
    createdAt: "2026-11-03",
    content: `
      <p>자연 속에서 여유롭게 시간을 보내며 좋은 추억을 만들었습니다.</p>
      <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" alt="명상 공간" />
    `,
  },
  {
    id: 5,
    templeId: 1,
    category: "명상 체험",
    title: "다시 방문하고 싶은 곳",
    nickname: "느린하루",
    createdAt: "2026-11-01",
    content: `
      <p>바쁜 일상에서 잠시 벗어나 편안하게 쉴 수 있었습니다.</p>
      <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba" alt="산 풍경" />
    `,
  },
];
