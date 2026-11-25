"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  extraPostsServerSnapshot,
  extraPostsSnapshot,
  parseExtraPosts,
  saveExtraPost,
  subscribeExtraPosts,
} from "@/features/community/data/club-posts";
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

/** 시안의 글쓰기 화면. 완료 예약·가입 동호회 데이터가 없어 저장하지 않습니다. */
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const joinedIds = parseJoinedClubs(
    useSyncExternalStore(subscribeJoinedClubs, joinedClubsSnapshot, joinedClubsServerSnapshot),
  );
  if (editing && seenEdit !== editing.id) {
    setTitle(editing.title);
    setBody(editing.body);
    setSeenEdit(editing.id);
  }
  const joinedClubs = clubs.filter((club) => joinedIds.includes(club.id));
  const selectedClub = joinedClubs.find((club) => club.id === clubId) ?? joinedClubs[0];

  const onPhotos = (files: FileList | null) => {
    const next = Array.from(files ?? []).slice(0, 4);
    if ((files?.length ?? 0) > 4) {
      setMessage("사진은 4장까지 미리볼 수 있어요.");
    } else {
      setMessage("");
    }
    setPhotos(next.map((file) => URL.createObjectURL(file)));
  };

  const submit = () => {
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
        submit();
      }}
    >
      <fieldset className="flex gap-2">
        <legend className="sr-only">게시판</legend>
        {boards.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={board === item.id}
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

      {board === "reviews" ? (
        <div className="mt-8 border border-border bg-subtle px-5 py-8 text-center">
          <p className="font-bold text-ink">완료된 예약이 있어야 후기를 쓸 수 있어요.</p>
          <p className="mt-2 text-sm text-muted">아직 완료된 예약이 없어요.</p>
          <Link href="/programs" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
            프로그램 보러 가기
          </Link>
        </div>
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
      {message && (
        <p role="alert" className="mt-4 text-sm font-semibold text-primary">
          {message}
        </p>
      )}
      <button type="submit" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">
        {editing ? "수정 완료" : "등록"}
      </button>
    </form>
  );
}
