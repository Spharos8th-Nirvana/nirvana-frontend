export type TempleNotice = {
  id: number;
  templeId: number;
  title: string;
  nickname: string;
  createdAt: string;
  content: string;
};

export const templeNotices: TempleNotice[] = [
  {
    id: 1,
    templeId: 1,
    title: "템플스테이 프로그램 일정 안내",
    nickname: "해인사 운영자",
    createdAt: "2026-11-20",
    content: `
      <p>안녕하세요. 해인사 템플스테이 운영팀입니다.</p>
      <p>11월 템플스테이 프로그램 일정을 안내해 드립니다.</p>
      <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8" alt="사찰 주변 자연 풍경" />
      <p>참여를 원하시는 분들은 프로그램 예약 페이지를 확인해 주세요.</p>
    `,
  },
  {
    id: 2,
    templeId: 1,
    title: "사찰 방문객 이용 안내",
    nickname: "해인사 운영자",
    createdAt: "2026-11-15",
    content: `
      <p>사찰을 방문하시는 분들을 위한 이용 안내입니다.</p>
      <p>모든 방문객이 편안하게 이용할 수 있도록 조용한 관람을 부탁드립니다.</p>
    `,
  },
  {
    id: 3,
    templeId: 1,
    title: "동절기 운영 시간 변경 안내",
    nickname: "해인사 운영자",
    createdAt: "2026-11-10",
    content: `
      <p>동절기를 맞아 일부 시설의 운영 시간이 변경됩니다.</p>
      <p>방문 전 운영 시간을 확인해 주시기 바랍니다.</p>
    `,
  },
];
