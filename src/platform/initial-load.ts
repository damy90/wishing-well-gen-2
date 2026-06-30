import { FONTS_READY_TIMEOUT_MS } from "../constants";

export async function runInitialLoad(
  onProgress?: (progress: number) => void,
): Promise<void> {
  onProgress?.(10);

  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => setTimeout(resolve, FONTS_READY_TIMEOUT_MS)),
    ]);
  }

  onProgress?.(90);
}
