# CLAUDE.md

Operating manual for working in this repo. Read it fully before you touch anything. It assumes you are less capable than the person who wrote it, so it is explicit on purpose. Follow the rules literally; when a rule and your instinct disagree, the rule wins.

## What this is

Marketing site for **West End Athletic Club** (WEAC), a Toronto/Etobicoke boxing gym. Built and run by **Stellr Media** (agency; the human you work for is Michael/Anthony, git user `StellrTest`, michael@stellrmedia.com).

- Static **HTML / CSS / JS**. No framework, no build step, no bundler, no package.json, no test runner.
- **Live and revenue-generating.** Paid Google + Meta ads drive traffic to these pages. A broken form or a blocked tracking pixel costs the client real money. Treat every change as production.
- **Deploys on push:** GitHub (`MD-Stellr/west-end-athletic-club`) → Vercel auto-deploys `main` to https://www.westendac.com. There is no staging. `git push origin main` = live in about 60 seconds.

## Pages (all live)

`index.html` (home) · `about.html` · `classes.html` · `schedule.html` (page-specific `<style>` inline at top) · `memberships.html` · `promo.html` (`/3 Days Free` VSL + lead form) · `privacy.html` (PIPEDA/CASL) · `boxing-gym-etobicoke.html` · `youth-boxing-toronto.html` · `womens-boxing-toronto.html` (three local SEO landing pages, each with an on-page lead form).

`home.html` and `facility.html` are **legacy WordPress/Divi exports**. They are `noindex` and 308-redirect to `/` and `/about` via `vercel.json`. Do not edit them, do not link to them, do not copy their markup (it carries stale Yoast schema and non-www canonicals).

Infra files: `vercel.json`, `sitemap.xml`, `robots.txt`, `llms.txt`, `css/styles.css` (~3,700 lines), `js/main.js` (~730 lines, single IIFE), and an IndexNow key file (`a7f3e9…​.txt` — do not delete or rename).

## Stack

- Vanilla HTML/CSS/JS. GSAP 3.12.5 + ScrollTrigger, Lenis smooth scroll (all `defer`, from CDN).
- Google Fonts: Big Shoulders Display (display), Playfair Display (editorial pull-quotes only), Inter (body), JetBrains Mono (mono labels), Anton.
- Tracking, all site-wide via one shared `gtag.js` load: **GA4** `G-B79P6TPSPG`, **Google Ads** `AW-18294865526`, **Meta Pixel** `2077569749638468`, **Vercel Analytics**. Lead forms POST to a **GoHighLevel** webhook and fire `reportGA4Lead()`, `reportAdsConversion()`, and `fbq('track','Lead')` on success (see `js/main.js`).

---

## Conventions I follow (and the ones you must add)

**Design tokens, never raw hex.** All color lives in CSS custom properties in `:root`: `--ink` (near-black bg) · `--carbon` (panel) · `--smoke` · `--bone` (light text) · `--ash`/`--fog` (muted) · `--fight` (`#E63946` brand red) · `--blood` (hover red) · `--hairline`/`--hairline-strong`. If you need a color that does not exist, add a token; do not inline a hex.

**BEM naming.** `.block__element--modifier`. Match the surrounding component when you add markup.

**Headline accent `<em>`.** Inside headings, `<em>` is globally overridden to render in the display font, red (`--fight`), NOT italic Playfair. The override lives near the end of `styles.css` under "HEADLINE ACCENT WORDS". When you create a new headline class, add it to that selector list. Never put inline `style="font-family:'Playfair Display'…"` on a heading `<em>`.

**Playfair italic is editorial only** — `.pull-quote`, `.hero__caption`, `.footer__brand`. That is intentional voice, not a headline accent. Do not spread it elsewhere.

**Fluid type:** `clamp(min, vw, max)` everywhere. When tightening for mobile, lower the `max`; the vw middle and min usually still hold.

**Mobile breakpoints** (bottom of `styles.css`): `640px` main mobile block, `480px` hides the nav CTA pill, `380px` small-phone safety net.

**Copy has no em dashes.** This is a hard house rule, not a preference. Em dashes (`—`, U+2014) read as AI-written and the client will call it out. Use commas, colons, periods, or parentheses. Applies to page copy, blog copy, and every PDF. En dashes in numeric ranges (`4–16`, `6–9p`) are fine. Exception: verbatim quotes of already-published title tags inside a report may keep their dashes; label them as quotes.

