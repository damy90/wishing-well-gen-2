import { getServerBaseUrl } from "./constants";

export interface GreetingConfig {
  template: string;
}

export interface ServerData {
  greeting: GreetingConfig;
  logoUrl: string;
}

function serverAssetPath(filename: string): string {
  const base = getServerBaseUrl();
  if (base) {
    return `${base}/server/${filename}`;
  }
  return `./server/${filename}`;
}

export async function fetchServerData(): Promise<ServerData> {
  const greetingUrl = serverAssetPath("greeting.json");
  const logoUrl = serverAssetPath("logo.jpg");

  const greetingRes = await fetch(greetingUrl);
  if (!greetingRes.ok) {
    throw new Error(`Failed to load greeting config (${greetingRes.status})`);
  }

  const greeting = (await greetingRes.json()) as GreetingConfig;
  if (!greeting.template?.trim()) {
    throw new Error("Greeting config is missing template");
  }

  return { greeting, logoUrl };
}
