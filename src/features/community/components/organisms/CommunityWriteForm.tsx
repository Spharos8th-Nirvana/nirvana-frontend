"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  bookingRecordsSnapshot,
  parseBookingRecords,
  pendingPaymentServerSnapshot,
  subscribePendingPayment,
} from "@/features/booking/utils/pending-payment";
import {
  extraPostsServerSnapshot,
  extraPostsSnapshot,
  parseExtraPosts,
  saveExtraPost,
  subscribeExtraPosts,
} from "@/features/community/data/club-posts";
import {
  parseReviews,
  reviewsServerSnapshot,
  reviewsSnapshot,
  saveReview,
  subscribeReviews,
} from "@/features/community/data/review-posts";
import { clubs } from "@/features/guide/data/mock-screens";
import { previewLoginSnapshot } from "@/features/guide/utils/preview-login";
import {
  joinedClubsServerSnapshot,
  joinedClubsSnapshot,
  parseJoinedClubs,
  subscribeJoinedClubs,
} from "@/features/community/utils/club-membership";

const boards = [
  { id: "reviews", label: "체험 후기" },
  { id: "clubs", label: "동호회" },
] as const;

type BoardId = (typeof boards)[number]["id"];

function nextPostId() {
  return Date.now();
}

/** 완료 예약의 체험 후기와 가입한 동호회의 글을 작성합니다. */
export default function CommunityWriteForm({ editId }: { editId?: number }) {
  const router = useRouter();
  const rawPosts = useSyncExternalStore(subscribeExtraPosts, extraPostsSnapshot, extraPostsServerSnapshot);
  const editing = editId
    ? parseExtraPosts(rawPosts).find((post) => post.id === editId && post.mine && !post.deleted)
    : undefined;
  const [board, setBoard] = useState<BoardId>("clubs");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [seenEdit, setSeenEdit] = useState(0);
  const [clubId, setClubId] = useState(0);
  const [reservationId, setReservationId] = useState(0);
  const [rating, setRating] = useState(0);
  const [savingReview, setSavingReview] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const joinedIds = parseJoinedClubs(
    useSyncExternalStore(subscribeJoinedClubs, joinedClubsSnapshot, joinedClubsServerSnapshot),
  );
  const bookingRaw = useSyncExternalStore(
    subscribePendingPayment, bookingRecordsSnapshot, pendingPaymentServerSnapshot,
  );
  const reviewRaw = useSyncExternalStore(subscribeReviews, reviewsSnapshot, reviewsServerSnapshot);
  if (editing && seenEdit !== editing.id) {
    setTitle(editing.title);
    setBody(editing.body);
    setSeenEdit(editing.id);
  }
  const joinedClubs = clubs.filter((club) => joinedIds.includes(club.id));
  const selectedClub = joinedClubs.find((club) => club.id === clubId) ?? joinedClubs[0];
  const isReview = board === "reviews" && !editing;
  const completedBookings = parseBookingRecords(bookingRaw).filter((booking) =>
    booking.status === "이용 완료" && typeof booking.programName === "string"
  );
  const reviewedIds = new Set(parseReviews(reviewRaw).map((review) => review.reservationId));
  const reviewableBookings = completedBookings.filter((booking) => !reviewedIds.has(booking.id));
  const selectedBooking = reviewableBookings.find((booking) => booking.id === reservationId);

  const onPhotos = (files: FileList | null) => {
    const next = Array.from(files ?? []).slice(0, 4);
    if ((files?.length ?? 0) > 4) {
      setMessage("사진은 4장까지 미리볼 수 있어요.");
    } else {
      setMessage("");
    }
    setPhotos(next.map((file) => URL.createObjectURL(file)));
  };

  const submit = async () => {
    if (title.trim().length < 2) {
      setMessage("제목은 2자 이상 적어 주세요.");
      return;
    }
    if (body.trim().length < 10) {
      setMessage("내용은 10자 이상 적어 주세요.");
      return;
    }
    if (previewLoginSnapshot() !== "1") {
      router.push(`/login?next=${encodeURIComponent(editId ? `/community/write?post=${editId}` : "/community/write")}`);
      return;
    }
    if (isReview) {
      if (savingReview) {
        return;
      }
      if (!reservationId) {
        setMessage("후기를 쓸 예약을 골라 주세요.");
        return;
      }
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        setMessage("별점을 1점부터 5점 사이에서 골라 주세요.");
        return;
      }
      setSavingReview(true);
      const result = await saveReview({ reservationId, rating, title, body });
      setSavingReview(false);
      if (result === "saved") {
        router.push("/community/reviews");
        return;
      }
      const messages = {
        ineligible: "이용을 마친 예약에만 후기를 쓸 수 있어요.",
        duplicate: "이미 이 예약의 후기를 작성했어요.",
        invalid: "별점과 제목, 내용을 다시 확인해 주세요.",
        unavailable: "브라우저에 후기를 저장하지 못했어요. 다시 시도해 주세요.",
      };
      setMessage(messages[result]);
      return;
    }
    if (board === "clubs" && !selectedClub) {
      setMessage("가입한 동호회가 있어야 글을 쓸 수 있어요.");
      return;
    }
    if (editing) {
      saveExtraPost({ ...editing, title: title.trim(), body: body.trim() });
      router.push(`/community/posts/${editing.id}`);
      return;
    }
    const id = nextPostId();
    saveExtraPost({
      id,
      clubId: selectedClub?.id ?? 3,
      clubName: selectedClub?.name ?? "주말 템플스테이 동행",
      cat: "일상",
      title: title.trim(),
      body: body.trim(),
      author: "나",
      date: "2026.11.25",
      views: 0,
      likes: 0,
      imgs: photos,
      comments: [],
      mine: true,
    });
    router.push(`/community/posts/${id}`);
  };

  return (
    <form
      className="mx-auto max-w-[760px] bg-white px-6 py-8"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <fieldset className="flex gap-2">
        <legend className="sr-only">게시판</legend>
        {boards.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={board === item.id}
            disabled={item.id === "reviews" && Boolean(editing)}
            onClick={() => {
              setBoard(item.id);
              setMessage("");
            }}
            className={
              board === item.id
                ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
                : "rounded-full border border-border px-4 py-2 text-sm font-bold text-ink"
            }
          >
            {item.label}
          </button>
        ))}
      </fieldset>

      {isReview ? (
        reviewableBookings.length > 0 ? (
          <>
            <label className="mt-8 block text-sm font-bold text-ink">
              후기 쓸 예약
              <select
                value={selectedBooking?.id ?? ""}
                onChange={(event) => setReservationId(Number(event.target.value))}
                className="mt-2 w-full border border-border px-4 py-3 text-sm font-normal"
              >
                <option value="">이용 완료한 예약을 선택해 주세요</option>
                {reviewableBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.programName} · {booking.scheduleLabel}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-bold text-ink">
              별점
              <select
                value={rating || ""}
                onChange={(event) => setRating(Number(event.target.value))}
                className="mt-2 w-full border border-border px-4 py-3 text-sm font-normal"
              >
                <option value="">별점을 선택해 주세요</option>
                {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}점</option>)}
              </select>
            </label>
          </>
        ) : (
          <div className="mt-8 border border-border bg-subtle px-5 py-8 text-center">
            <p className="font-bold text-ink">
              {completedBookings.length > 0 ? "작성할 수 있는 후기를 모두 작성했어요" : "아직 완료된 예약이 없어요"}
            </p>
            <Link
              href={completedBookings.length > 0 ? "/community/reviews" : "/programs"}
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              {completedBookings.length > 0 ? "체험 후기 보러 가기" : "프로그램 보러 가기"}
            </Link>
          </div>
        )
      ) : (
        selectedClub ? (
          <label className="mt-8 block text-sm font-bold text-ink">
            동호회
            <select
              value={selectedClub.id}
              onChange={(event) => setClubId(Number(event.target.value))}
              className="mt-2 w-full border border-border px-4 py-3 text-sm font-normal"
            >
              {joinedClubs.map((club) => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </label>
        ) : (
          <div className="mt-8 border border-border bg-subtle px-5 py-8 text-center">
            <p className="font-bold text-ink">가입한 동호회가 있어야 글을 쓸 수 있어요.</p>
            <p className="mt-2 text-sm text-muted">아직 가입한 동호회가 없어요.</p>
            <Link href="/community/clubs" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
              동호회 보러 가기
            </Link>
          </div>
        )
      )}

      {(!isReview || reviewableBookings.length > 0) && (
        <>
          <label className="mt-8 block text-sm font-bold text-ink">
            제목
            <input
              value={title}
              maxLength={50}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border border-border px-4 py-3 text-sm font-normal outline-none"
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-ink">
            내용
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              className="mt-2 w-full border border-border px-4 py-3 text-sm font-normal outline-none"
            />
          </label>
          {!isReview && (
            <>
              <label className="mt-4 block text-sm font-bold text-ink">
                사진 (최대 4장)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => onPhotos(event.target.files)}
                  className="mt-2 block text-sm font-normal"
                />
              </label>
              {photos.length > 0 && (
                <ul className="mt-4 grid grid-cols-4 gap-2">
                  {photos.map((src) => (
                    <li key={src}>
                      <div
                        role="img"
                        aria-label="선택한 사진 미리보기"
                        className="aspect-square w-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${src}")` }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
      {message && (
        <p role="alert" className="mt-4 text-sm font-semibold text-primary">
          {message}
        </p>
      )}
      {(!isReview || reviewableBookings.length > 0) && (
        <button
          type="submit"
          disabled={isReview && savingReview}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {editing ? "수정 완료" : "등록"}
        </button>
      )}
    </form>
  );
}
