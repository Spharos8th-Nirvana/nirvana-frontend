import "server-only";

import sanitizeHtml from "sanitize-html";

const contentSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
  allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
  allowedSchemes: ["http", "https"],
};

export function sanitizeContentHtml(html: string): string {
  return sanitizeHtml(html, contentSanitizeOptions);
}
