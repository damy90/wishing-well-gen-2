import { SHARE_INTENT, shareText } from "../constants";
import { shareWishUrl } from "../url-fallback";
import { installDevMock } from "./dev-mock";
import { formatShareErrorMessage } from "./sdk-error";
import { createShareImage } from "./share-image";
import type { FBInstantSDK, WishEntryData } from "./types";

export type { SharePayload, WishEntryData } from "./types";
export { formatShareErrorMessage };

let urlFallbackActive = false;

export function useUrlFallback(): void {
  urlFallbackActive = true;
}

export function isUrlFallbackActive(): boolean {
  return urlFallbackActive;
}

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

async function runInitialLoad(
  onProgress: (progress: number) => void,
): Promise<void> {
  onProgress(10);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  onProgress(90);
}

export async function initFacebook(): Promise<WishEntryData | null> {
  const sdk = getSDK();
  await sdk.initializeAsync();
  sdk.setLoadingProgress(0);
  await runInitialLoad((pct) => sdk.setLoadingProgress(pct));
  sdk.setLoadingProgress(100);
  await sdk.startGameAsync();
  return sdk.getEntryPointData();
}

export function getPlayerName(): string {
  const sdk = getSDK();
  return sdk.player.getName()?.trim() || "Guest";
}

export async function shareWish(wish: string): Promise<void> {
  if (urlFallbackActive) {
    await shareWishUrl(wish);
    return;
  }

  const sdk = getSDK();
  const payload = {
    intent: SHARE_INTENT,
    text: shareText(wish),
    data: { wish },
    image: createShareImage(),
  };

  await sdk.shareAsync(payload);
}
