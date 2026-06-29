import { getUserFromUrl, getWishFromUrl } from "../url-fallback";
import type { FBInstantSDK } from "./types";

export function installDevMock(): FBInstantSDK {
  console.warn("[dev] Using FBInstant mock — test share/receive inside Facebook.");

  return {
    async initializeAsync() {
      await new Promise((r) => setTimeout(r, 150));
    },
    async startGameAsync() {
      await new Promise((r) => setTimeout(r, 150));
    },
    setLoadingProgress(progress) {
      console.warn(`[dev] setLoadingProgress(${progress})`);
    },
    getEntryPointData() {
      const wish = getWishFromUrl();
      return wish ? { wish } : null;
    },
    getLocale() {
      return navigator.language.replace("-", "_");
    },
    async shareAsync(payload) {
      console.warn("[dev] shareAsync payload", payload);
      await new Promise((r) => setTimeout(r, 300));
    },
    player: {
      getName() {
        return getUserFromUrl() ?? "Dev Player";
      },
    },
  };
}
