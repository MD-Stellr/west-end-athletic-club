# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for West End Athletic Club (Toronto boxing gym). Static HTML / CSS / JS — no build step, no package.json, no test suite, no git. Open `.html` files directly in the browser (file://) to preview.

## Pages (all live, all in play)

- `index.html` — magazine-cover home (hero + marquee + stats + 4 nav cards + CTA strip)
- `about.html` — The Club: mission, story, facility, coaches
- `classes.html` — 6 disciplines + first-time primer + youth + 12-week challenge
- `schedule.html` — weekly class grid (page-specific `<style>` block inline at top)
- `memberships.html` — 4 tiers + comparison table (`.compare` block, semantic classes) + add-ons + FAQ
- `promo.html` — `/3 Days Free` lead-capture landing (above-fold split: offer + form)
- `home.html`, `facility.html` — full-length variants still in rotation; keep in sync with shared CSS / nav copy

## Stack

- Vanilla HTML + CSS + JS. No framework, no bundler.
- GSAP 3.12.5 + ScrollTrigger via cdnjs (defer scripts at end of `<body>`)
- Lenis 1.0.42 smooth scroll via jsdelivr
- Google Fonts: Big Shoulders Display (display), Playfair Display (editorial — pull-quotes only), Inter (body), JetBrains Mono (mono labels)
- Single CSS file: `css/styles.css` (~3200 lines)
- Single JS file: `js/main.js` (~350 lines, IIFE)

## Design tokens (CSS custom properties in `:root`)

`--ink` (near-black bg) · `--carbon` (panel bg) · `--smoke` · `--bone` (light text) · `--ash`, `--fog` (muted text) · `--fight` (#E63946 brand red) · `--blood` (darker red hover) · `--hairline`, `--hairline-strong` (borders). Don't hardcode hex — use the tokens.

## Conventions

- **BEM** naming: `.block__element--modifier`. Match this when adding components.
- **Headline accent `<em>`**: globally overridden to use the display font in red (`--fight`), NOT italic Playfair. The override block lives near the end of `styles.css` under "HEADLINE ACCENT WORDS". Add new headline classes to that selector list when you create them. Never reintroduce inline `style="font-family:'Playfair Display'..."` on headline `em` tags.
- **Pull quotes & captions** still use Playfair italic intentionally (`.pull-quote`, `.hero__caption`, `.footer__brand`) — that's editorial voice, not a headline accent.
- **Mobile breakpoint**: `@media (max-width: 640px)` is the main mobile block; `(max-width: 480px)` hides the nav CTA pill (burger covers it); `(max-width: 380px)` is the small-phone safety net. All at the bottom of `styles.css`.
- **Fluid type**: `clamp(min, vw, max)` everywhere. When tightening for mobile, lower the max — the vw middle and min usually still work.

## Workflow

- **Local preview**: `open file:///Users/twerp/West\ End/index.html` (or any other page). No dev server.
- **Mobile/desktop audit via headless Chrome**:
  ```
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
  "$CHROME" --headless=new --hide-scrollbars --window-size=375,7000 \
    --force-device-scale-factor=1 --user-agent="$UA" --virtual-time-budget=5000 \
    --screenshot=/tmp/wec-X.png "file:///Users/twerp/West End/<page>.html?screenshot"
  ```
  Then slice tall PNGs into 1400-px bands with PIL for review (Image API rejects >2000px in either dimension).
- **`?screenshot` URL param**: triggers `document.documentElement.classList.add('screenshot-mode')` and skips loader + all animations. Use it for any audit. The screenshot-mode CSS at the bottom of `styles.css` caps hero / page-hero heights so a tall canvas captures the full layout in one shot.
- **GHL form (promo.html)**: still a placeholder. The `<form>` block has a comment with wiring instructions and the hidden `source="3 Days Free Promo"` + `page="promo.html"` routing fields. Leave the comment + placeholder alone until the user wires it.

## Don't

- Don't add a build step, package.json, or framework without being asked.
- Don't run `git` commands — repo isn't initialized.
- Don't introduce new color hex values — extend the token palette instead.
- Don't break the `?screenshot` mode caps when restyling `.hero` / `.page-hero` / `.promo-hero`.
