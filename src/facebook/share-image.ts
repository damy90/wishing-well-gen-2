import {
  CSS_VARS,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  SHARE_SUBTITLE,
  SHARE_TITLE,
} from "../constants";

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function createShareImage(): string {
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_IMAGE_WIDTH;
  canvas.height = SHARE_IMAGE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  const bgStart = readCssVar(CSS_VARS.colorBgStart);
  const bgEnd = readCssVar(CSS_VARS.colorBgEnd);
  const accent = readCssVar(CSS_VARS.colorAccent);
  const text = readCssVar(CSS_VARS.colorText);

  const gradient = ctx.createLinearGradient(0, 0, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT);
  gradient.addColorStop(0, bgStart);
  gradient.addColorStop(1, bgEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT);

  const centerX = SHARE_IMAGE_WIDTH / 2;

  ctx.fillStyle = accent;
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(SHARE_TITLE, centerX, 90);

  ctx.fillStyle = text;
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(SHARE_SUBTITLE, centerX, 140);

  return canvas.toDataURL("image/png");
}
