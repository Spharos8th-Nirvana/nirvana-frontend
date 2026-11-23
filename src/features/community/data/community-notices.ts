// 공지사항 데이터의 구조 정의
export type CommunityNotice = {
  id: number; // 공지사항 고유 번호
  title: string; // 공지사항 제목
  content: string; // 공지사항 본문
  createdAt: string; // 작성 날짜
  views: number; // 조회수
  isPinned: boolean; // 상단 고정 여부
};

// 공지사항 테스트 데이터
export const communityNotices: CommunityNotice[] = [
  {
    id: 1,
    title: "너바나 커뮤니티 이용 안내",
    content: `안녕하세요. 너바나입니다.

너바나 커뮤니티에 오신 것을 환영합니다.

이곳에서는 사찰 음식, 명상과 수행, 사찰 여행 등 다양한 경험과 이야기를 나눌 수 있습니다.

서로를 존중하고 배려하는 따뜻한 커뮤니티를 만들어 주세요.

감사합니다.`,
    createdAt: "2026.11.18",
    views: 245,
    isPinned: true,
  },
  {
    id: 2,
    title: "커뮤니티 오픈 이벤트 안내",
    content: `안녕하세요. 너바나입니다.

너바나 커뮤니티 오픈을 기념하여 이벤트를 진행합니다.

커뮤니티에 방문해 다양한 이야기를 나누고 다른 회원들과 소통해 보세요.

앞으로도 많은 관심과 참여 부탁드립니다.

감사합니다.`,
    createdAt: "2026.11.20",
    views: 182,
    isPinned: true,
  },
];
