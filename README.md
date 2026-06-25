# Wishing Well Gen 2

A minimal Facebook Instant Game and self-hosted web app. Send a personal whish to a friend; when they open your share, they see it in **I whish you:**. Greeting text and logo are loaded from [https://damy90.github.io/wishing-well-gen-2/](https://damy90.github.io/wishing-well-gen-2/) (`data/greeting.json` and `assets/logo.jpg`).

## Local development

```bash
npm install
cp .env.example .env
npm run server   # terminal 1 — receive API on :3001
npm run dev      # terminal 2
```

Or use `npm run dev:full` to start both (server in background).

Open the URL Vite prints (usually `http://localhost:5173`).

- **Receive a whish:** add `?wish=Hello%20friend` to the URL.
- **Set user name (mock):** add `?user=Alice` (used for the greeting in dev).
- **Send:** uses a dev mock for `FBInstant`; check the browser console for the share payload.
- **Send data back:** after **Receiving data** loads `success.jpeg`, click **Send data back** to POST the image to the receive API.
- **Debug page:** open `/debug.html` — shows payloads received after the page was opened (empty on reload).

Real share/receive behavior requires Facebook Web Hosting or the embedded player (see below).

## Configuration

Copy `.env.example` to `.env` and set your values:

| Variable | Purpose |
|----------|---------|
| `GITHUB_PAGES_BASE` | Base path for GitHub Pages build (default `/wishing-well-gen-2/`) |
| `VITE_SERVER_BASE_URL` | Server assets origin (default `https://damy90.github.io/wishing-well-gen-2`) |
| `VITE_API_BASE_URL` | Receive API origin for **Send data back** and `debug.html` (default dev: `http://localhost:3001`) |

## Receive API (Node server)

GitHub Pages is static-only. The receive API runs as a separate Node process (`server/index.mjs`):

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/receive` | POST | Store latest payload (raw body + `Content-Type`) |
| `/api/receive/latest?after=<ms>` | GET | Return payload received after timestamp, or 204 |

```bash
npm run server
```

Deploy to Render, Railway, or similar. Set `VITE_API_BASE_URL` to that origin before `build:facebook` so the instant game can POST cross-origin (CORS is enabled).

**Debug page:** `https://damy90.github.io/wishing-well-gen-2/debug.html` polls the API and renders image, JSON, plain text, or `type: blob` by content type. The data field is empty on reload until new data arrives after page open.

## Deploy GitHub Pages (self-hosted side)

Live assets are hosted at:

- `https://damy90.github.io/wishing-well-gen-2/data/greeting.json`
- `https://damy90.github.io/wishing-well-gen-2/assets/logo.jpg`

The app fetches greeting JSON at runtime. Edit [`data/greeting.json`](data/greeting.json) in the repo; `build:github-pages` copies it into `dist/data/` and syncs the logo into `dist/assets/`.

1. Push this repo to GitHub.
2. In **Settings → Pages**, set source to the **`gh-pages`** branch, folder **`/` (root)**.
3. Push to `main` (or run the **Deploy GitHub Pages** workflow manually). The workflow builds and publishes `dist/` to `gh-pages`.
4. Verify these URLs load:
   - `https://damy90.github.io/wishing-well-gen-2/`
   - `https://damy90.github.io/wishing-well-gen-2/debug.html`
   - `https://damy90.github.io/wishing-well-gen-2/data/greeting.json`
   - `https://damy90.github.io/wishing-well-gen-2/assets/logo.jpg`

To build locally:

```bash
npm run build:github-pages
```

Output: `dist/` with `index.html`, `debug.html`, `data/greeting.json`, and `assets/logo.jpg`.

## Build for Facebook Instant Games

Set `VITE_SERVER_BASE_URL` in `.env` if you need a different server origin (default: `https://damy90.github.io/wishing-well-gen-2`).

Set `VITE_API_BASE_URL` to your deployed receive API origin so **Send data back** is enabled in the instant game.

```bash
npm install
npm run build:facebook
```

This produces:

- `dist/` — build output
- **`dist.zip`** at the project root — upload this to Meta Web Hosting

Zip layout (required):

```
dist.zip
├── index.html
├── fbapp-config.json
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── logo.jpg
```

The Facebook build bundles the logo locally (FB WebView blocks cross-origin images). Greeting JSON is **not** bundled — the instant game fetches live `data/greeting.json` from GitHub Pages at runtime.

### Meta Developer setup

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps/) → **Create App** → add **Instant Games**.
2. Add yourself as **Administrator** or **Developer** under App roles.
3. Run `npm run build:facebook` and upload **`dist.zip`**.
4. Dashboard → **Instant Games** → **Web Hosting** → **Upload Version** (+).
5. Wait for status **Standby**, then click the **star** to push to your test environment.
6. Test from **Preview** or Messenger → **Games** → **In Development**.

### Test flow

1. **Sender:** type a whish → **Send** → pick a friend in the share dialog.
2. **Recipient:** open the **shared link** (not the game from the menu) and confirm **I whish you:** shows the text.
3. **Greeting:** confirm **Hello {name}** uses the Facebook player name and logo loads from the bundled `assets/logo.jpg`.

### Embedded self-hosted test (optional)

Serve `dist/` over HTTPS locally, then open:

```
https://www.facebook.com/embed/instantgames/YOUR_GAME_ID/player?game_url=https://localhost:PORT
```

## How it works

| Feature | Facebook Instant Game | Self-hosted / GitHub Pages |
|---------|----------------------|----------------------------|
| Greeting | `FBInstant.player.getName()` + template from live `data/greeting.json` | `?user=` or **anonymous** + same template |
| Logo | Bundled `assets/logo.jpg` | Fetched from live `assets/logo.jpg` |
| Receive whish | `FBInstant.getEntryPointData().wish` | `?wish=` query param |
| Send whish | `FBInstant.shareAsync({ data: { wish } })` | Web Share API or clipboard link |

On successful send, the text box is cleared.

## Common pitfalls

- Zip must contain `index.html` at the **root**, not inside a subfolder.
- `fbapp-config.json` must be in the zip root next to `index.html`.
- Recipients must open the **shared link** to receive the whish via `getEntryPointData()`.
- Facebook build fetches greeting JSON from `https://damy90.github.io/wishing-well-gen-2/data/greeting.json` at runtime (not bundled in the zip).
- GitHub Pages project sites need `GITHUB_PAGES_BASE` to match the repo name (e.g. `/wishing-well-gen-2/`).

## Project layout

```
data/greeting.json              # Greeting template; deployed to dist/data/ on GitHub Pages
server/index.mjs                # Receive API (POST /api/receive)
debug.html                      # Debug page for received payloads
scripts/sync-server-assets.mjs  # Pulls logo from live GitHub Pages for build
public/assets/                  # Generated logo; not committed
src/                            # TypeScript app
scripts/                        # build-facebook.mjs (dist.zip), build-github-pages.mjs
fbapp-config.json               # Instant Games platform config
```
