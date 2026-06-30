const DEFAULT_MARKETING_URL = "https://writersunblocked.studio";

export const getMarketingUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_MARKETING_URL?.trim();

  if (!raw) {
    return DEFAULT_MARKETING_URL;
  }

  const normalized =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  try {
    return new URL(normalized).origin;
  } catch {
    return DEFAULT_MARKETING_URL;
  }
};
