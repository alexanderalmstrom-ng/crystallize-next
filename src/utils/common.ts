export function isServer() {
  return typeof window === "undefined";
}

export function normalizeSlug(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function removeLeadingSlash(slug: string) {
  return slug.startsWith("/") ? slug.slice(1) : slug;
}

export function getBaseURL() {
  if (!isServer()) {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
