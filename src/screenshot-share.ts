import {
  EMPTY_WISH_MESSAGE,
  STATUS_SCREENSHOT_CAPTURING,
  STATUS_SCREENSHOT_SHARED,
  STATUS_URL_SHARED,
} from "./constants";
import {
  formatShareErrorMessage,
  isUrlFallbackActive,
  shareScreenshot,
} from "./facebook";
import { captureAppScreenshot } from "./screenshot-capture";
import { hideStatus, showStatus, type AppElements } from "./ui";

function readVisibleWish(wishDisplay: HTMLElement): string | undefined {
  const text = wishDisplay.textContent?.trim();
  if (
    !text ||
    text === EMPTY_WISH_MESSAGE ||
    wishDisplay.classList.contains("wish-display--empty")
  ) {
    return undefined;
  }

  return text;
}

export function wireScreenshotShare(elements: AppElements): void {
  const {
    screenshotShareButton,
    screenshotShareSection,
    screenshotShareStatus,
    wishDisplay,
  } = elements;
  let sharing = false;

  screenshotShareButton.addEventListener("click", async () => {
    if (sharing) {
      return;
    }

    sharing = true;
    screenshotShareButton.disabled = true;
    hideStatus(screenshotShareStatus);
    showStatus(screenshotShareStatus, STATUS_SCREENSHOT_CAPTURING);

    const wish = readVisibleWish(wishDisplay);
    screenshotShareSection.hidden = true;

    try {
      const imageDataUrl = await captureAppScreenshot();
      await shareScreenshot(imageDataUrl, wish);
      showStatus(
        screenshotShareStatus,
        isUrlFallbackActive() ? STATUS_URL_SHARED : STATUS_SCREENSHOT_SHARED,
      );
    } catch (error) {
      showStatus(screenshotShareStatus, formatShareErrorMessage(error), true);
    } finally {
      screenshotShareSection.hidden = false;
      sharing = false;
      screenshotShareButton.disabled = false;
    }
  });
}
