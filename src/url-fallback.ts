import { SHARE_TITLE, shareText } from "./constants";

export function getWishFromUrl(): string | undefined {
  const wish = new URLSearchParams(window.location.search).get("wish");
  const trimmed = wish?.trim();
  return trimmed || undefined;
}

export function getUserFromUrl(): string | undefined {
  const user = new URLSearchParams(window.location.search).get("user");
  const trimmed = user?.trim();
  return trimmed || undefined;
}

export function buildWishUrl(wish: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("wish", wish);
  return url.toString();
}

export async function shareWishUrl(wish: string): Promise<void> {
  const url = buildWishUrl(wish);
  const text = shareText(wish);

  if (navigator.share) {
    await navigator.share({ title: SHARE_TITLE, text, url });
    return;
  }

  if (!navigator.clipboard?.writeText) {
    throw new Error("Sharing is not supported in this browser.");
  }

  await navigator.clipboard.writeText(url);
}