**Commit style.** Push straight to `main` (deploy-on-push is the intended workflow here, unlike a normal repo). Write a real multi-line message explaining *why*. End every commit body with exactly:
```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
The push prints a "repository moved" notice from GitHub (StellrTest → MD-Stellr). That is expected; the push still succeeds.

**Never commit internal Stellr files** (`brand.md`, notes, client emails) to this repo. It is public via Vercel; `git add -A` would publish `brand.md` to `westendac.com/brand.md`. Keep those out or gitignored.

**Deliverables are branded PDFs** rendered from HTML via headless Chrome. Brand: Ink `#0E0D0A` backgrounds, Azure `#00A8E8` single accent, Host Grotesk + JetBrains Mono, `STELLR®` typographic wordmark, mono `( 01 — Section )` headers. Save to `~/Downloads`. See the `stellr-pdf` skill.

---

## The mistakes a weaker model makes here, named, with the rule that prevents each

1. **Hardcodes a hex color.** → Use a token. If none fits, add one to `:root`. Grep `styles.css` for the closest existing token first.
2. **Puts an em dash in copy.** → Run the em-dash check (`grep -c "—"`) on any file you wrote copy into; it must be 0 (or only inside labeled meta-tag quotes). See the `de-slop` skill.
3. **Adds a third-party script, iframe, font, or pixel and it silently dies.** → `vercel.json` ships a strict Content-Security-Policy. Anything new (chat widget, new pixel, embed, font host) must be added to the matching CSP directive or the browser blocks it with no visible error. After any tracking/CSP change, verify conversions still fire (GA4 Realtime or DevTools → Network → filter `collect`). Currently allowlisted: GTM/gtag, Google Ads + DoubleClick, GA4 (+region1), Meta Pixel, GSAP (cdnjs), Lenis (jsdelivr), GHL webhook, Vercel, Google Fonts, Google Maps embed.
4. **Overstates the review count in schema.** → `aggregateRating` (`ratingValue`/`reviewCount`) is hardcoded in JSON-LD on every page and MUST match the live Google Business Profile (currently **4.9 / 117**). A stale or inflated count risks Google suppressing the rich result. If unsure of the live number, ask; do not guess up.
5. **Reuses card/section copy verbatim across the local landing pages.** → The three local pages must stay above 60% unique vs `/classes`. If you lift a program card, rewrite it with page-specific, local, or credential-specific language.
6. **Breaks `?screenshot` mode.** → Appending `?screenshot` adds `screenshot-mode` to `<html>`, skips the loader and animations, and caps `.hero`/`.page-hero`/`.promo-hero` heights so a tall headless capture shows the full layout. Audits depend on it. Do not remove those caps when restyling heroes.
7. **Claims something is done without verifying.** → Never report status you have not checked. "GA4 is installed" means you confirmed the tag on the live page AND saw the event in Realtime, not that you pasted a snippet. Fabricated status is the worst failure mode here.
8. **Invents numbers.** → Search volumes, rankings, and competitor data are not yours to make up. Label estimates as estimates, or pull them from Google Keyword Planner / Search Console. Same for the live GBP review count.
9. **Edits `home.html`/`facility.html`.** → Don't. They are redirected legacy files. Work only in the 10 live pages.
10. **Puts a self-rating (a score/grade of our own work) in a client-facing PDF.** → Client deliverables state what was done and what is planned. They do not grade our own performance. Internal audits can score; client docs cannot.
11. **Ships JSON-LD that does not parse.** → After any edit inside a `<script type="application/ld+json">` block, validate every block on that page (`json.loads` each). One broken block kills all structured data on the page.
12. **Uses stock or generic imagery.** → The client requires authentic photos/video of their coaches, members, facility. Do not add stock or AI-generic imagery to the site or a client asset without explicit approval.
13. **Assumes GA4 DebugView being empty means tracking is broken.** → It usually means an ad blocker or that `debug_mode` did not engage. Confirm via Realtime, which shows all traffic.
14. **Skips visual QA.** → After a layout or PDF change, render it (headless Chrome screenshot for pages via `?screenshot`; the PDF itself for documents) and actually look at it before declaring done.

---

## Quality bar per deliverable (checkable, not adjectives)

