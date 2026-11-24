"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PROGRAM_LIST_URL,
  readProgramListUrl,
} from "@/features/program/utils/list-url";

/** 사용자가 보던 프로그램 목록(검색 조건 포함)으로 돌아가는 링크 */
export default function BackToListLink() {
  const router = useRouter();

  return (
    <Link
      href={DEFAULT_PROGRAM_LIST_URL}
      onClick={(event) => {
        // 새 탭 열기(Ctrl/⌘ 클릭 등)는 브라우저 기본 동작에 맡깁니다.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
          return;
        }
        // 클릭하는 순간 기억해 둔 목록 주소를 읽어 이동합니다.
        event.preventDefault();
        router.push(readProgramListUrl());
      }}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
    >
      <span aria-hidden="true">←</span>
      목록으로 돌아가기
    </Link>
  );
}
