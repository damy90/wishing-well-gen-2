/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM: "web" | "facebook";
  readonly VITE_SERVER_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LOGO_SRC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
