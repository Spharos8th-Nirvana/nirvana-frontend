"use client";

import type { ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";

type ToolbarButtonProps = {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

/** 툴바 버튼 하나. 지금 적용된 서식은 눌린 상태(aria-pressed)로 보입니다. */
function ToolbarButton({ label, isActive, disabled, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-default transition md:size-9 ${
        isActive ? "bg-primary text-white" : "text-ink-control hover:bg-subtle"
      } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-border md:mx-1" />;
}

type ReviewEditorToolbarProps = {
  editor: Editor;
};

export default function ReviewEditorToolbar({ editor }: ReviewEditorToolbarProps) {
  // 커서가 움직이거나 글이 바뀔 때마다 지금 적용된 서식을 다시 읽어 버튼 상태에 반영합니다.
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      heading: current.isActive("heading", { level: 3 }),
      bulletList: current.isActive("bulletList"),
      blockquote: current.isActive("blockquote"),
      link: current.isActive("link"),
    }),
  });

  const toggleLink = () => {
    if (active.link) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const url = window.prompt("연결할 주소를 입력해 주세요. (https://로 시작)");
    if (!url) {
      return;
    }

    // http·https 주소만 허용합니다. (javascript: 같은 주소 차단)
    if (!/^https?:\/\//i.test(url.trim())) {
      window.alert("https:// 또는 http://로 시작하는 주소만 넣을 수 있어요.");
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  return (
    <div
      role="toolbar"
      aria-label="글 서식"
      className="flex flex-wrap items-center gap-0 border-b border-border bg-surface px-2 py-1.5 md:gap-0.5"
    >
      <ToolbarButton
        label="굵게"
        isActive={active.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
      </ToolbarButton>
      <ToolbarButton
        label="기울임"
        isActive={active.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <path d="M14 5h-4M14 19h-4M14 5l-4 14" />
      </ToolbarButton>
      <ToolbarButton
        label="밑줄"
        isActive={active.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="소제목"
        isActive={active.heading}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <path d="M6 4v16M18 4v16M6 12h12" />
      </ToolbarButton>
      <ToolbarButton
        label="목록"
        isActive={active.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
      </ToolbarButton>
      <ToolbarButton
        label="인용"
        isActive={active.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <path d="M7 7h4v6H5V9a2 2 0 0 1 2-2zM17 7h4v6h-6V9a2 2 0 0 1 2-2zM5 13v4M15 13v4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="링크" isActive={active.link} onClick={toggleLink}>
        <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
      </ToolbarButton>
      {/* 사진 넣기는 업로드 API가 정해지면 연결합니다. */}
      <ToolbarButton label="사진 넣기 (준비 중)" disabled>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M21 16l-5-5-8 8" />
      </ToolbarButton>
    </div>
  );
}

/**
 * 커서가 링크 위에 있으면 연결된 주소를 보여 주는 줄.
 * 에디터 아래쪽에 겹쳐 띄우므로(absolute) 나타나거나 사라져도 내용 칸 크기가 바뀌지 않습니다.
 */
export function ReviewEditorLinkBar({ editor }: ReviewEditorToolbarProps) {
  const link = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      isActive: current.isActive("link"),
      // 커서가 있는 링크의 주소 (링크가 아니면 빈 값)
      href: (current.getAttributes("link").href as string | undefined) ?? "",
    }),
  });

  if (!link.isActive || !link.href) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-border bg-subtle px-3 py-2 text-xs">
      <span className="shrink-0 text-muted">연결된 주소</span>
      {/* 주소를 누르면 새 탭에서 열어 확인할 수 있습니다. */}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 truncate text-primary underline"
      >
        {link.href}
      </a>
      <button
        type="button"
        onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        className="ml-auto shrink-0 rounded-full border border-border bg-surface px-3 py-1 font-semibold text-ink-control transition hover:border-primary"
      >
        링크 빼기
      </button>
    </div>
  );
}
