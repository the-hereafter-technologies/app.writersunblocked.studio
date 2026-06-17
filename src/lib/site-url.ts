const DEFAULT_SITE_URL = "https://writersunblocked.studio";

export const getSiteUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return DEFAULT_SITE_URL;
  }

  const normalized =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  try {
    return new URL(normalized).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
};
