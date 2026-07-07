---
name: stellr-pdf
description: Generate a Stellr-branded, client-ready PDF (SEO report, blog copy, partnership response, proposal, any client doc) from content. Renders HTML to PDF via headless Chrome, enforces the brand system and the no-em-dash rule, and saves to ~/Downloads. Use whenever the user asks for a PDF, report, deck, or "something to send the client."
---

# stellr-pdf

Turn content into a polished Stellr-branded PDF. This is the pipeline used for every client deliverable (SEO report, blog copy, partnership response). Do not hand-roll it each time; follow this.

## When to use
The user asks for any client-facing document as a PDF: report, blog copy, proposal, one-pager, roadmap, response letter. If they just want on-screen copy, don't PDF it.

## Pipeline (always the same 4 steps)
1. Write a self-contained HTML file to the **session scratchpad** (not the repo) using the brand template below.
2. Render it: `chrome --headless=new --no-pdf-header-footer --print-to-pdf="<out>" "file://<html>"`.
3. **Verify before declaring done:** count pages, confirm `grep -c "—"` is 0 (or only labeled quotes), and screenshot at least the cover + one content page and actually look at them.
4. Save the PDF to `~/Downloads/West-End-Athletic-Club-<Title>.pdf` and tell the user the path + page count.

## Hard rules (from CLAUDE.md, non-negotiable)
- **Zero em dashes in prose.** Use commas/colons/periods/parentheses. En dashes in numeric ranges are fine. If you must quote a live title tag that contains a dash, protect it and label it as a quote.
- **No self-rating.** A client PDF never scores or grades Stellr's own work. State what was done and what is planned.
- **No fabricated numbers.** Label estimates "estimate." Verified facts only otherwise.
- **No unfinished-work framing.** Don't present our own open to-do list as a checklist unless the client explicitly asked for status.
- **Links:** plain text destination ("Links to: /promo") unless the user asks for clickable links.

## Brand system (baked into the template)
- **Ink** `#0E0D0A` dark surfaces (never pure black). **Azure** `#00A8E8` is the single accent (never a second accent). Azure-deep `#0089C2`, sky `#A3DDF7`.
- **Host Grotesk** (display + body) and **JetBrains Mono** (labels, section numbers, meta) from Google Fonts.
- **STELLR® wordmark** rendered typographically (Host Grotesk 600, azure superscript ®, azure ✺ sparkle). Do not use a raster logo unless asked.
- **Section headers** in house style: mono `( 01 )` number + Host Grotesk title with one azure `<em>` emphasis word.
- Cover is an Ink card with a soft azure radial glow (one accent moment). Contact line in mono.

