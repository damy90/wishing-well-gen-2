import { getServerBaseUrl } from "./constants";

export interface GreetingConfig {
  template: string;
}

export const DEFAULT_GREETING_TEMPLATE = "Hello {name} (fallback)";

function dataAssetPath(filename: string): string {
  const base = getServerBaseUrl();
  if (base) {
    return `${base}/data/${filename}`;
  }
  return `./data/${filename}`;
}

function assetsPath(filename: string): string {
  const base = getServerBaseUrl();
  if (base) {
    return `${base}/assets/${filename}`;
  }
  return `./assets/${filename}`;
}

/** Logo URL for the img src. Facebook build uses bundled ./assets/logo.jpg. */
export function getLogoUrl(): string {
  const bundled = import.meta.env.VITE_LOGO_SRC?.trim();
  if (bundled) {
    return bundled;
  }
  return assetsPath("logo.jpg");
}

async function fetchJson(url: string): Promise<GreetingConfig | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as GreetingConfig;
  } catch {
    return null;
  }
}

export async function fetchGreetingTemplate(): Promise<string> {
  const remote = await fetchJson(dataAssetPath("greeting.json"));
  if (remote?.template?.trim()) {
    return remote.template.trim();
  }

  return DEFAULT_GREETING_TEMPLATE;
}

export function getDataSuccessImageUrl(): string {
  return dataAssetPath("success.jpeg");
}

export async function fetchRemoteImageObjectUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function fetchServerData(): Promise<{
  greeting: GreetingConfig;
  logoUrl: string;
}> {
  const template = await fetchGreetingTemplate();
  return {
    greeting: { template },
    logoUrl: getLogoUrl(),
  };
}
