"use client";

import { useState } from "react";
import Link from "next/link";

const boards = [
  { id: "reviews", label: "체험 후기" },
  { id: "clubs", label: "동호회" },
] as const;

type BoardId = (typeof boards)[number]["id"];

/** 시안의 글쓰기 화면. 완료 예약·가입 동호회 데이터가 없어 저장하지 않습니다. */
export default function CommunityWriteForm() {
  const [board, setBoard] = useState<BoardId>("reviews");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState("");

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
    setMessage("작성한 글은 이 화면에만 남고 저장되지 않아요.");
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
        <div className="mt-8 border border-border bg-subtle px-5 py-8 text-center">
          <p className="font-bold text-ink">가입한 동호회가 있어야 글을 쓸 수 있어요.</p>
          <p className="mt-2 text-sm text-muted">아직 가입한 동호회가 없어요.</p>
          <Link href="/community" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
            커뮤니티로 가기
          </Link>
        </div>
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
        등록
      </button>
    </form>
  );
}
