import {
  DEFAULT_PLAYER_NAME,
  STATUS_SCREENSHOT_SHARED,
  STATUS_SENT,
} from "../constants";
import {
  formatShareErrorMessage,
  getLocale as getFbLocale,
  getPlayerName as getFbPlayerName,
  initFacebook,
  mountPlayerNameOverlay as fbMountPlayerNameOverlay,
  shareScreenshot as fbShareScreenshot,
  shareWish as fbShareWish,
} from "../facebook";
import type { Platform, PlatformContext } from "./types";

export const facebookPlatform: Platform = {
  id: "facebook",

  async init(): Promise<PlatformContext> {
    const entryData = await initFacebook();
    return { incomingWish: entryData?.wish };
  },

  getPlayerName(): string {
    return getFbPlayerName();
  },

  getLocale(): string | null {
    return getFbLocale();
  },

  shareWish(wish: string): Promise<void> {
    return fbShareWish(wish);
  },

  shareScreenshot(imageDataUrl: string, wish?: string): Promise<void> {
    return fbShareScreenshot(imageDataUrl, wish);
  },

  formatShareError(error: unknown): string {
    return formatShareErrorMessage(error);
  },

  shareWishSuccessMessage(): string {
    return STATUS_SENT;
  },

  shareScreenshotSuccessMessage(): string {
    return STATUS_SCREENSHOT_SHARED;
  },

  mountPlayerNameOverlay(container: HTMLElement): Promise<boolean> {
    if (getFbPlayerName() !== DEFAULT_PLAYER_NAME) {
      return Promise.resolve(false);
    }
    return fbMountPlayerNameOverlay(container);
  },
};
