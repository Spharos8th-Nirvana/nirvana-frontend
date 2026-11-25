"use client";

import { useState, type FormEvent } from "react";

/** 시안 뉴스레터. 주소를 저장하지 않고 안내 문장만 보여 줍니다. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    setMessage(
      value
        ? "시안이라 실제로 구독되지는 않아요. 입력한 주소는 저장하지 않았어요."
        : "이메일 주소를 입력해 주세요.",
    );
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <label htmlFor="news-mail" className="sr-only">
        이메일 주소
      </label>
      <div className="flex items-center rounded-full bg-white p-1">
        <input
          id="news-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일 주소를 입력하세요"
          className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-ink outline-none"
        />
        <button
          type="submit"
          aria-label="구독하기"
          className="grid h-9 w-9 place-items-center rounded-full bg-action text-primary"
        >
          →
        </button>
      </div>
      {message ? (
        <p className="mt-2 text-xs text-white/80" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
