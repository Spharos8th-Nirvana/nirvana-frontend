// 커뮤니티 게시글 데이터 구조
export type CommunityPost = {
  id: number;
  category: string;
  title: string;
  nickname: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;

  // HTML 에디터로 작성한 게시글 본문
  content: string;
};

// 커뮤니티 게시글 테스트 데이터
export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    category: "절밥 세끼",
    title: "템플스테이에서 먹었던 사찰 음식이 그리워요",
    nickname: "산책하는곰",
    createdAt: "2026.11.17",
    views: 48,
    likes: 12,
    comments: 4,
    content: `
      <p>얼마 전 템플스테이를 다녀왔어요.</p>
      <p>그곳에서 먹었던 사찰 음식이 아직도 생각납니다.</p>
      <h2>가장 기억에 남는 음식</h2>
      <p>자극적이지 않은 나물 반찬과 정갈한 밥상이 특히 좋았어요.</p>
      <p>여러분은 템플스테이에서 어떤 음식이 가장 기억에 남으셨나요?</p>
    `,
  },
  {
    id: 2,
    category: "마음 수행 중",
    title: "아침 명상을 시작하고 달라진 점",
    nickname: "고요한하루",
    createdAt: "2026.11.18",
    views: 36,
    likes: 9,
    comments: 2,
    content: `
      <p>요즘 매일 아침 10분씩 명상을 하고 있습니다.</p>
      <p>처음에는 가만히 앉아 있는 것조차 쉽지 않았어요.</p>
      <h2>작은 변화</h2>
      <p>명상을 시작한 뒤 하루를 조금 더 차분하게 시작할 수 있게 되었습니다.</p>
      <p>여러분은 어떤 방식으로 마음을 다스리고 계신가요?</p>
    `,
  },
  {
    id: 3,
    category: "절로 가는 길",
    title: "주말에 다녀오기 좋은 조용한 사찰 추천",
    nickname: "여행하는연꽃",
    createdAt: "2026.11.19",
    views: 76,
    likes: 18,
    comments: 6,
    content: `
      <p>이번 주말에는 조용한 사찰을 찾아 여행을 떠나보려고 합니다.</p>
      <p>복잡한 도심을 벗어나 자연 속에서 잠시 쉬고 싶어요.</p>
      <h2>추천을 부탁드려요!</h2>
      <p>산책하기 좋고 주변 풍경이 아름다운 사찰이 있다면 추천해 주세요.</p>
    `,
  },
  {
    id: 4,
    category: "속세 수다방",
    title: "오늘도 마음 편안한 하루 보내세요!",
    nickname: "초록연잎",
    createdAt: "2026.11.20",
    views: 29,
    likes: 7,
    comments: 3,
    content: `
      <p>오늘 하루도 수고 많으셨습니다.</p>
      <p>바쁜 일상 속에서도 잠시 쉬어가는 시간을 가져보면 좋겠어요.</p>
      <h2>오늘의 작은 응원</h2>
      <p>모두에게 평온하고 따뜻한 하루가 찾아오기를 바랍니다.</p>
    `,
  },
  {
    id: 5,
    category: "절밥 세끼",
    title: "집에서도 만들어 본 연잎밥 후기",
    nickname: "밥먹는수행자",
    createdAt: "2026.11.21",
    views: 61,
    likes: 15,
    comments: 5,
    content: `
      <p>지난번 템플스테이에서 먹었던 연잎밥이 생각나 집에서 직접 만들어 봤어요.</p>
      <h2>직접 만들어 보니</h2>
      <p>연잎의 향이 밥에 은은하게 배어들어 정말 좋았습니다.</p>
      <p>생각보다 만드는 과정도 재미있었어요.</p>
      <p>다음에는 다른 사찰 음식에도 도전해 보려고 합니다!</p>
    `,
  },
  {
    id: 6,
    category: "마음 수행 중",
    title: "복잡한 생각을 잠시 내려놓는 방법",
    nickname: "고요한하루",
    createdAt: "2026.11.22",
    views: 41,
    likes: 11,
    comments: 2,
    content: `
      <p>생각이 많아지는 날에는 잠시 하던 일을 멈추고 호흡에 집중합니다.</p>
      <h2>제가 실천하는 방법</h2>
      <ul>
        <li>조용한 곳에 앉기</li>
        <li>천천히 숨을 들이쉬고 내쉬기</li>
        <li>떠오르는 생각을 억지로 없애려 하지 않기</li>
      </ul>
      <p>완벽하게 마음을 비우지 않아도 괜찮다고 생각합니다.</p>
    `,
  },
];
