import { getServerBaseUrl } from "./constants";

export interface GreetingConfig {
  template: string;
}

const DEFAULT_GREETING_TEMPLATE = "Hello {name}";

function serverAssetPath(filename: string): string {
  const base = getServerBaseUrl();
  if (base) {
    return `${base}/server/${filename}`;
  }
  return `./server/${filename}`;
}

/** Logo URL for the img src. Facebook build uses bundled ./server/logo.jpg. */
export function getLogoUrl(): string {
  const bundled = import.meta.env.VITE_LOGO_SRC?.trim();
  if (bundled) {
    return bundled;
  }
  return serverAssetPath("logo.jpg");
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
  const remote = await fetchJson(serverAssetPath("greeting.json"));
  if (remote?.template?.trim()) {
    return remote.template.trim();
  }

  const bundled = await fetchJson("./server/greeting.json");
  if (bundled?.template?.trim()) {
    return bundled.template.trim();
  }

  return DEFAULT_GREETING_TEMPLATE;
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
