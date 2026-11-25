/** 시안 app.js 동호회 글. 팀 커뮤니티 예시 글(/community/[id])과 따로 둡니다. */

export type ClubComment = {
  id: number;
  author: string;
  text: string;
  date: string;
  staff?: boolean;
  replies: ClubComment[];
};

export type ClubPost = {
  id: number;
  clubId: number;
  clubName: string;
  cat: string;
  title: string;
  body: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  imgs: string[];
  comments: ClubComment[];
  /** 이 브라우저에서 내가 쓴 글 */
  mine?: boolean;
  deleted?: boolean;
};

const clubs: Record<number, string> = {
  1: "새벽 명상 모임",
  2: "사찰음식 함께 만들기",
  3: "주말 템플스테이 동행",
  4: "사찰 사진 동호회",
};

export const clubPosts: ClubPost[] = [
  {
    id: 9,
    clubId: 3,
    clubName: clubs[3],
    cat: "정보",
    title: "처음 템플스테이 가는 분들을 위한 준비물 정리",
    body: "세면도구, 수건, 편한 양말, 얇은 겉옷을 챙기면 좋아요. 수련복은 사찰에서 줘요. (시안 예시 글)",
    author: "서OO",
    date: "2026.11.22",
    views: 40,
    likes: 31,
    imgs: [],
    comments: [{ id: 1, author: "김OO", text: "정리 고마워요!", date: "2026.11.22", replies: [] }],
  },
  {
    id: 10,
    clubId: 2,
    clubName: clubs[2],
    cat: "일상",
    title: "사찰에서 마신 차 이름이 궁금해요",
    body: "해인사에서 차담 시간에 마신 차가 정말 맛있었는데 이름을 못 물어봤어요. (시안 예시 글)",
    author: "오OO",
    date: "2026.11.19",
    views: 12,
    likes: 4,
    imgs: [],
    comments: [],
  },
  {
    id: 11,
    clubId: 4,
    clubName: clubs[4],
    cat: "사진",
    title: "단풍 끝물의 화엄사",
    body: "11월 둘째 주 화엄사 풍경이에요. (시안 예시 글)",
    author: "임OO",
    date: "2026.11.12",
    views: 28,
    likes: 18,
    imgs: ["/images/photo-f35e5aa698c99a8a.jpg", "/images/photo-a9b04c62aadea91c.jpg"],
    comments: [],
  },
  {
    id: 12,
    clubId: 3,
    clubName: clubs[3],
    cat: "정보",
    title: "예약한 날짜를 바꿀 수 있나요?",
    body: "다음 주 토요일로 예약했는데 일요일로 바꾸고 싶어요. (시안 예시 글)",
    author: "신OO",
    date: "2026.11.23",
    views: 22,
    likes: 3,
    imgs: [],
    comments: [
      {
        id: 1,
        author: "너바나 운영팀",
        staff: true,
        text: "날짜 변경은 취소 후 다시 예약하는 방식이에요. 환불 규정을 꼭 확인해 주세요. (시안 예시 답변 · 실제 규칙 확인 필요)",
        date: "2026.11.23",
        replies: [],
      },
    ],
  },
  {
    id: 13,
    clubId: 3,
    clubName: clubs[3],
    cat: "일상",
    title: "아이(초등학생)와 같이 참여 가능한가요?",
    body: "초등학교 3학년 아이와 함께 가려고 해요. (시안 예시 글)",
    author: "조OO",
    date: "2026.11.18",
    views: 15,
    likes: 2,
    imgs: [],
    comments: [],
  },
  {
    id: 14,
    clubId: 1,
    clubName: clubs[1],
    cat: "모임 후기",
    title: "11월 불국사 새벽 명상 모임 후기",
    body: "새벽 4시 반 예불부터 함께했어요. 다음 달에도 첫째 주 토요일에 모여요. (시안 예시 글)",
    author: "한OO",
    date: "2026.11.08",
    views: 19,
    likes: 9,
    imgs: ["/images/photo-d32fe5eecc35c02c.jpg"],
    comments: [{ id: 1, author: "윤OO", text: "다음 달에는 저도 갈게요!", date: "2026.11.09", replies: [] }],
  },
  {
    id: 15,
    clubId: 2,
    clubName: clubs[2],
    cat: "정보",
    title: "집에서 만드는 연근조림 (사찰식)",
    body: "간장 · 조청 · 들기름만 써요. 마늘과 파는 넣지 않아요. (시안 예시 글)",
    author: "강OO",
    date: "2026.11.17",
    views: 33,
    likes: 21,
    imgs: ["/images/photo-007650ba3dc369ab.jpg"],
    comments: [],
  },
  {
    id: 16,
    clubId: 1,
    clubName: clubs[1],
    cat: "일상",
    title: "집에서 5분 명상, 같이 하실 분",
    body: "매일 밤 10시에 각자 5분씩 명상하고 댓글로 남겨요. (시안 예시 글)",
    author: "서OO",
    date: "2026.11.21",
    views: 11,
    likes: 6,
    imgs: [],
    comments: [],
  },
];

const EXTRA_KEY = "nirvana.extra-club-posts";

export function readExtraPosts(): ClubPost[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(EXTRA_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as ClubPost[]) : [];
  } catch {
    return [];
  }
}

export function saveExtraPost(post: ClubPost) {
  const next = [post, ...readExtraPosts().filter((item) => item.id !== post.id)];
  window.sessionStorage.setItem(EXTRA_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("nirvana-posts"));
}

export function allClubPosts() {
  return [...readExtraPosts(), ...clubPosts].filter((post) => !post.deleted);
}

export function subscribeExtraPosts(onChange: () => void) {
  window.addEventListener("nirvana-posts", onChange);
  return () => window.removeEventListener("nirvana-posts", onChange);
}

export function extraPostsSnapshot() {
  return window.sessionStorage.getItem(EXTRA_KEY) ?? "[]";
}

export function extraPostsServerSnapshot() {
  return "[]";
}

export function parseExtraPosts(raw: string): ClubPost[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? (parsed as ClubPost[]) : [];
  } catch {
    return [];
  }
}

export function markPostDeleted(id: number) {
  const extra = readExtraPosts();
  const found = extra.find((post) => post.id === id);
  if (found) {
    saveExtraPost({ ...found, deleted: true });
  }
}
