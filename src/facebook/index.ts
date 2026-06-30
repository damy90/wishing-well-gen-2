import {
  DEFAULT_PLAYER_NAME,
  FB_SDK_WAIT_MS,
  getAppShareUrl,
  SCREENSHOT_SHARE_GENERIC_TEXT,
  SHARE_INTENT,
  shareText,
} from "../constants";
import { runInitialLoad } from "../platform/initial-load";
import { installDevMock } from "./dev-mock";
import { formatShareErrorMessage } from "./sdk-error";
import { createShareImage } from "./share-image";
import type { FBInstantSDK, WishEntryData } from "./types";

export type { SharePayload, WishEntryData } from "./types";
export { formatShareErrorMessage };

const FB_SDK_POLL_MS = 50;

function getSDK(): FBInstantSDK {
  if (import.meta.env.DEV) {
    window.FBInstant = installDevMock();
    return window.FBInstant;
  }
  if (!window.FBInstant) {
    throw new Error("FBInstant SDK is not available.");
  }
  return window.FBInstant;
}

async function waitForFBInstant(deadlineMs: number): Promise<void> {
  const deadline = Date.now() + deadlineMs;
  while (!window.FBInstant) {
    if (Date.now() >= deadline) {
      throw new Error("FBInstant SDK is not available.");
    }
    await new Promise((resolve) => setTimeout(resolve, FB_SDK_POLL_MS));
  }
}

export async function initFacebook(): Promise<WishEntryData | null> {
  if (!import.meta.env.DEV) {
    await waitForFBInstant(FB_SDK_WAIT_MS);
  }
  const sdk = getSDK();
  await sdk.initializeAsync();
  sdk.setLoadingProgress(0);
  await runInitialLoad((pct) => sdk.setLoadingProgress(pct));
  sdk.setLoadingProgress(100);
  await sdk.startGameAsync();
  return sdk.getEntryPointData();
}

export function getPlayerName(): string {
  try {
    const sdk = getSDK();
    const getName = sdk.player?.getName;
    if (typeof getName !== "function") {
      return DEFAULT_PLAYER_NAME;
    }
    return getName.call(sdk.player)?.trim() || DEFAULT_PLAYER_NAME;
  } catch {
    return DEFAULT_PLAYER_NAME;
  }
}

export function getLocale(): string | null {
  try {
    const getLocaleFn = getSDK().getLocale;
    if (typeof getLocaleFn !== "function") {
      return null;
    }
    return getLocaleFn.call(getSDK())?.trim() || null;
  } catch {
    return null;
  }
}

/** Mount Meta-hosted player name (Zero Permissions SDK). Returns true if shown. */
export async function mountPlayerNameOverlay(container: HTMLElement): Promise<boolean> {
  if (import.meta.env.DEV) {
    return false;
  }

  const createOverlay = getSDK().overlayViews?.createProfileNameOverlayViewAsync;
  if (typeof createOverlay !== "function") {
    return false;
  }

  try {
    const overlay = await createOverlay.call(getSDK().overlayViews, container);
    await overlay.showAsync();
    return true;
  } catch (error) {
    console.warn("[FBInstant] profile name overlay failed:", error);
    return false;
  }
}

export async function shareAppLink(): Promise<void> {
  const sdk = getSDK();
  const payload = {
    intent: SHARE_INTENT,
    text: getAppShareUrl(),
    data: {},
    image: createShareImage(),
  };

  await sdk.shareAsync(payload);
}

export async function shareWish(wish: string): Promise<void> {
  const sdk = getSDK();
  const payload = {
    intent: SHARE_INTENT,
    text: shareText(wish),
    data: { wish },
    image: createShareImage(),
  };

  await sdk.shareAsync(payload);
}

export async function shareScreenshot(
  imageDataUrl: string,
  wish?: string,
): Promise<void> {
  const sdk = getSDK();
  const payload = {
    intent: SHARE_INTENT,
    text: wish ? shareText(wish) : SCREENSHOT_SHARE_GENERIC_TEXT,
    data: wish ? { wish } : {},
    image: imageDataUrl,
  };

  await sdk.shareAsync(payload);
}
