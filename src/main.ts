import "./styles.css";
import { DEFAULT_PLAYER_NAME, FB_INIT_TIMEOUT_MS, STARTUP_FB_UNAVAILABLE } from "./constants";
import { wireDataSendBack } from "./data-send-back";
import { formatGreeting } from "./greeting";
import {
  getLocale,
  getPlayerName,
  initFacebook,
  isUrlFallbackActive,
  logStartupFailure,
  mountPlayerNameOverlay,
  useUrlFallback,
} from "./facebook";
import {
  DEFAULT_GREETING_TEMPLATE,
  fetchGeoLocation,
  fetchGreetingTemplate,
  formatGeoLocation,
  getLogoUrl,
} from "./server-data";
import { wireScreenshotShare } from "./screenshot-share";
import { wireSendForm } from "./send-form";
import { getUserFromUrl, getWishFromUrl } from "./url-fallback";
import {
  displayGreeting,
  displayLogo,
  displayPlayerContext,
  displayWish,
  getElements,
  hideApp,
  hideLoading,
  hideStartupBanner,
  loadDataSuccessImage,
  revealApp,
  showStartupBanner,
} from "./ui";
import type { WishEntryData } from "./facebook/types";

interface StartupResult {
  entryData: WishEntryData | null;
  playerName: string;
  showBanner: boolean;
}

let startupSettled = false;

function initWithTimeout(): Promise<WishEntryData | null> {
  return Promise.race([
    initFacebook(),
    new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("Facebook SDK init timed out")),
        FB_INIT_TIMEOUT_MS,
      );
    }),
  ]);
}

async function loadStartup(): Promise<StartupResult> {
  try {
    const entryData = await initWithTimeout();
    startupSettled = true;
    return {
      entryData,
      playerName: getPlayerName(),
      showBanner: false,
    };
  } catch (error) {
    logStartupFailure(error);
    useUrlFallback();
    startupSettled = true;
    return {
      entryData: { wish: getWishFromUrl() },
      playerName: getUserFromUrl() ?? DEFAULT_PLAYER_NAME,
      showBanner: true,
    };
  }
}

function revealWithUi(entryData: WishEntryData | null, showBanner: boolean): void {
  hideLoading();
  const elements = getElements();
  revealApp();

  if (showBanner) {
    showStartupBanner(STARTUP_FB_UNAVAILABLE);
  } else {
    hideStartupBanner();
  }

  displayWish(elements.wishDisplay, entryData?.wish);
  wireSendForm(elements);
  wireScreenshotShare(elements);
}

async function loadPlayerContext(elements: ReturnType<typeof getElements>): Promise<void> {
  const locale = getLocale();
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

async function main(): Promise<void> {
  hideApp();

  // Meta expects initializeAsync() as early as possible — start before other fetches.
  const startupPromise = loadStartup();

  const elements = getElements();
  displayLogo(elements.logo, getLogoUrl());
  displayPlayerContext(elements.playerContext, null, getLocale());
  void loadDataImageAndWireSendBack(elements);

  const [greetingTemplate, startup] = await Promise.all([
    fetchGreetingTemplate(),
    startupPromise,
  ]);

  if (startup.playerName === DEFAULT_PLAYER_NAME && !startup.showBanner) {
    const placeholder = "{name}";
    const idx = greetingTemplate.indexOf(placeholder);
    if (idx >= 0) {
      elements.greeting.textContent = greetingTemplate.slice(0, idx);
      void mountPlayerNameOverlay(elements.greeting);
    } else {
      displayGreeting(
        elements.greeting,
        formatGreeting(greetingTemplate, startup.playerName),
      );
    }
  } else {
    displayGreeting(
      elements.greeting,
      formatGreeting(greetingTemplate, startup.playerName),
    );
  }

  revealWithUi(startup.entryData, startup.showBanner);
  void loadPlayerContext(elements);
}

main().catch((error) => {
  console.warn("[startup] Critical failure:", error);
  if (!startupSettled) {
    logStartupFailure(error);
    useUrlFallback();
  }
  try {
    const elements = getElements();
    displayLogo(elements.logo, getLogoUrl());
    void loadDataImageAndWireSendBack(elements);
    displayGreeting(
      elements.greeting,
      formatGreeting(DEFAULT_GREETING_TEMPLATE, DEFAULT_PLAYER_NAME),
    );
    revealWithUi({ wish: getWishFromUrl() }, isUrlFallbackActive());
    void loadPlayerContext(elements);
  } catch {
    hideLoading();
  }
});
