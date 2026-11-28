"use client";

import { useEffect, useImperativeHandle, type Ref } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ReviewEditorToolbar, {
  ReviewEditorLinkBar,
} from "@/features/review/components/molecules/ReviewEditorToolbar";
import type { ReviewEditorHandle } from "@/features/review/types/review";

type ReviewEditorProps = {
  id: string;
  labelId: string;
  invalid?: boolean;
  describedBy?: string;
  onChange: (html: string) => void;
  ref?: Ref<ReviewEditorHandle>;
};

/**
 * 후기 내용 HTML 에디터 (Tiptap).
 * 쓴 내용은 HTML(editor.getHTML())로 바깥에 알립니다. 최종 HTML 정제는 Backend가 합니다.
 */
export default function ReviewEditor({
  id,
  labelId,
  invalid = false,
  describedBy,
  onChange,
  ref,
}: ReviewEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 후기에 필요한 서식만 남깁니다. 소제목은 한 단계(h3)만 씁니다.
        heading: { levels: [3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: { openOnClick: false, autolink: true, protocols: ["http", "https"] },
      }),
    ],
    // Next.js에서는 서버에서 미리 그리지 않고 브라우저에서 에디터를 만듭니다. (화면 불일치 오류 방지)
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        // 에디터 안의 글 모양. Tailwind 기본값이 목록·제목 모양을 지우므로 여기서 다시 줍니다.
        // 높이를 고정(h-80)하고 넘치면 안에서 스크롤합니다. 아래 pb-14는 "연결된 주소" 줄이 덮을 자리입니다.
        class:
          "h-80 overflow-y-auto px-4 pt-3.5 pb-14 text-body-15 text-ink outline-none [&_a]:text-primary [&_a]:underline [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-sage-03 [&_blockquote]:pl-3 [&_blockquote]:text-muted [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_li]:my-0.5 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  // 오류 상태가 바뀔 때마다 화면 읽기 프로그램용 속성(aria-invalid, aria-describedby)을 갱신합니다.
  // (editorProps는 에디터를 만들 때 한 번만 적용되기 때문입니다.)
  useEffect(() => {
    if (!editor) {
      return;
    }

    const dom = editor.view.dom;
    dom.setAttribute("aria-invalid", String(invalid));
    if (describedBy) {
      dom.setAttribute("aria-describedby", describedBy);
    } else {
      dom.removeAttribute("aria-describedby");
    }
  }, [editor, invalid, describedBy]);

  useImperativeHandle(ref, () => ({
    focus: () => editor?.commands.focus(),
  }));

  return (
    <div
      className={`overflow-hidden rounded-md border bg-background transition-colors focus-within:border-primary ${
        invalid ? "border-error" : "border-border"
      }`}
    >
      {editor ? (
        <>
          <ReviewEditorToolbar editor={editor} />
          <div className="relative">
            <EditorContent editor={editor} />
            <ReviewEditorLinkBar editor={editor} />
          </div>
        </>
      ) : (
        // 브라우저에서 에디터가 준비되기 전까지 같은 높이의 자리를 둡니다.
        <div className="h-[368px]" aria-hidden="true" />
      )}
    </div>
  );
}
