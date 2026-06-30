import {
  EMPTY_WISH_MESSAGE,
  STATUS_IMAGE_SHARE_CAPTURING,
  STATUS_IMAGE_SHARED,
  STATUS_SCREENSHOT_CAPTURING,
  STATUS_SCREENSHOT_SHARED,
} from "./constants";
import { getPlatform } from "./platform";
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

interface ShareButtonConfig {
  button: HTMLButtonElement;
  status: HTMLElement;
  capturingMessage: string;
  sharedMessage: string;
  watermark: boolean;
}

function wireShareButton(
  elements: AppElements,
  config: ShareButtonConfig,
  isSharing: () => boolean,
  setSharing: (value: boolean) => void,
): void {
  const platform = getPlatform();
  const {
    screenshotShareSection,
    imageShareSection,
    wishDisplay,
    screenshotShareButton,
    imageShareButton,
  } = elements;
  const sectionsToHide = [screenshotShareSection, imageShareSection];
  const buttons = [screenshotShareButton, imageShareButton];

  config.button.addEventListener("click", async () => {
    if (isSharing()) {
      return;
    }

    setSharing(true);
    for (const button of buttons) {
      button.disabled = true;
    }
    hideStatus(config.status);
    showStatus(config.status, config.capturingMessage);

    const wish = readVisibleWish(wishDisplay);
    for (const section of sectionsToHide) {
      section.hidden = true;
    }

    try {
      const imageDataUrl = await captureAppScreenshot({ watermark: config.watermark });
      await platform.shareScreenshot(imageDataUrl, wish);
      const sharedMessage =
        platform.id === "web"
          ? platform.shareScreenshotSuccessMessage()
          : config.sharedMessage;
      showStatus(config.status, sharedMessage);
    } catch (error) {
      showStatus(config.status, platform.formatShareError(error), true);
    } finally {
      for (const section of sectionsToHide) {
        section.hidden = false;
      }
      setSharing(false);
      for (const button of buttons) {
        button.disabled = false;
      }
    }
  });
}

export function wireScreenshotShare(elements: AppElements): void {
  let sharing = false;

  wireShareButton(
    elements,
    {
      button: elements.screenshotShareButton,
      status: elements.screenshotShareStatus,
      capturingMessage: STATUS_SCREENSHOT_CAPTURING,
      sharedMessage: STATUS_SCREENSHOT_SHARED,
      watermark: false,
    },
    () => sharing,
    (value) => {
      sharing = value;
    },
  );

  wireShareButton(
    elements,
    {
      button: elements.imageShareButton,
      status: elements.imageShareStatus,
      capturingMessage: STATUS_IMAGE_SHARE_CAPTURING,
      sharedMessage: STATUS_IMAGE_SHARED,
      watermark: true,
    },
    () => sharing,
    (value) => {
      sharing = value;
    },
  );
}
