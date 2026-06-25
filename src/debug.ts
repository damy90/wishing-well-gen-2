import "./styles.css";
import { getApiBaseUrl } from "./constants";

const POLL_MS = 2000;

interface LatestPayload {
  contentType: string;
  data: string;
  receivedAt: number;
}

const pageOpenedAt = Date.now();
let objectUrl: string | null = null;

const statusEl = document.getElementById("debug-status")!;
const metaEl = document.getElementById("data-meta")!;
const displayEl = document.getElementById("data-display")!;

function clearDisplay(): void {
  displayEl.replaceChildren();
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  metaEl.hidden = true;
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function renderPayload(payload: LatestPayload): void {
  clearDisplay();
  const { contentType, data } = payload;
  const bytes = base64ToBytes(data);
  const blob = new Blob([bytes], { type: contentType });
  const lowerType = contentType.toLowerCase();

  metaEl.textContent = `${contentType} · ${bytes.byteLength} bytes`;
  metaEl.hidden = false;
  statusEl.textContent = "Data received";

  if (lowerType.startsWith("image/")) {
    objectUrl = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = objectUrl;
    img.alt = "Received image";
    img.className = "debug-image";
    displayEl.appendChild(img);
    return;
  }

  if (lowerType.includes("json")) {
    const pre = document.createElement("pre");
    pre.className = "debug-text";
    try {
      const parsed = JSON.parse(new TextDecoder().decode(bytes));
      pre.textContent = JSON.stringify(parsed, null, 2);
    } catch {
      pre.textContent = new TextDecoder().decode(bytes);
    }
    displayEl.appendChild(pre);
    return;
  }

  if (lowerType.startsWith("text/")) {
    const pre = document.createElement("pre");
    pre.className = "debug-text";
    pre.textContent = new TextDecoder().decode(bytes);
    displayEl.appendChild(pre);
    return;
  }

  const pre = document.createElement("pre");
  pre.className = "debug-text";
  pre.textContent = `type: blob (${bytes.byteLength} bytes)`;
  displayEl.appendChild(pre);
}

async function poll(): Promise<void> {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    statusEl.textContent = "VITE_API_BASE_URL is not set.";
    return;
  }

  try {
    const response = await fetch(
      `${apiBase}/api/receive/latest?after=${pageOpenedAt}`,
    );
    if (response.status === 204) {
      return;
    }
    if (!response.ok) {
      statusEl.textContent = `Poll failed (${response.status}).`;
      return;
    }
    const payload = (await response.json()) as LatestPayload;
    renderPayload(payload);
  } catch {
    statusEl.textContent = "Cannot reach receive API.";
  }
}

clearDisplay();
statusEl.textContent = "Waiting for data…";
void poll();
setInterval(() => {
  void poll();
}, POLL_MS);
