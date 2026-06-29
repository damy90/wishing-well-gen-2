import { DATA_IMAGE_FAILED, DATA_IMAGE_WAITING, EMPTY_WISH_MESSAGE, LOCATION_UNKNOWN } from "./constants";
import { getDataSuccessImageUrl } from "./server-data";

function getAppElement(): HTMLElement {
  return document.querySelector(".app")!;
}

function getStartupBanner(): HTMLElement {
  return document.getElementById("startup-banner")!;
}

export function hideApp(): void {
  getAppElement().classList.add("app--hidden");
}

export function revealApp(): void {
  getAppElement().classList.remove("app--hidden");
}

export function showStartupBanner(message: string): void {
  const banner = getStartupBanner();
  banner.textContent = message;
  banner.hidden = false;
}

export function hideStartupBanner(): void {
  getStartupBanner().hidden = true;
}

export function hideLoading(): void {
  const loading = document.getElementById("loading-indicator");
  if (!loading) {
    return;
  }

  loading.hidden = true;
  loading.classList.add("loading--hidden");
}

export interface AppElements {
  logo: HTMLImageElement;
  greeting: HTMLElement;
  playerContext: HTMLElement;
  wishDisplay: HTMLElement;
  dataReceiveStatus: HTMLElement;
  dataSuccessImage: HTMLImageElement;
  dataSendBackButton: HTMLButtonElement;
  dataSendBackStatus: HTMLElement;
  wishInput: HTMLTextAreaElement;
  sendButton: HTMLButtonElement;
  sendForm: HTMLFormElement;
  statusMessage: HTMLElement;
}

export function getElements(): AppElements {
  return {
    logo: document.getElementById("logo") as HTMLImageElement,
    greeting: document.getElementById("greeting")!,
    playerContext: document.getElementById("player-context")!,
    wishDisplay: document.getElementById("wish-display")!,
    dataReceiveStatus: document.getElementById("data-receive-status")!,
    dataSuccessImage: document.getElementById("data-success-image") as HTMLImageElement,
    dataSendBackButton: document.getElementById("data-send-back-button") as HTMLButtonElement,
    dataSendBackStatus: document.getElementById("data-send-back-status")!,
    wishInput: document.getElementById("wish-input") as HTMLTextAreaElement,
    sendButton: document.getElementById("send-button") as HTMLButtonElement,
    sendForm: document.getElementById("send-form") as HTMLFormElement,
    statusMessage: document.getElementById("status-message")!,
  };
}

export function displayLogo(logo: HTMLImageElement, logoUrl: string): void {
  logo.src = logoUrl;
  logo.hidden = false;
}

export function displayGreeting(greetingEl: HTMLElement, text: string): void {
  greetingEl.textContent = text;
}

export function displayPlayerContext(
  playerContextEl: HTMLElement,
  location: string | null,
  locale: string | null,
): void {
  const lines = [location ? `Location: ${location}` : LOCATION_UNKNOWN];
  if (locale) {
    lines.push(`Language: ${locale}`);
  }

  playerContextEl.textContent = lines.join("\n");
  playerContextEl.hidden = false;
}

export function displayWish(wishDisplay: HTMLElement, wish: string | undefined): void {
  if (wish?.trim()) {
    wishDisplay.textContent = wish.trim();
    wishDisplay.classList.remove("wish-display--empty");
  } else {
    wishDisplay.textContent = EMPTY_WISH_MESSAGE;
    wishDisplay.classList.add("wish-display--empty");
  }
}

export async function loadDataSuccessImage(
  statusEl: HTMLElement,
  img: HTMLImageElement,
): Promise<Blob | null> {
  statusEl.textContent = DATA_IMAGE_WAITING;
  statusEl.hidden = false;
  statusEl.classList.remove("data-receive-status--error");
  img.hidden = true;
  img.removeAttribute("src");

  const imageUrl = getDataSuccessImageUrl();
  let blob: Blob | null = null;
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      statusEl.textContent = DATA_IMAGE_FAILED;
      statusEl.classList.add("data-receive-status--error");
      return null;
    }
    blob = await response.blob();
  } catch {
    statusEl.textContent = DATA_IMAGE_FAILED;
    statusEl.classList.add("data-receive-status--error");
    return null;
  }

  const objectUrl = URL.createObjectURL(blob);
  img.onload = () => {
    URL.revokeObjectURL(objectUrl);
  };
  img.src = objectUrl;
  img.hidden = false;
  statusEl.hidden = true;
  return blob;
}

export function updateSendButton(
  sendButton: HTMLButtonElement,
  input: HTMLTextAreaElement,
  sending: boolean,
): void {
  sendButton.disabled = sending || !input.value.trim();
}

export function clearInput(input: HTMLTextAreaElement): void {
  input.value = "";
}

export function showStatus(
  statusMessage: HTMLElement,
  message: string,
  isError = false,
): void {
  statusMessage.textContent = message;
  statusMessage.hidden = false;
  statusMessage.classList.toggle("status-message--error", isError);
}

export function hideStatus(statusMessage: HTMLElement): void {
  statusMessage.hidden = true;
  statusMessage.classList.remove("status-message--error");
}
