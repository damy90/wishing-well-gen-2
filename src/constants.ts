export const EMPTY_WISH_MESSAGE =
  "No whish yet — ask a friend to send you one!";

export const STATUS_SENT =
  "Whish sent! Your friend will see it when they open your share.";

export const STATUS_URL_SHARED =
  "Whish link ready — your friend will see it when they open the link.";

export const STATUS_SHARE_FAILED =
  "Share cancelled or failed. Try again.";

export const STARTUP_FB_UNAVAILABLE =
  "Facebook SDK not connected — receive via ?wish= in the URL; Send shares a link.";

export const DATA_IMAGE_WAITING = "Waiting…";
export const DATA_IMAGE_FAILED = "Failed to load data.";

export const DEFAULT_PLAYER_NAME = "anonymous";

/** Milliseconds before showing the UI when FBInstant init hangs outside Facebook. */
export const FB_INIT_TIMEOUT_MS = 10_000;

/** Required by Facebook Web Hosting shareAsync validation (SDK 7.1 host). */
export const SHARE_INTENT = "SHARE" as const;

export const SHARE_IMAGE_WIDTH = 400;
export const SHARE_IMAGE_HEIGHT = 210;

export const SHARE_TITLE = "Wishing Well";
export const SHARE_SUBTITLE = "I whish you something special!";

/** Canonical server assets host (GitHub Pages). */
export const SERVER_BASE_URL = "https://damy90.github.io/wishing-well-gen-2";

export const CSS_VARS = {
  colorText: "--color-text",
  colorAccent: "--color-accent",
  colorBgStart: "--color-bg-start",
  colorBgMid: "--color-bg-mid",
  colorBgEnd: "--color-bg-end",
  colorButtonText: "--color-button-text",
} as const;

export function shareText(wish: string): string {
  return `I whish you: ${wish}`;
}

/** GitHub Pages origin for server assets. */
export function getServerBaseUrl(): string {
  const base =
    import.meta.env.VITE_SERVER_BASE_URL?.trim() || SERVER_BASE_URL;
  return base.replace(/\/$/, "");
}
