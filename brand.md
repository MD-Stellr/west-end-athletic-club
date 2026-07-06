# STELLR® — Brand & Design System

> The complete branding reference for Stellr Media's website and all future
> assets (decks, social templates, ads, print, merch). Hand this file to any
> designer or AI design tool and they should be able to produce on-brand work
> without seeing the website first.

---

## 1. Brand core

| | |
|---|---|
| **Brand name** | STELLR® (all-caps wordmark; "Stellr Media" in legal/long-form copy) |
| **Positioning** | Toronto's digital marketing experts |
| **One-liner** | We build brands, systems and campaigns that shine brighter and scale harder. |
| **Promise** | Performance isn't a buzzword. It's the baseline. |
| **Signature taglines** | "Stop guessing. Start scaling." · "Shine brighter. Scale harder." · "Built to perform." · "Real results, not vanity metrics." |
| **Personality** | Confident, sharp, a little cheeky. Operators, not account managers. Editorial polish with performance-marketing teeth. |
| **Motif** | The four-point star / sparkle (✺ in type, a custom 4-point star glyph in icons). Celestial naming ("Stellr") expressed through *glow*, not space clichés — no rockets, planets, or starfields. |

### Voice & tone
- Short declarative sentences. Cut the adjectives, keep the verbs.
- Contrast structures: "Stop guessing. Start scaling." / "We don't dabble. We dominate." / "Real results, not vanity metrics."
- Plain-spoken about money and outcomes: revenue, ROAS, booked treatments, listing appointments. Never "synergy," never "solutions."
- Self-aware wit in microcopy: "( 06 — The part where you email us )", "0 templated strategies."
- Em dashes and parenthetical mono labels `( 01 — Like this )` are house style.

---

## 2. Color palette

Dark-first ("ink") with pure white sections and a single electric accent ("azure"). Never introduce a second accent hue.

### Core colors

| Token | Hex | Role |
|---|---|---|
| **Ink** | `#0E0D0A` | Primary background. Near-black with warm undertone. |
| **Ink Soft** | `#181612` | Raised surfaces on ink (cards, alternating bands). |
| **Ink Line** | `#2A2722` | Borders/dividers on ink backgrounds. |
| **White** | `#FFFFFF` | Light sections, text on ink. Hard pure white. (CSS token `--bone`) |
| **White Soft** | `#F5F5F5` | Subtle fills on white. (CSS token `--bone-soft`) |
| **White Line** | `#E6E6E6` | Borders/dividers on white backgrounds. (CSS token `--bone-line`) |
| **Azure** | `#00A8E8` | THE accent. CTAs, italic emphasis words, hover states, key stats. |
| **Azure Deep** | `#0089C2` | Azure hover/pressed, gradient partner. |

### Supporting colors

| Token | Hex | Role |
|---|---|---|
| Grey (on white) | `#595959` | Secondary text on white (AA-checked, ≥4.5:1). |
| Grey Ink (on ink) | `#A9A9A9` | Secondary neutral text on ink. |
| Deep Sea | `#062A42` | Dark text on azure surfaces (eyebrows, sub-copy on CTA band). |
| Sky | `#A3DDF7` | Gradient highlight only — never as flat UI color. |
| Burnt | `#07395C` / `#051F2E` / `#052636` | Gradient shadow tones. |

### Usage rules
- Page rhythm alternates: ink → white → ink → azure (one azure band per page, the contact CTA).
- White sections get `border-radius: 2.5rem 2.5rem 0 0` — light sections "sheet" over dark ones.
- Text on azure is **Ink** (headlines) or **Ember** (support); white text on azure only for italic emphasis words.
- Selection color: azure background, ink text.
- Contrast minimums: 4.5:1 body text, 3:1 large display text — already validated for the pairs above.

