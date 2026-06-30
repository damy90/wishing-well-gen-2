import { getPlatform } from "./platform";
import { hideStatus, showStatus, type AppElements } from "./ui";

export function wireAppShareLink(elements: AppElements): void {
  const platform = getPlatform();
  const { appShareLinkButton, appShareLinkStatus } = elements;
  let sharing = false;

  appShareLinkButton.addEventListener("click", async () => {
    if (sharing) {
      return;
    }

    sharing = true;
    appShareLinkButton.disabled = true;
    hideStatus(appShareLinkStatus);

    try {
      await platform.shareAppLink();
      showStatus(appShareLinkStatus, platform.shareAppLinkSuccessMessage());
    } catch (error) {
      showStatus(appShareLinkStatus, platform.formatShareError(error), true);
    } finally {
      sharing = false;
      appShareLinkButton.disabled = false;
    }
  });
}
