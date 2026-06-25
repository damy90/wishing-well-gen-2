import {
  DATA_SEND_BACK_FAILED,
  DATA_SEND_BACK_SENDING,
  DATA_SEND_BACK_SENT,
  getApiBaseUrl,
} from "./constants";
import { postDataToApi } from "./server-data";
import { type AppElements } from "./ui";

export function wireDataSendBack(elements: AppElements, blob: Blob): void {
  const { dataSendBackButton, dataSendBackStatus } = elements;

  if (!getApiBaseUrl()) {
    return;
  }

  dataSendBackButton.hidden = false;
  dataSendBackButton.disabled = false;
  let sending = false;

  dataSendBackButton.addEventListener("click", async () => {
    if (sending) {
      return;
    }

    sending = true;
    dataSendBackButton.disabled = true;
    dataSendBackStatus.hidden = false;
    dataSendBackStatus.textContent = DATA_SEND_BACK_SENDING;
    dataSendBackStatus.classList.remove("data-receive-status--error");

    try {
      await postDataToApi(blob);
      dataSendBackStatus.textContent = DATA_SEND_BACK_SENT;
    } catch {
      dataSendBackStatus.textContent = DATA_SEND_BACK_FAILED;
      dataSendBackStatus.classList.add("data-receive-status--error");
    } finally {
      sending = false;
      dataSendBackButton.disabled = false;
    }
  });
}
