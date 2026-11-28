/**
 * 후기 작성 타입.
 * DB nirvana_community.reviewEligibilities(작성 자격), posts(제목·내용), reviewDetails(예약 연결)를 참고했습니다.
 * 실제 요청·응답 타입은 후기 API(Swagger) 확정 후 맞춥니다.
 */

/** 후기 작성 자격 = 체험을 마친 예약 하나. DB reviewEligibilities 칸 이름을 그대로 씁니다. */
export type ReviewEligibility = {
  bookingUuid: string;
  templeName: string;
  programTitle: string;
  /** 후기 작성 시각. null이면 아직 쓸 수 있습니다. */
  consumedAt: string | null;
};

/** 입력값. content는 에디터가 만든 HTML입니다. */
export type ReviewFormValues = {
  title: string;
  content: string;
};

export type ReviewFormErrors = Partial<Record<keyof ReviewFormValues, string>>;

/** 후기 등록 요청 */
export type CreateReviewRequest = ReviewFormValues & {
  bookingUuid: string;
};

/** not-eligible: 쓸 수 없는 예약(없음, 이미 씀) / error: 그 밖의 오류 */
export type CreateReviewResult = { ok: true } | { ok: false; reason: "not-eligible" | "error" };

/** 에디터가 바깥(입력 폼)에 열어 두는 기능. 오류가 났을 때 에디터로 포커스를 옮깁니다. */
export type ReviewEditorHandle = {
  focus: () => void;
};

/** 내가 쓴 후기 하나. DB posts(제목·내용·작성일) + reviewDetails(예약 연결) 기준. 사찰명·체험명을 어떻게 받을지는 API 확정 후 맞춥니다. */
export type MyReview = {
  postUuid: string;
  bookingUuid: string;
  templeName: string;
  programTitle: string;
  title: string;
  /** 정제된 HTML */
  content: string;
  createdAt: string;
};

/** 후기 작성 화면에 어디서 들어왔는지 (뒤로 가기·취소가 돌아갈 곳) */
export type ReviewWriteFrom = "bookings" | "reviews";
