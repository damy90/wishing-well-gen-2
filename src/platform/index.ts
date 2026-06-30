import { facebookPlatform } from "./facebook";
import type { Platform } from "./types";
import { webPlatform } from "./web";

export type { Platform, PlatformContext } from "./types";

let platform: Platform | null = null;

export function getPlatform(): Platform {
  if (!platform) {
    platform =
      import.meta.env.VITE_PLATFORM === "facebook"
        ? facebookPlatform
        : webPlatform;
  }
  return platform;
}