### Gradient art (stand-in for photography)
Abstract radial glows, always built from the palette. Recipes used on the site:
```
Hot panel:    radial(#A3DDF7 → transparent) + radial(#0C6FA6 → transparent) over linear(165deg, #00A8E8 → #07395C)
Ember panel:  radial(#00A8E8 at top-right → transparent) over linear(195deg, #2A2722 → #0E0D0A)
Paper panel:  radial(#EAEAEA → transparent) over linear(150deg, #FFFFFF → #8E8E8E)
Coal panel:   radial(#0089C2 → transparent) + radial(#4A4438 → transparent) over linear(180deg, #181612 → #062A42)
```
A film-grain noise overlay sits over every page at ~5% opacity (tiled noise PNG, subtly jittered).

---

## 3. Typography

Three-font system, loaded from Google Fonts:

| Font | Role | Weights |
|---|---|---|
| **Host Grotesk** (grotesque sans, variable) | Display, headlines AND body — the brand's single main typeface. Italics in azure for emphasis words. | 300–800 + italics |
| **JetBrains Mono** (mono) | Eyebrows, tags, nav links, buttons, stats labels, all "system" text. Always uppercase with generous letter-spacing. | 400, 500 |

```css
font-family: 'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif; /* display + body */
font-family: "JetBrains Mono", monospace;                                /* labels */
```
Google Fonts URL:
`https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500&display=swap`

### Type scale & rules
| Style | Spec |
|---|---|
| Hero headline | Host Grotesk 500, `clamp(2.35rem, 9.2vw, 8.5rem)`, line-height 1.02, letter-spacing −0.025em |
| Page/section H2 | Host Grotesk 500, `clamp(2.2rem, 5.5vw, 4.5rem)`, line-height 1.05, letter-spacing −0.02em |
| Card/sub H3 | Host Grotesk 500, `clamp(1.7rem, 3vw, 2.6rem)` |
| Manifesto/pull quote | Host Grotesk 400, `clamp(1.5rem, 3.4vw, 3rem)`, line-height 1.35 |
| Body | Inter 300, 1rem–1.05rem, line-height 1.6–1.75, max 58ch |
| Eyebrow / label | JetBrains Mono, 0.7–0.8rem, uppercase, letter-spacing 0.15–0.25em |
| Button label | JetBrains Mono 500, 0.7–0.8rem, uppercase, letter-spacing 0.08em |

**Signature move:** one word per headline set in Host Grotesk *italic* + azure:
"that *shine* brighter", "Start *scaling*.", "We *dominate*."

Mono section labels in parentheses with en-rule: `( 01 — The promise )`.

Numbers/stats: Host Grotesk 500 with `font-variant-numeric: tabular-nums`; units (%, M+, yrs) at 40% size in azure.

---

## 4. Logo / wordmark

- **Wordmark:** "STELLR" set in Host Grotesk 600, letter-spacing −0.01em, with a superscript **®** at ~50–55% size in azure. No icon-only logo exists yet; the wordmark IS the logo.
- **Footer ghost:** giant wordmark (≈19vw) in `#181612` on ink — tone-on-tone, cropped at the baseline (translateY 12%).
- **Favicon / avatar:** azure circle, white "S".
- **Rotating badge device:** circular mono text "SHINE BRIGHTER · SCALE HARDER ·" spinning 16s/turn around a azure 4-point star.
- Clear space: ≥ the height of the R on all sides. Never stretch, recolor outside the palette, or set on busy imagery.

---

## 5. Motion system

| Token | Value |
|---|---|
| Signature ease | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out "luxe") |
| Soft ease | `cubic-bezier(0.45, 0, 0.15, 1)` (curtains, menus) |
| Micro-interactions | 150–350ms |
| Reveals/transitions | 550–900ms |
| Hover color shifts | 300ms |

