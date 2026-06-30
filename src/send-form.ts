import { getPlatform } from "./platform";
import {
  clearInput,
  hideStatus,
  showStatus,
  updateSendButton,
  type AppElements,
} from "./ui";

export function wireSendForm(elements: AppElements): void {
  const platform = getPlatform();
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
      await platform.shareWish(wish);
      clearInput(wishInput);
      showStatus(statusMessage, platform.shareWishSuccessMessage());
    } catch (error) {
      showStatus(statusMessage, platform.formatShareError(error), true);
    } finally {
      sending = false;
      updateSendButton(sendButton, wishInput, sending);
    }
  });
}
