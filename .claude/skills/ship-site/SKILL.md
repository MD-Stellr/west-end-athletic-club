---
name: ship-site
description: Validate and deploy a change to the West End website. Runs the pre-flight checks (JSON-LD parses, no em dashes in copy, no raw hex, tracking/CSP intact, screenshot QA), then commits with the house message format and pushes to main (which auto-deploys to westendac.com). Use after any edit to the site's HTML/CSS/JS before it goes live.
---

# ship-site

The deploy ritual for westendac.com. Pushing to `main` deploys to production in about 60 seconds with no staging, so the checks below are the safety net. Run them on every change before you push.

## When to use
After editing any live page, `css/styles.css`, `js/main.js`, `vercel.json`, `sitemap.xml`, `robots.txt`, or `llms.txt`, and the user wants it live (they said "push it" or the change is clearly meant to ship). If they have NOT asked to publish, stop after the checks and show the diff instead.

## Pre-flight checks (all must pass)
Run this from the repo root and read the output. Any failure = fix before pushing.
```bash
cd "/Users/twerp/West End"
# 1. JSON-LD on every touched page must parse (one broken block kills all schema on the page)
python3 -c "
import re,json,sys,glob
bad=0
for f in sys.argv[1:] or [x for x in glob.glob('*.html') if x not in ('home.html','facility.html')]:
    for i,b in enumerate(re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',open(f,encoding='utf-8').read(),re.S)):
        try: json.loads(b)
        except Exception as e: bad+=1; print('JSON-LD FAIL',f,i,e)
print('JSON-LD:', 'OK' if not bad else 'BROKEN')
" <touched-files>
# 2. No em dashes in copy you added (only allowed inside labeled meta-tag quotes)
grep -n "—" <touched-files> || echo "no em dashes"
# 3. No raw hex added (colors must be tokens); review any hits
git diff -U0 | grep -E '^\+' | grep -iE '#[0-9a-f]{3,6}' || echo "no new hex"
# 4. vercel.json still valid if touched
[ -f vercel.json ] && python3 -c "import json;json.load(open('vercel.json'));print('vercel.json OK')"
# 5. aggregateRating still matches live GBP (currently 4.9 / 117) if you touched schema
grep -rho '"reviewCount": "[0-9]*"' *.html | sort -u
```
Then, for any layout/visual change, screenshot with `?screenshot` and look at it:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --window-size=1440,8000 --force-device-scale-factor=1 --virtual-time-budget=6000 \
  --screenshot="<scratchpad>/qa.png" "file:///Users/twerp/West End/<page>.html?screenshot"
# Read qa.png and confirm the layout is intact (heroes capped, nothing broken)
```

## Special cases before pushing
- **Touched CSP, tracking, forms, or the GHL webhook?** Verify the conversion path still fires (GA4 Realtime shows the event, or DevTools Network shows the `collect`/webhook request). Do not push a change that could silently kill lead tracking without confirming it still works.
- **Added a new page?** It must be in `sitemap.xml`, in `llms.txt`, and linked from the footer, before you ship.
- **Added any external resource** (script, font, iframe, pixel)? It must be in the `vercel.json` CSP allowlist or it will be blocked in production.

## Commit + push
```bash
cd "/Users/twerp/West End" && git add -A && git commit -q -m "$(cat <<'EOF'
<imperative summary line>

<why this change, 1-3 lines>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)" && git push -q origin main && echo PUSHED
```
- The `remote: This repository moved …` notice is expected (StellrTest → MD-Stellr). The push still lands; `PUSHED` printing means success.
- Never `git add -A` if `brand.md` or any internal Stellr file is untracked in the working tree; it is a public repo. Add only the site files, or gitignore the internal ones first.

## Done means
Checks passed, visual QA done, committed with the Co-Authored-By line, `PUSHED` printed, and you told the user it is live (Vercel redeploys within ~60s).
