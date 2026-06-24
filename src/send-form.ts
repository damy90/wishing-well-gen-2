import { STATUS_SENT, STATUS_URL_SHARED } from "./constants";
import { formatShareErrorMessage, isUrlFallbackActive, shareWish } from "./facebook";
import {
  clearInput,
  hideStatus,
  showStatus,
  updateSendButton,
  type AppElements,
} from "./ui";

export function wireSendForm(elements: AppElements): void {
  const { wishInput, sendButton, sendForm, statusMessage } = elements;
  let sending = false;

  wishInput.addEventListener("input", () => {
    hideStatus(statusMessage);
    updateSendButton(sendButton, wishInput, sending);
  });

  sendForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const wish = wishInput.value.trim();
    if (!wish || sending) {
      return;
    }

    sending = true;
    updateSendButton(sendButton, wishInput, sending);
    hideStatus(statusMessage);

    try {
      await shareWish(wish);
      clearInput(wishInput);
      showStatus(
        statusMessage,
        isUrlFallbackActive() ? STATUS_URL_SHARED : STATUS_SENT,
      );
    } catch (error) {
      showStatus(statusMessage, formatShareErrorMessage(error), true);
    } finally {
      sending = false;
      updateSendButton(sendButton, wishInput, sending);
    }
  });
}
