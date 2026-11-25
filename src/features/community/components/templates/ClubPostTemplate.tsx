"use client";

import { useState } from "react";
import Link from "next/link";
import type { ClubComment, ClubPost } from "@/features/community/data/club-posts";

function countComments(comments: ClubComment[]) {
  return comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0);
}

/** 시안 동호회 글 상세. 팀 예시 글 화면과 다른 경로입니다. */
export default function ClubPostTemplate({
  post,
  previous,
  next,
}: {
  post: ClubPost;
  previous: ClubPost | null;
  next: ClubPost | null;
}) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const listHref = `/community/clubs/${post.clubId}`;

  const addComment = () => {
    const text = draft.trim();
    if (text.length < 2) {
      setError("두 글자 이상 써 주세요.");
      return;
    }
    setComments((current) => [
      ...current,
      { id: Date.now(), author: "나", text, date: "2026.11.25", replies: [] },
    ]);
    setDraft("");
    setError("");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("글 링크를 복사했어요.");
    } catch {
      setNotice("복사가 막혔어요. 주소창의 링크를 직접 복사해 주세요.");
    }
  };

  return (
    <article className="mx-auto max-w-[760px]">
      <p className="text-sm text-muted">
        <Link href="/community/clubs" className="hover:text-primary">동호회</Link>
        {" · "}
        <Link href={listHref} className="hover:text-primary">{post.clubName}</Link>
      </p>
      <div className="mt-4 flex gap-2 text-xs font-bold text-primary">
        <span className="rounded-full bg-subtle px-3 py-1">{post.clubName}</span>
        <span className="rounded-full bg-subtle px-3 py-1">{post.cat}</span>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-ink">{post.title}</h2>
      <p className="mt-3 text-sm text-muted">
        {post.author} · {post.date} · 조회 {post.views} · 좋아요 {likes} · 댓글 {countComments(comments)}
      </p>
      <p className="mt-6 leading-7 text-ink">{post.body}</p>
      {post.imgs.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {post.imgs.map((src) => (
            <li key={src}>
              <div role="img" aria-label={post.title} className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url("${src}")` }} />
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setLiked((on) => !on);
            setLikes((count) => count + (liked ? -1 : 1));
          }}
          className="rounded-full border border-border px-4 py-2 text-sm font-bold"
        >
          좋아요 {likes}
        </button>
        <button type="button" onClick={copyLink} className="rounded-full border border-border px-4 py-2 text-sm font-bold">
          링크 복사
        </button>
        <button type="button" onClick={() => setNotice("신고가 접수됐어요 (시안).")} className="text-sm text-muted underline">
          신고
        </button>
      </div>
      {notice && <p className="mt-3 text-sm text-primary">{notice}</p>}

      <section className="mt-10" aria-label="댓글">
        <h3 className="font-bold text-ink">댓글 {countComments(comments)}</h3>
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p className="text-sm font-bold text-ink">
                {comment.author}
                {comment.staff && <span className="ml-2 text-xs text-primary">운영팀</span>}
                <span className="ml-2 font-normal text-muted">{comment.date}</span>
              </p>
              <p className="mt-1 text-sm text-ink">{comment.text}</p>
              {comment.replies.map((reply) => (
                <div key={reply.id} className="ml-6 mt-3">
                  <p className="text-sm font-bold">{reply.author}</p>
                  <p className="text-sm">{reply.text}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            addComment();
          }}
        >
          <label className="block text-sm font-bold text-ink">
            댓글
            <textarea
              value={draft}
              maxLength={300}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-2 w-full border border-border px-3 py-2 font-normal"
              rows={3}
            />
          </label>
          {error && <p role="alert" className="mt-2 text-sm text-primary">{error}</p>}
          <button type="submit" className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            댓글 등록
          </button>
        </form>
      </section>

      <div className="mt-10 grid gap-3 border-y border-border py-4 text-sm">
        <p>이전 글 {previous ? <Link href={`/community/posts/${previous.id}`} className="font-bold text-primary">{previous.title}</Link> : <em>글이 없어요</em>}</p>
        <p>다음 글 {next ? <Link href={`/community/posts/${next.id}`} className="font-bold text-primary">{next.title}</Link> : <em>글이 없어요</em>}</p>
      </div>
      <Link href={listHref} className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold">
        목록으로
      </Link>
    </article>
  );
}
