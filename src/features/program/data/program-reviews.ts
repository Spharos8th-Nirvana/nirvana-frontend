export type ProgramReview = {
  id: number;
  programId: number;
  title: string;
  nickname: string;
  content: string;
};

export const programReviews: ProgramReview[] = [
  {
    id: 1,
    programId: 1,
    title: "새벽 예불과 명상으로 찾은 마음의 평온",
    nickname: "초록빛하루",
    content:
      "고요한 새벽 사찰에서 예불과 명상에 참여하며 일상의 복잡한 생각을 내려놓을 수 있었습니다. 특별하고 의미 있는 시간이었습니다.",
  },
  {
    id: 2,
    programId: 1,
    title: "처음 경험한 템플스테이",
    nickname: "마음산책",
    content:
      "처음 참여한 템플스테이였는데 차분한 분위기 속에서 나 자신을 돌아볼 수 있었습니다. 다음에도 다시 참여하고 싶습니다.",
  },
  {
    id: 3,
    programId: 1,
    title: "일상에서 벗어나 온전한 휴식",
    nickname: "오늘도쉼",
    content:
      "자연 속에서 보내는 시간이 정말 좋았습니다. 평소 경험하기 어려운 특별한 시간을 보낼 수 있었습니다.",
  },
];