**A website code change is done only when ALL are true:**
- [ ] No raw hex added; colors use tokens.
- [ ] No em dash in any copy you added (`grep -c "—"` on the file = 0, or only labeled quotes).
- [ ] Every JSON-LD block on the page still `json.loads` cleanly.
- [ ] If you touched tracking, forms, CSP, or added any external resource: the relevant conversion still fires (checked), and the resource is CSP-allowlisted.
- [ ] `?screenshot` still renders the full page (hero caps intact).
- [ ] Any headline `<em>` you added is covered by the accent override (no inline Playfair).
- [ ] Committed with a why-focused message ending in the Co-Authored-By line, and pushed to `main`.
- [ ] For local landing pages: content is above 60% unique vs `/classes`.

**A client-facing PDF is done only when ALL are true:**
- [ ] Stellr brand: Ink/Azure palette, Host Grotesk + JetBrains Mono, `STELLR®` wordmark, mono section labels.
- [ ] Zero em dashes in prose (only inside explicitly-labeled quotes of live tags).
- [ ] No self-rating/score of our own work.
- [ ] No fabricated numbers; estimates are labeled "estimate"; verified facts are verified.
- [ ] No "unfinished work" framing (no open to-do lists presented as our gaps unless the client asked for a status).
- [ ] Rendered to PDF AND visually inspected (screenshot at least the cover + one content page).
- [ ] Saved to `~/Downloads` with a clear filename.
- [ ] Links: only clickable if asked; otherwise state the destination in text.

**An SEO/schema change is done only when:**
- [ ] `aggregateRating` matches the live GBP count.
- [ ] All JSON-LD validates.
- [ ] New pages are added to `sitemap.xml` and `llms.txt` and linked from the footer.

**Copy (page, blog, ad) is done only when:**
- [ ] Zero em dashes.
- [ ] No AI tells (see `de-slop` skill: "whether you're…", "look no further", "in today's world", "elevate", "unleash", "dive in", "nestled", "boasts", "in conclusion", robotic rule-of-three).
- [ ] Concrete and specific to WEAC (real coach names/credentials, real programs, the address, the offer), not generic.
- [ ] Brand voice: confident, serious, professional, warm to beginners, family. Positioning: Ontario's leading serious boxing gym that still welcomes newcomers.

---

## What to do when uncertain — exact escalation rules

1. **A fact you cannot verify from the repo, the live site, or a tool** (search volume, current ranking, live GBP review count, ad performance): do NOT invent it. Either label it clearly as an estimate/assumption, or ask the user for the number. Inventing a number is the worst error you can make here.
2. **Anything that publishes or goes to the client.** If the user said "push it" / "make the PDF," do it. If the user has NOT asked to publish or send, produce the change and stop. Do not push to `main` or send anything externally on your own initiative.
3. **A change to CSP, tracking, forms, or the GHL webhook:** make the change, then verify the conversion path still works (GA4 Realtime shows the event, or DevTools Network shows the `collect`/webhook request). Report "verified" only after you saw it.
4. **An ambiguous edit instruction** (which of several matching strings, which section, "the location bit"): apply the most reasonable single interpretation, make the change, then in your reply state exactly what you changed and flag the assumption so the user can correct in one message. Do not stall asking when a sensible default exists; do ask when the choices are materially different or irreversible.
5. **Deleting or overwriting a file you did not create** (client-supplied images, `brand.md`, an existing page): look at it first. If it contradicts how it was described, or it is an internal/client asset, surface that instead of proceeding.
6. **Repo/deploy anomalies** (the "repository moved" notice, a failed push): the moved notice is normal and the push still lands. A real push failure: report it with the output; do not silently retry a different way.
7. **When two rules here conflict, or a rule seems wrong for the situation:** follow the rule and say why you think it may not fit, rather than quietly overriding it.

---

## Workflow reference

- **Local preview:** `open "file:///Users/twerp/West End/<page>.html"`. No dev server.
- **Headless audit / screenshot:** use `?screenshot` so the loader and animations are skipped and heroes are height-capped. The loader animation will NOT complete under headless virtual-time, so a normal (non-screenshot) capture shows a frozen loader. That is a rendering quirk, not a bug. Always audit with `?screenshot`.
- **Scratch/temp files** (report HTML, generated PDFs before they land in Downloads): use the session scratchpad, not `/tmp` or the repo.
- **The GHL webhook, tracking IDs, and CSP allowlist are load-bearing.** If you change one, re-read the "mistakes" list above.
