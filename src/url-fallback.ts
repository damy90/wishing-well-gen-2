import {
  getAppShareUrl,
  SCREENSHOT_SHARE_GENERIC_TEXT,
  SHARE_TITLE,
  shareText,
} from "./constants";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

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

export async function shareAppUrl(): Promise<void> {
  const url = getAppShareUrl();

  if (navigator.share) {
    await navigator.share({ title: SHARE_TITLE, text: url, url });
    return;
  }

  if (!navigator.clipboard?.writeText) {
    throw new Error("Sharing is not supported in this browser.");
  }

  await navigator.clipboard.writeText(url);
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

export async function shareScreenshotUrl(
  imageDataUrl: string,
  wish?: string,
): Promise<void> {
  const text = wish ? shareText(wish) : SCREENSHOT_SHARE_GENERIC_TEXT;
  const file = new File([dataUrlToBlob(imageDataUrl)], "wishing-well.png", {
    type: "image/png",
  });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: SHARE_TITLE, text, files: [file] });
    return;
  }

  const link = document.createElement("a");
  link.href = imageDataUrl;
  link.download = "wishing-well.png";
  link.click();
}
