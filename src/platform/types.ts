export interface PlatformContext {
  incomingWish?: string;
}

export interface Platform {
  readonly id: "web" | "facebook";
  init(): Promise<PlatformContext>;
  getPlayerName(): string;
  getLocale(): string | null;
  shareWish(wish: string): Promise<void>;
  shareScreenshot(imageDataUrl: string, wish?: string): Promise<void>;
  shareAppLink(): Promise<void>;
  formatShareError(error: unknown): string;
  shareWishSuccessMessage(): string;
  shareScreenshotSuccessMessage(): string;
  shareAppLinkSuccessMessage(): string;
  mountPlayerNameOverlay?(container: HTMLElement): Promise<boolean>;
}

// Future: AuthProvider { getDisplayName(): string | null }
// WebPlatform.getPlayerName() is the swap point for social auth.
