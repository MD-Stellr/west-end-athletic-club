---
name: de-slop
description: Strip AI tells and em dashes from copy and enforce the West End / Stellr brand voice. Run on any page copy, blog post, ad, email, or PDF prose before it ships or gets sent. Catches the writing patterns the client recognizes as AI-written and rejects.
---

# de-slop

The client can spot AI-written copy and will reject it. This skill removes the tells and makes copy read like a person who knows the gym wrote it. Run it on every piece of prose before it ships.

## When to use
Any time you wrote or edited copy: a page, a blog post, an ad, an email, PDF prose, a testimonial. Also run it as the final pass on any `stellr-pdf` document.

## Step 1: kill em dashes (hard rule)
```bash
grep -n "—" <file>   # must return nothing (U+2014). En dashes in ranges 4–16 are fine.
```
Replace each em dash with the punctuation the sentence actually needs:
- Two dashes wrapping an aside → parentheses: `growth — and where it comes from — is` becomes `growth (and where it comes from) is`.
- A dash before a summary/list → colon: `the stack — GA4, Ads, Pixel` becomes `the stack: GA4, Ads, Pixel`.
- A dash joining two clauses → period or comma: `team — we recommend` becomes `team. We recommend`.
Never leave a bare em dash "fixed" by swapping it for an en dash; that still looks off.

## Step 2: remove the AI-tell phrases
Search-and-destroy these. They are the ones that get copy flagged:
- Openers: "In today's fast-paced world", "In the world of", "Look no further", "Whether you're a … or a …", "When it comes to", "Let's dive in", "Picture this".
- Verbs/adjectives: "elevate", "unleash", "unlock", "supercharge", "seamless", "cutting-edge", "boasts", "nestled", "robust", "leverage", "delve", "tapestry".
- Closers: "In conclusion", "At the end of the day", "The bottom line is", "Rest assured".
- Structure tells: mechanical rule-of-three everywhere ("stronger, faster, better"), every paragraph the same length, a bulleted list where a sentence would do, hedging ("can help to", "may be able to").
```bash
grep -niE "in today'?s|look no further|whether you'?re|dive in|elevate|unleash|unlock|seamless|cutting-edge|boasts|nestled|leverage|in conclusion|rest assured|at the end of the day" <file>
```

## Step 3: make it specific and on-voice
Generic copy is slop even without the tell words. Replace vague claims with the real thing:
- Name real coaches and real credentials (Ray Olubowale, 3x Canadian Heavyweight Champion; Justin Parina, Team Canada 2018-2024; Steve Rolls, faced Gennady Golovkin June 2019; the Boxing Band System; Little Warriors ages 4-8; Youth Academy 8-16).
- Use the real address (283 Bering Ave, Etobicoke), the real offer (3 days free), real class names (The Boxing Blueprint, Tech-Fit, Build & Burn, Box & Burn).
- One concrete detail beats three abstract adjectives.

## West End brand voice (the target)
- Confident, serious, professional. This is a real boxing gym with champion coaches, not a fitness franchise.
- Warm and welcoming to beginners at the same time: never intimidating, "no experience required, no sparring unless you want it."
- Family. When you are a member, you are part of West End.
- Positioning: the leading serious boxing and boxing-fitness gym in Ontario that still makes newcomers feel at home.
- Short declarative sentences. Cut adjectives, keep verbs. Say the true, specific thing.

## Done means
Zero em dashes, zero tell phrases, every claim is concrete and specific to West End, and it reads in the voice above. If it still sounds like it could be any gym, it is not done.
