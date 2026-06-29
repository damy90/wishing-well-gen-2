import html2canvas from "html2canvas";
import { CSS_VARS, SHARE_TITLE } from "./constants";

/** FB Feed min width/height ratio (landscape). */
const FB_MIN_ASPECT = 1.91;
/** FB Feed max width/height ratio (4:5 portrait). */
const FB_MAX_ASPECT = 4 / 5;
const MAX_OUTPUT_WIDTH = 1200;

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const bgStart = readCssVar(CSS_VARS.colorBgStart);
  const bgEnd = readCssVar(CSS_VARS.colorBgEnd);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgStart);
  gradient.addColorStop(1, bgEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function scaleCanvas(source: HTMLCanvasElement, maxWidth: number): HTMLCanvasElement {
  if (source.width <= maxWidth) {
    return source;
  }

  const scale = maxWidth / source.width;
  const scaled = document.createElement("canvas");
  scaled.width = maxWidth;
  scaled.height = Math.round(source.height * scale);
  const ctx = scaled.getContext("2d");
  if (!ctx) {
    return source;
  }

  ctx.drawImage(source, 0, 0, scaled.width, scaled.height);
  return scaled;
}

function normalizeAspectRatio(source: HTMLCanvasElement): HTMLCanvasElement {
  const srcW = source.width;
  const srcH = source.height;
  const aspect = srcW / srcH;

  let outW = srcW;
  let outH = srcH;

  if (aspect < FB_MAX_ASPECT) {
    outW = Math.ceil(srcH * FB_MAX_ASPECT);
    outH = srcH;
  } else if (aspect > FB_MIN_ASPECT) {
    outW = srcW;
    outH = Math.ceil(srcW / FB_MIN_ASPECT);
  }

  const output = document.createElement("canvas");
  output.width = outW;
  output.height = outH;
  const ctx = output.getContext("2d");
  if (!ctx) {
    return source;
  }

  drawGradientBackground(ctx, outW, outH);
  const offsetX = Math.round((outW - srcW) / 2);
  const offsetY = Math.round((outH - srcH) / 2);
  ctx.drawImage(source, offsetX, offsetY);
  return output;
}

function drawWatermark(canvas: HTMLCanvasElement, label: string): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const padding = Math.round(canvas.width * 0.03);
  const fontSize = Math.max(16, Math.round(canvas.width * 0.04));
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  const textWidth = ctx.measureText(label).width;
  const barWidth = textWidth + padding * 2;
  const barHeight = fontSize + padding * 2;
  const barX = canvas.width - barWidth - padding;
  const barY = canvas.height - barHeight - padding;

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = readCssVar(CSS_VARS.colorAccent);
  ctx.fillText(label, canvas.width - padding * 2, canvas.height - padding * 2);
}

const SHARE_UI_IDS = new Set([
  "screenshot-share-section",
  "screenshot-share-button",
  "screenshot-share-status",
  "image-share-section",
  "image-share-button",
  "image-share-status",
]);

export interface CaptureAppScreenshotOptions {
  watermark?: boolean;
}

export async function captureAppScreenshot(
  options: CaptureAppScreenshotOptions = {},
): Promise<string> {
  const app = document.querySelector("main.app");
  if (!app) {
    throw new Error("App element not found.");
  }

  const canvas = await html2canvas(app as HTMLElement, {
    backgroundColor: null,
    useCORS: true,
    scale: window.devicePixelRatio || 1,
    ignoreElements: (el) => SHARE_UI_IDS.has(el.id),
  });

  const scaled = scaleCanvas(canvas, MAX_OUTPUT_WIDTH);
  const normalized = normalizeAspectRatio(scaled);
  if (options.watermark) {
    drawWatermark(normalized, SHARE_TITLE);
  }
  return normalized.toDataURL("image/png");
}
