const LOGIN_KEY = "nirvana.preview-login";

export function subscribePreviewLogin(onChange: () => void) {
  window.addEventListener("nirvana-login", onChange);
  return () => window.removeEventListener("nirvana-login", onChange);
}

export function previewLoginSnapshot() {
  return window.sessionStorage.getItem(LOGIN_KEY) === "1" ? "1" : "";
}

export function previewLoginServerSnapshot() {
  return "";
}

export function setPreviewLogin(on: boolean) {
  if (on) {
    window.sessionStorage.setItem(LOGIN_KEY, "1");
  } else {
    window.sessionStorage.removeItem(LOGIN_KEY);
  }
  window.dispatchEvent(new Event("nirvana-login"));
}

/** 로그인 뒤에 돌아갈 주소. 같은 사이트 안의 경로만 받습니다. */
export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}
