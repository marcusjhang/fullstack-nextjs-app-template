# Base44 Development Environment

## Running and verifying

Run `docker compose -f docker-compose.base44.yml up -d --build`. Both `web` and `php` must become healthy. The web container installs the root lockfile with `npm ci`, then runs the custom Express/Next development server directly to avoid npm reporting SIGTERM as a failure on normal container stops. Source is bind-mounted; Watchpack polling enables hot reload.

The development homepage calls `curd-data-init.php` on mount. PHP is therefore required, not optional. The `php` service uses PHP's development server to execute the existing scripts from `public/server` on each request, without the optional Node wrapper or its unrelated backend dependencies. No database, migrations, or external credentials are required. CRUD storage is the existing `public/server/curd-data/posts.json` file; do not overwrite or reset existing records. Other backend microservice demos are not started.

`PHP_SERVER_URL=http://php:4000` in Compose uses the existing Next `/php-server` rewrite so browser requests stay same-origin. Keep development API configuration using real local endpoints rather than switching to static production JSON: static fixtures do not implement authentication or persistent edits.

Verify `/`, `/php-server/curd-data-init.php`, and `/php-server/curd.php` return HTTP 200 and valid content. In the browser, confirm the automatic initialization request returns 200 and there are no failed requests or unhandled errors. `/sign-in.html` is public; signed-in dashboard checks require the user's session. The template's plain anchor navigation performs a full document load; preview pushState navigation may change the URL without rendering the target, so use an explicit route capture for route checks.

## Configuration notes

- `server.js` binds to `0.0.0.0` for Docker and accepts `PORT` (default 3000).
- `next.config.js` appends the exact public preview origin only when `BASE44_PREVIEW_MODE === '1'` and `BASE44_PUBLIC_HOST_SUFFIX` is present. With the flag unset or any other value, the original `ALLOWED_DEV_ORIGINS` configuration is unchanged. Compose passes both variables through without hardcoding platform hostnames.
- SVG components require the supported Turbopack `rules` object, not a Webpack-style function.
- A hydration warning whose only differences are `data-gr-ext-installed` and `data-new-gr-c-s-check-loaded` on `body` is caused by the user's grammar browser extension. Do not suppress hydration warnings globally or change application markup to hide it; check a clean browser.
