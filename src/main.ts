import "./styles.css";
import { DEFAULT_PLAYER_NAME, FB_INIT_TIMEOUT_MS, STARTUP_FB_UNAVAILABLE } from "./constants";
import { formatGreeting } from "./greeting";
import {
  getPlayerName,
  initFacebook,
  useUrlFallback,
} from "./facebook";
import {
  DEFAULT_GREETING_TEMPLATE,
  fetchGreetingTemplate,
  getLogoUrl,
} from "./server-data";
import { wireSendForm } from "./send-form";
import { getUserFromUrl, getWishFromUrl } from "./url-fallback";
import {
  displayGreeting,
  displayLogo,
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
    return {
      entryData,
      playerName: getPlayerName(),
      showBanner: false,
    };
  } catch {
    useUrlFallback();
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
}

async function main(): Promise<void> {
  hideApp();

  const elements = getElements();
  displayLogo(elements.logo, getLogoUrl());
  void loadDataSuccessImage(elements.dataReceiveStatus, elements.dataSuccessImage);

  const [greetingTemplate, startup] = await Promise.all([
    fetchGreetingTemplate(),
    loadStartup(),
  ]);

  displayGreeting(
    elements.greeting,
    formatGreeting(greetingTemplate, startup.playerName),
  );

  revealWithUi(startup.entryData, startup.showBanner);
}

main().catch(() => {
  useUrlFallback();
  try {
    const elements = getElements();
    displayLogo(elements.logo, getLogoUrl());
    void loadDataSuccessImage(elements.dataReceiveStatus, elements.dataSuccessImage);
    displayGreeting(
      elements.greeting,
      formatGreeting(DEFAULT_GREETING_TEMPLATE, DEFAULT_PLAYER_NAME),
    );
    revealWithUi({ wish: getWishFromUrl() }, true);
  } catch {
    hideLoading();
  }
});
