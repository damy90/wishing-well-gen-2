export const EMPTY_WISH_MESSAGE =
  "No whish yet — ask a friend to send you one!";

export const STATUS_SENT =
  "Whish sent! Your friend will see it when they open your share.";

export const STATUS_URL_SHARED =
  "Whish link ready — your friend will see it when they open the link.";

export const STATUS_SHARE_FAILED =
  "Share cancelled or failed. Try again.";

export const STATUS_SCREENSHOT_CAPTURING = "Capturing screenshot…";
export const STATUS_IMAGE_SHARE_CAPTURING = "Preparing share image…";
export const STATUS_SCREENSHOT_SHARED = "Screenshot shared!";
export const STATUS_IMAGE_SHARED = "Image shared!";
export const SCREENSHOT_SHARE_GENERIC_TEXT = "Check out Wishing Well!";

export const STARTUP_FB_UNAVAILABLE =
  "Facebook SDK not connected — receive via ?wish= in the URL; Send shares a link.";

export const DATA_IMAGE_WAITING = "Waiting…";
export const DATA_IMAGE_FAILED = "Failed to load data.";

export const DATA_SEND_BACK_SENDING = "Sending…";
export const DATA_SEND_BACK_SENT = "Data sent!";
export const DATA_SEND_BACK_FAILED = "Failed to send data.";

export const DEFAULT_PLAYER_NAME = "anonymous";

export const LOCATION_UNKNOWN = "Location: unknown";

/** Milliseconds before showing the UI when FBInstant init hangs outside Facebook. */
export const FB_INIT_TIMEOUT_MS = import.meta.env.DEV ? 10_000 : 30_000;

/** Max wait for FBInstant to appear on window before init (production only). */
export const FB_SDK_WAIT_MS = 5_000;

/** Max wait for document.fonts.ready during FB loading progress. */
export const FONTS_READY_TIMEOUT_MS = 3_000;

/** Required by Facebook Web Hosting shareAsync validation (SDK 7.1 host). */
export const SHARE_INTENT = "SHARE" as const;

export const SHARE_IMAGE_WIDTH = 400;
export const SHARE_IMAGE_HEIGHT = 210;

export const SHARE_TITLE = "Wishing Well";
export const SHARE_SUBTITLE = "I whish you something special!";

/** Canonical server assets host (GitHub Pages). */
export const SERVER_BASE_URL = "https://damy90.github.io/wishing-well-gen-2";

/** Default receive API in local dev when VITE_API_BASE_URL is unset. */
export const DEV_API_BASE_URL = "http://localhost:3001";

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

/** Receive API origin (separate Node deploy). */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim();
  if (base) {
    return base.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return DEV_API_BASE_URL;
  }
  return "";
}
