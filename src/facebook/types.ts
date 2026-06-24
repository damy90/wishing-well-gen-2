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
  getName(): string | null;
}

export interface FBInstantSDK {
  initializeAsync(): Promise<void>;
  startGameAsync(): Promise<void>;
  setLoadingProgress(progress: number): void;
  getEntryPointData(): WishEntryData | null;
  shareAsync(payload: SharePayload): Promise<void>;
  player: FBInstantPlayer;
}

declare global {
  interface Window {
    FBInstant?: FBInstantSDK;
  }
}
