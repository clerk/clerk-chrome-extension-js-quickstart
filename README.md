# Browser Extension JS Playground

A Chrome extension demo using `@clerk/chrome-extension` with plain TypeScript. No Chrome extension frameworks (no WXT, Plasmo, CRXJS, etc.). Uses `pnpm build` (esbuild under the hood) to bundle the TypeScript source.

## Project structure

```
src/
  popup.ts              # TypeScript source (bundled to build/popup.js)
build/
  manifest.json         # Chrome extension manifest (Manifest V3)
  popup.html            # Popup page
  popup.css             # Popup styles
  popup.js              # Bundled output (gitignored)
.env.example            # Environment variable template
.env                    # Your publishable key (gitignored)
```

Static extension files (`manifest.json`, `popup.html`, `popup.css`) live directly in `build/` and are checked into git. The esbuild config automatically loads `.env`, replaces `process.env.CLERK_PUBLISHABLE_KEY` at build time, and bundles `src/popup.ts` into `build/popup.js`.

## Getting started

### 1. Build `@clerk/chrome-extension` and its dependencies

From the repository root:

```bash
pnpm turbo build --filter=@clerk/chrome-extension...
```

### 2. Start pkglab and publish packages

From the repository root, start the local registry and publish `@clerk/chrome-extension` (along with its workspace dependencies):

```bash
pnpm pkglab up
pnpm pkglab pub @clerk/chrome-extension
```

### 3. Add packages from pkglab

```bash
cd playground/browser-extension-js
```

To see which packages have been published:

```bash
pnpm pkglab:ls
```

From this playground directory (`playground/browser-extension-js`):

```bash
pnpm pkglab:add
```

### 4. Install dependencies

This playground is not a pnpm workspace member, so use `pnpm install` to install dependencies:

```bash
pnpm install --ignore-workspace
```

The first time you install packages you may need to approve builds. Use:

```bash
pnpm approve-builds --ignore-workspace
```

> **Note:** `pnpm approve-builds` is interactive. If you need a non-interactive alternative, add the following to `package.json`. This list may need updating when dependencies change.
>
> ```json
> "pnpm": {
>   "onlyBuiltDependencies": [
>     "@clerk/shared",
>     "browser-tabs-lock",
>     "bufferutil",
>     "core-js",
>     "esbuild",
>     "utf-8-validate"
>   ]
> }
> ```

### 5. Set up environment

Copy `.env.example` to `.env` and add your Clerk publishable key:

```bash
cp .env.example .env
```

Then edit `.env`:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 6. Build the extension

```bash
pnpm build
```

### 7. Update `host_permissions` in the manifest

Add your Clerk Frontend API domain to `host_permissions` in `build/manifest.json`. The extension needs this permission to send cookies and authenticate with Clerk. Your Frontend API domain is derived from your publishable key (e.g., `pk_test_abc...` decodes to `your-app-42.clerk.accounts.dev`):

```json
"host_permissions": [
  "http://localhost/*",
  "https://your-app-42.clerk.accounts.dev/*"
]
```

### 8. Load the extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `build/` directory inside this playground

## Development

To rebuild on file changes:

```bash
pnpm dev
```

## Rebuilding after package changes

When you make changes to `@clerk/chrome-extension` (or its dependencies), rebuild and republish to pkglab:

```bash
# From repo root
pnpm turbo build --filter=@clerk/chrome-extension... && pnpm pkglab pub @clerk/chrome-extension


# From this playground

# If you haven't approved build yet
pnpm install --ignore-workspace
pnpm approve-builds
pnpm dev 

# If you have approved builds already
pnpm install
pnpm dev
```
