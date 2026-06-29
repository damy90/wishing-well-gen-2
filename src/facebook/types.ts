export interface WishEntryData {
  wish?: string;
}

export interface SharePayload {
  intent: "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE";
  text: string;
  data: WishEntryData;
  image: string;
}

export interface FBInstantPlayer {
  getName?(): string | null;
  getID?(): string | null;
}

export interface FBInstantOverlayViews {
  createProfileNameOverlayViewAsync?(
    domElement: HTMLElement,
    textStyle?: string,
    iFrameStyle?: string,
    pathToCss?: string,
  ): Promise<{ showAsync(): Promise<void> }>;
}

export interface FBInstantSDK {
  initializeAsync(): Promise<void>;
  startGameAsync(): Promise<void>;
  setLoadingProgress(progress: number): void;
  getEntryPointData(): WishEntryData | null;
  getLocale?(): string;
  shareAsync(payload: SharePayload): Promise<void>;
  player: FBInstantPlayer;
  overlayViews?: FBInstantOverlayViews;
}

declare global {
  interface Window {
    FBInstant?: FBInstantSDK;
  }
}
