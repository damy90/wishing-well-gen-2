import {
  DEFAULT_PLAYER_NAME,
  STATUS_SHARE_FAILED,
  STATUS_URL_SHARED,
} from "../constants";
import {
  getUserFromUrl,
  getWishFromUrl,
  shareAppUrl,
  shareScreenshotUrl,
  shareWishUrl,
} from "../url-fallback";
import { runInitialLoad } from "./initial-load";
import type { Platform, PlatformContext } from "./types";

export const webPlatform: Platform = {
  id: "web",

  async init(): Promise<PlatformContext> {
    await runInitialLoad();
    return { incomingWish: getWishFromUrl() };
  },

  getPlayerName(): string {
    return getUserFromUrl() ?? DEFAULT_PLAYER_NAME;
  },

  getLocale(): string | null {
    return navigator.language?.trim() || null;
  },

  shareWish(wish: string): Promise<void> {
    return shareWishUrl(wish);
  },

  shareScreenshot(imageDataUrl: string, wish?: string): Promise<void> {
    return shareScreenshotUrl(imageDataUrl, wish);
  },

  shareAppLink(): Promise<void> {
    return shareAppUrl();
  },

  formatShareError(): string {
    return STATUS_SHARE_FAILED;
  },

  shareWishSuccessMessage(): string {
    return STATUS_URL_SHARED;
  },

  shareScreenshotSuccessMessage(): string {
    return STATUS_URL_SHARED;
  },

  shareAppLinkSuccessMessage(): string {
    return STATUS_URL_SHARED;
  },
};