## Copy-paste template (edit the body, keep the head)
Write this to `<scratchpad>/<name>.html`, then render:
```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>West End Athletic Club <TITLE> Stellr Media</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  @page{size:A4;margin:15mm 14mm 16mm 14mm;} *{box-sizing:border-box;}
  html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  :root{--ink:#0E0D0A;--ink-soft:#181612;--ink-line:#2A2722;--white-soft:#F5F5F5;--white-line:#E6E6E6;--azure:#00A8E8;--azure-deep:#0089C2;--sky:#A3DDF7;--grey:#595959;--grey-ink:#A9A9A9;}
  body{font-family:'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1815;font-size:10.4px;line-height:1.6;margin:0;}
  .mono{font-family:"JetBrains Mono",monospace;}
  h1,h2,h3{color:var(--ink);font-weight:600;letter-spacing:-.015em;line-height:1.15;}
  h2{font-size:16px;margin:26px 0 11px;padding-bottom:6px;border-bottom:1px solid var(--white-line);}
  h2 .num{font-family:"JetBrains Mono",monospace;font-size:9px;color:var(--azure);letter-spacing:.14em;vertical-align:2.5px;margin-right:9px;}
  h2 em,em.hl{font-style:italic;color:var(--azure);}
  h3{font-size:11.5px;margin:15px 0 4px;} p{margin:0 0 8px;} a{color:var(--azure-deep);text-decoration:none;} .muted{color:var(--grey);} small{font-size:8.6px;}
  table{width:100%;border-collapse:collapse;margin:8px 0 12px;font-size:9px;}
  th{background:var(--ink);color:#fff;text-align:left;padding:6px 7px;font-size:8.4px;} td{padding:5px 7px;border-bottom:1px solid var(--white-line);vertical-align:top;} tr:nth-child(even) td{background:var(--white-soft);}
  .tag{display:inline-block;padding:1.5px 8px;border-radius:20px;font-family:"JetBrains Mono",monospace;font-size:7.6px;text-transform:uppercase;letter-spacing:.05em;}
  .live{background:var(--azure);color:#fff;} .lever{background:transparent;color:var(--azure-deep);border:1px solid var(--azure);}
  .callout{background:#f0f9fe;border-left:3px solid var(--azure);padding:10px 13px;margin:11px 0;border-radius:0 4px 4px 0;}
  .callout.dark{background:var(--ink);color:#e9edf1;} .callout.dark strong{color:#fff;}
  ul{margin:4px 0 9px;padding-left:17px;} li{margin-bottom:3px;} .pagebreak{page-break-before:always;}
  .cover-card{background:var(--ink);border-radius:16px;text-align:center;padding:60px 40px 46px;color:#fff;position:relative;overflow:hidden;}
  .cover-card::after{content:"";position:absolute;top:-40px;right:-40px;width:280px;height:280px;background:radial-gradient(circle,rgba(0,168,232,.32),transparent 68%);}
  .wordmark{font-size:42px;font-weight:600;color:#fff;position:relative;z-index:1;} .wordmark sup{font-size:52%;color:var(--azure);top:-.85em;} .wordmark .spark{color:var(--azure);margin-left:2px;}
  .brandline{font-family:"JetBrains Mono",monospace;font-size:8.4px;letter-spacing:.28em;color:var(--sky);text-transform:uppercase;margin:14px 0 30px;position:relative;z-index:1;}
  .cover-card h1{color:#fff;font-size:29px;margin:4px 0 9px;position:relative;z-index:1;} .cover-card h1 em{color:var(--azure);font-style:italic;}
  .cover-card .sub{font-size:11px;color:var(--grey-ink);max-width:500px;margin:0 auto;position:relative;z-index:1;}
  .cover-meta{margin-top:22px;font-family:"JetBrains Mono",monospace;font-size:8.2px;color:var(--grey);text-align:center;text-transform:uppercase;letter-spacing:.02em;}
</style></head><body>
<div class="cover-card">
  <div class="wordmark">STELLR<sup>&reg;</sup><span class="spark">&#10038;</span></div>
  <div class="brandline">Stellr Media &nbsp;&#10038;&nbsp; West End Athletic Club</div>
  <h1><TITLE with one <em>azure word</em></h1>
  <div class="sub"><one-line subtitle></div>
</div>
<div class="cover-meta">Prepared by <strong>Michael, Stellr Media</strong> &middot; michael@stellrmedia.com &middot; 647-529-7101 &middot; <MONTH YEAR></div>

<div class="pagebreak"></div>
<h2><span class="num">( 01 )</span><Section with one <em>azure word</em></h2>
<p>...</p>
<!-- repeat sections; use .pagebreak between them -->
</body></html>
```

## Render + verify (one bash block)
```bash
SP="<scratchpad>"; OUT="/Users/twerp/Downloads/West-End-Athletic-Club-<Title>.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$OUT" "file://$SP/<name>.html" 2>/dev/null
python3 -c "import re;d=open('$OUT','rb').read();print('pages:',len(re.findall(rb'/Type\s*/Page[^s]',d)))"
grep -c "—" "$SP/<name>.html"   # must be 0 (or only labeled quotes)
"$CHROME" --headless=new --window-size=1240,1754 --screenshot="$SP/cover.png" "file://$SP/<name>.html" 2>/dev/null
# then Read the screenshot and actually look at it
```

## Notes
- The scratchpad HTML is your source; to iterate, edit it and re-render (do not rewrite from scratch).
- To capture a specific later page for QA, render at `--window-size=1240,11000`, find the content height (last non-white row), and crop the region you need.
- Fonts load from Google over the network; if a render looks like a system font, the fetch failed, just re-run.
- Filenames: `West-End-Athletic-Club-SEO-Report.pdf`, `-Blog-Copy.pdf`, `-Partnership-Response.pdf`, etc.
