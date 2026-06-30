import "./styles.css";
import { DEFAULT_PLAYER_NAME } from "./constants";
import { wireDataSendBack } from "./data-send-back";
import { formatGreeting } from "./greeting";
import { getPlatform } from "./platform";
import {
  DEFAULT_GREETING_TEMPLATE,
  fetchGeoLocation,
  fetchGreetingTemplate,
  formatGeoLocation,
  getLogoUrl,
} from "./server-data";
import { wireAppShareLink } from "./app-share-link";
import { wireScreenshotShare } from "./screenshot-share";
import { wireSendForm } from "./send-form";
import {
  displayGreeting,
  displayLogo,
  displayPlayerContext,
  displayWish,
  getElements,
  hideApp,
  hideLoading,
  loadDataSuccessImage,
  revealApp,
} from "./ui";

async function loadPlayerContext(elements: ReturnType<typeof getElements>): Promise<void> {
  const platform = getPlatform();
  const locale = platform.getLocale();
  const geo = await fetchGeoLocation();
  const location = geo ? formatGeoLocation(geo) : null;
  displayPlayerContext(elements.playerContext, location, locale);
}

async function loadDataImageAndWireSendBack(elements: ReturnType<typeof getElements>): Promise<void> {
  const blob = await loadDataSuccessImage(
    elements.dataReceiveStatus,
    elements.dataSuccessImage,
  );
  if (blob) {
    wireDataSendBack(elements, blob);
  }
}

function revealWithUi(incomingWish?: string): void {
  hideLoading();
  const elements = getElements();
  revealApp();
  displayWish(elements.wishDisplay, incomingWish);
  wireSendForm(elements);
  wireScreenshotShare(elements);
  wireAppShareLink(elements);
}

async function main(): Promise<void> {
  hideApp();

  const platform = getPlatform();
  const elements = getElements();
  displayLogo(elements.logo, getLogoUrl());
  displayPlayerContext(elements.playerContext, null, platform.getLocale());
  void loadDataImageAndWireSendBack(elements);

  const [greetingTemplate, ctx] = await Promise.all([
    fetchGreetingTemplate(),
    platform.init(),
  ]);

  const playerName = platform.getPlayerName();

  if (playerName === DEFAULT_PLAYER_NAME && platform.mountPlayerNameOverlay) {
    const placeholder = "{name}";
    const idx = greetingTemplate.indexOf(placeholder);
    if (idx >= 0) {
      elements.greeting.textContent = greetingTemplate.slice(0, idx);
      void platform.mountPlayerNameOverlay(elements.greeting);
    } else {
      displayGreeting(
        elements.greeting,
        formatGreeting(greetingTemplate, playerName),
      );
    }
  } else {
    displayGreeting(
      elements.greeting,
      formatGreeting(greetingTemplate, playerName),
    );
  }

  revealWithUi(ctx.incomingWish);
  void loadPlayerContext(elements);
}

main().catch((error) => {
  console.warn("[startup] Critical failure:", error);
  try {
    const platform = getPlatform();
    const elements = getElements();
    displayLogo(elements.logo, getLogoUrl());
    void loadDataImageAndWireSendBack(elements);
    displayGreeting(
      elements.greeting,
      formatGreeting(DEFAULT_GREETING_TEMPLATE, DEFAULT_PLAYER_NAME),
    );
    revealWithUi();
    void loadPlayerContext(elements);
  } catch {
    hideLoading();
  }
});
