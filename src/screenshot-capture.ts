import html2canvas from "html2canvas";
import { CSS_VARS } from "./constants";

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

export async function captureAppScreenshot(): Promise<string> {
  const app = document.querySelector("main.app");
  if (!app) {
    throw new Error("App element not found.");
  }

  const canvas = await html2canvas(app as HTMLElement, {
    backgroundColor: null,
    useCORS: true,
    scale: window.devicePixelRatio || 1,
    ignoreElements: (el) =>
      el.id === "screenshot-share-button" || el.id === "screenshot-share-status",
  });

  const scaled = scaleCanvas(canvas, MAX_OUTPUT_WIDTH);
  const normalized = normalizeAspectRatio(scaled);
  return normalized.toDataURL("image/png");
}
