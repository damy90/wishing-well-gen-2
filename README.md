# Wishing Well Gen 2

A minimal Facebook Instant Game and self-hosted web app. Send a personal whish to a friend; when they open your share, they see it in **I whish you:**. Logo and greeting text are loaded from the GitHub Pages deployment (the self-hosted “server” side).

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- **Receive a whish:** add `?wish=Hello%20friend` to the URL.
- **Set user name (mock):** add `?user=Alice` (used for the greeting in dev).
- **Send:** uses a dev mock for `FBInstant`; check the browser console for the share payload.

Real share/receive behavior requires Facebook Web Hosting or the embedded player (see below).

## Configuration

Copy `.env.example` to `.env` and set your values:

| Variable | Purpose |
|----------|---------|
| `GITHUB_PAGES_BASE` | Base path for GitHub Pages build (default `/wishing-well-gen-2/`) |
| `VITE_SERVER_BASE_URL` | Full GitHub Pages origin for the Facebook build (e.g. `https://you.github.io/wishing-well-gen-2`) |

## Deploy GitHub Pages first (self-hosted side)

The Facebook build fetches `server/greeting.json` and `server/logo.jpg` from this deployment at runtime.

1. Push this repo to GitHub.
2. In **Settings → Pages**, set source to the **`gh-pages`** branch, folder **`/` (root)**.
3. Push to `main` (or run the **Deploy GitHub Pages** workflow manually). The workflow builds and publishes `dist/` to `gh-pages`.
4. Verify these URLs load:
   - `https://YOUR_USER.github.io/wishing-well-gen-2/`
   - `https://YOUR_USER.github.io/wishing-well-gen-2/server/greeting.json`
   - `https://YOUR_USER.github.io/wishing-well-gen-2/server/logo.jpg`

To build locally:

```bash
npm run build:github-pages
```

Output: `dist/` with `index.html`, `server/greeting.json`, and `server/logo.jpg` (copied from [`assets/logo.jpg`](assets/logo.jpg)).

Replace [`assets/logo.jpg`](assets/logo.jpg) to change the logo.

## Build for Facebook Instant Games

**Deploy GitHub Pages first** and set `VITE_SERVER_BASE_URL` in `.env` to your live Pages URL.

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
└── assets/
    ├── index-*.js
    └── index-*.css
```

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
3. **Greeting:** confirm **Hello {name}** uses the Facebook player name and logo loads from GitHub Pages.

### Embedded self-hosted test (optional)

Serve `dist/` over HTTPS locally, then open:

```
https://www.facebook.com/embed/instantgames/YOUR_GAME_ID/player?game_url=https://localhost:PORT
```

## How it works

| Feature | Facebook Instant Game | Self-hosted / GitHub Pages |
|---------|----------------------|----------------------------|
| Greeting | `FBInstant.player.getName()` + template from `server/greeting.json` | `?user=` or **Guest** + same template |
| Logo | Fetched from GitHub Pages `server/logo.jpg` | Same origin `server/logo.jpg` |
| Receive whish | `FBInstant.getEntryPointData().wish` | `?wish=` query param |
| Send whish | `FBInstant.shareAsync({ data: { wish } })` | Web Share API or clipboard link |

On successful send, the text box is cleared.

## Common pitfalls

- Zip must contain `index.html` at the **root**, not inside a subfolder.
- `fbapp-config.json` must be in the zip root next to `index.html`.
- Recipients must open the **shared link** to receive the whish via `getEntryPointData()`.
- Facebook build needs a live GitHub Pages URL in `VITE_SERVER_BASE_URL` before building `dist.zip`.
- GitHub Pages project sites need `GITHUB_PAGES_BASE` to match the repo name (e.g. `/wishing-well-gen-2/`).

## Project layout

```
assets/logo.jpg      # Source logo (copied to public/server/ on build)
public/server/       # greeting.json + logo.jpg (deployed to GitHub Pages)
src/               # TypeScript app
scripts/           # build-facebook.mjs (dist.zip), build-github-pages.mjs
fbapp-config.json  # Instant Games platform config
```
