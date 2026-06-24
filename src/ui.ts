import { EMPTY_WISH_MESSAGE } from "./constants";

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
  wishDisplay: HTMLElement;
  wishInput: HTMLTextAreaElement;
  sendButton: HTMLButtonElement;
  sendForm: HTMLFormElement;
  statusMessage: HTMLElement;
}

export function getElements(): AppElements {
  return {
    logo: document.getElementById("logo") as HTMLImageElement,
    greeting: document.getElementById("greeting")!,
    wishDisplay: document.getElementById("wish-display")!,
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

export function displayWish(wishDisplay: HTMLElement, wish: string | undefined): void {
  if (wish?.trim()) {
    wishDisplay.textContent = wish.trim();
    wishDisplay.classList.remove("wish-display--empty");
  } else {
    wishDisplay.textContent = EMPTY_WISH_MESSAGE;
    wishDisplay.classList.add("wish-display--empty");
  }
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