**Signature behaviors** (reuse on any new asset/web work):
1. **Masked line reveal** — headlines slide up out of an `overflow:hidden` line box, 90ms stagger per line. *Always pad the mask ~0.16em for descenders.*
2. **Scroll reveals** — fade + 2.2rem rise, IntersectionObserver, 60–120ms stagger within groups.
3. **Magnetic buttons** — element follows cursor ±35% of offset, springs back on leave.
4. **Sweep-fill buttons** — second background slides up inside pill on hover.
5. **Ink flood rows** — list rows flood ink-black from the top on hover; titles flip italic and slide 0.5–0.75rem; arrows rotate 45° into azure circles.
6. **Floating preview card** — gradient art card trails the cursor over service lists.
7. **Custom cursor** — 6px azure dot + trailing 40px ring; ring grows/fills with "View/Case" label over links (desktop only).
8. **Marquees** — infinite loops, 28–38s; pause on hover. Client names alternate serif/mono/sans styling between ✺ separators.
9. **Count-up stats** — ease-out quart, ~1.6s, triggered at 40% visibility.
10. **Word-ignite manifesto** — paragraph words go ink-line → white as you scroll; key words ignite azure.
11. **Loader** (homepage only) — letters of STELLR rise with 70ms stagger + tagline, curtain lifts at ~1.1s.

**Always** respect `prefers-reduced-motion`: kill loader, marquee, parallax, cursor; show all content immediately.

---

## 6. Components & layout

- **Max width:** 90rem. Gutter: `clamp(1.25rem, 4vw, 4rem)`. Breakpoints: 1024 (nav collapses), 768 (single-column), 480.
- **Buttons:** pill (100px radius), mono uppercase labels. Variants: azure-fill (primary, hover sweeps to white), white-fill (nav), ghost with ink-line border (hover sweeps azure), ink-fill on azure band.
- **Cards:** 1.25–1.5rem radius, 1px line borders, hover = lift −6px + azure border + gradient flood.
- **Pills/tags:** mono 0.68rem uppercase; outcome tags in azure outline, filling solid on hover ("ROAS ↑", "Memberships ↑").
- **Section headers:** `( NN — Label )` mono left + 1px rule that scales in from the left.
- **Nav:** fixed, transparent → ink glass blur after 40px scroll, hides on scroll-down/returns on scroll-up. Link hover = roll-up text swap to azure. Live local clock "TOR — 16:46".
- **Footer:** 4 columns (brand / sitemap / socials / studio + live timezone clocks), then the ghost wordmark.
- **Icons:** Lucide-style 1.8px stroke line icons; diagonal arrow (↗) in circles for links; ✺ as decorative separator. Never emoji.

---

## 7. Content & facts (for copy accuracy)

- **Services (7):** Media Buys · Web Design & Dev · SEO · Content Creation · Social Media · AI Automation · Email Marketing
- **Industries (4):** Real Estate · Fitness & Wellness · Med Spas · Ecommerce
- **Proof points:** $14M+ client revenue generated · clients across North America · case studies: Ace Performance Gym, Club Sudo, Club Well
- **Clients:** Tone Pilates, Maison Movement, Inklein Fitness, Pure Athletic Club, Vortex Wellness, Soma Pilates, Club Sudo, Ace Performance Gym, Club Well, Function Studios
- **Contact:** info@stellrmedia.com · 289-809-2318 · Toronto, ON · @stellrmedia (IG) · /company/stellr-media (LI) · stellrmedia.ca (FB)

---

## 8. Do / Don't

**Do**
- Keep one azure moment per composition — scarcity is what makes it hit.
- Use italic serif + azure for exactly one emphasized word per headline.
- Use mono parenthetical labels to structure everything (decks, posts, one-pagers).
- Use gradient-glow art panels + grain instead of stock photography.
- Leave generous negative space; let Host Grotesk do the talking.

**Don't**
- No pure black (`#000`) — dark surfaces are always Ink `#0E0D0A`. Light surfaces are hard white `#FFFFFF`.
- No second accent color, no gradients outside the palette family.
- No emoji as icons. No drop shadows except the 30px/60px soft card shadow.
- No space clichés (rockets, planets) — the "stellar" idea lives in glow and the ✺ star only.
- Never substitute another display face; mono is for labels only, never paragraphs.
