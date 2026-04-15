# Code Review: `site`

## Scope

Reviewed the `site` folder as a production-oriented code review, with emphasis on security, accessibility, deployment behavior, and maintainability. I inspected all source/config files, ran `npm run build`, inspected the generated bundle, and ran `npm audit`.

## Findings

### 1. Critical: the OpenRouter API key is exposed in the client bundle

Files:
`site/src/components/DigitalTwin.jsx:51`
`site/src/components/DigitalTwin.jsx:118`
`site/src/components/DigitalTwin.jsx:122`
`site/vite.config.js:6`
`site/.env:1`
`site/dist/assets/index-Cgb7fP3-.js:44`

`DigitalTwin.jsx` reads `import.meta.env.OPENROUTER_API_KEY` directly in browser code and sends it as a bearer token from the client. `vite.config.js` explicitly exposes every `OPENROUTER_` variable to the frontend via `envPrefix`, and the production build confirms the key is inlined into the shipped JavaScript bundle.

Why this matters:
Anyone opening the site can extract the key from DevTools or the built asset and use it outside the app. This is both a credential leak and an unbounded cost-abuse risk. The custom `envPrefix` also widens the blast radius by making any future `OPENROUTER_*` variable public by default.

Remedial action needed:
Move the OpenRouter call behind a server-side endpoint or serverless function and keep the API key server-only. Remove `OPENROUTER_` from `envPrefix`. Rotate the currently exposed key immediately and treat it as compromised. After rotating, rebuild and verify the generated bundle no longer contains the secret.

### 2. High: requests are hard-coded to identify themselves as `http://localhost:5173`

Files:
`site/src/components/DigitalTwin.jsx:124`

The chat request always sends `HTTP-Referer: http://localhost:5173`, even in production.

Why this matters:
Production traffic will be mislabeled as localhost. That can break provider-side allowlists, pollute attribution/analytics, and make troubleshooting harder. If provider configuration later depends on the real origin, production requests may fail unexpectedly.

Remedial action needed:
Populate the header from the real deployment origin on the server side, or omit it if it is not required. Do not hard-code a development-only origin into shipped client code.

### 3. Medium: reduced-motion user preferences are intentionally bypassed

Files:
`site/src/components/Nav.jsx:10`
`site/src/components/Nav.jsx:12`
`site/src/components/Nav.jsx:31`
`site/src/components/Nav.jsx:40`
`site/src/styles/components.css:121`
`site/src/styles/components.css:136`
`site/src/styles/components.css:146`
`site/src/styles/components.css:171`
`site/src/styles/components.css:204`
`site/src/styles/components.css:989`

The navigation comment explicitly says the custom scrolling logic bypasses the OS-level `prefers-reduced-motion` setting, and the site contains multiple always-on motion effects with no reduced-motion fallback.

Why this matters:
Users who rely on reduced-motion settings to avoid vestibular triggers still get animated scrolling, floating backgrounds, pulsing effects, reveal animations, and chat panel entrance animation. This is an accessibility defect, not just a preference mismatch.

Remedial action needed:
Honor `matchMedia('(prefers-reduced-motion: reduce)')` before running custom scroll animation. Add a reduced-motion stylesheet path that disables or significantly tones down non-essential animations and transitions.

### 4. Medium: the mobile layout removes navigation entirely

Files:
`site/src/styles/components.css:895`
`site/src/styles/components.css:900`
`site/src/styles/components.css:902`

At widths under `768px`, `.nav-links` is set to `display: none`, but there is no replacement menu, drawer, or condensed link treatment.

Why this matters:
Mobile users lose direct access to the section links and the "Hire Me" CTA. On a single-page site that depends on in-page navigation, this hurts discoverability and makes key sections harder to reach.

Remedial action needed:
Add a mobile navigation pattern instead of removing navigation entirely. A simple menu button plus section list would be enough, as long as the same destinations remain reachable on small screens.

### 5. Medium: the chat widget is not implemented as an accessible dialog

Files:
`site/src/components/DigitalTwin.jsx:189`
`site/src/components/DigitalTwin.jsx:198`
`site/src/components/DigitalTwin.jsx:212`
`site/src/components/DigitalTwin.jsx:225`
`site/src/components/DigitalTwin.jsx:260`
`site/src/components/DigitalTwin.jsx:284`
`site/src/components/DigitalTwin.jsx:287`

The panel uses `role="dialog"`, but it does not manage focus when opened, does not close on `Escape`, does not expose `aria-modal`, and the toggle button does not advertise expanded/collapsed state.

Why this matters:
Keyboard and assistive-technology users do not get expected dialog behavior. Focus can remain behind the panel, tab order is unconstrained, and there is no standard keyboard dismissal path.

Remedial action needed:
Move focus into the dialog when it opens, return focus to the trigger when it closes, support `Escape` to dismiss, add `aria-modal="true"` when appropriate, and connect the trigger to the panel with `aria-expanded` and `aria-controls`.

### 6. Medium: there are no automated quality gates beyond a production build

Files:
`site/package.json:5`
`site/package.json:8`

The project exposes `dev`, `build`, and `preview` scripts only. There are no lint, test, accessibility, or type-check steps.

Why this matters:
Regressions like the secret exposure, mobile navigation removal, and accessibility issues can slip through because there is no automated safety net. The current workflow validates bundling, but not correctness.

Remedial action needed:
Add at least one lint step and one lightweight automated test layer. For this app, a practical starting point would be ESLint plus a small browser smoke test suite covering navigation, mobile behavior, and the chat widget’s failure states.

### 7. Low: current toolchain has a known moderate Vite/esbuild advisory in development

Files:
`site/package.json:14`

`npm audit` reports a moderate advisory affecting `vite` through `esbuild` in the dev server path.

Why this matters:
This does not appear to be a production bundle issue, but it is still relevant for local development and preview workflows, especially if the dev server is exposed beyond localhost.

Remedial action needed:
Plan a Vite upgrade path and avoid exposing the dev server to untrusted networks in the meantime. Re-run `npm audit` after upgrading to confirm the advisory is cleared.

## Recommended Remediation Order

1. Remove the client-side OpenRouter key flow, rotate the exposed key, and verify the rebuilt bundle is secret-free.
2. Fix the hard-coded localhost request metadata for the chat integration.
3. Add reduced-motion support and accessible dialog behavior for the chat widget.
4. Restore mobile navigation with an actual small-screen menu pattern.
5. Add lint/tests and schedule a Vite upgrade.

## Verification Notes

Commands run:
`npm run build` -> passed
`npm audit --json` -> reported 2 moderate vulnerabilities (`vite` / `esbuild`, dev-server related)

Build inspection:
The generated bundle currently contains the OpenRouter bearer token in plain text, confirming the secret-exposure finding above.

## Assumptions

- This review treats the site as intended for public deployment, not just local/demo use.
- I did not review any backend or hosting infrastructure because none is present in the `site` folder.
- I did not change application code; this document is review-only, as requested.
