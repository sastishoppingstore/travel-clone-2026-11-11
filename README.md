# Matchless Travels — Content Clone

Source content captured from **https://www.matchlesstravels.ca/** using **REA**
(`rea capture_browser_scenario`). Every page below is the site's own server
HTML, read from browser-scenario network response bodies, plus the full asset
tree (images, CSS, JS, fonts) mirrored locally.

---

## What is in here

```
travel-clone/
├── source/                     ← USE THIS FOR YOUR THEME
│   ├── content.json            structured content: title, meta, headings,
│   │                           paragraphs, lists, buttons, images, links
│   ├── content-helper.js       require()-able helper (bySlug / contentHtml)
│   ├── pages/                  original server HTML, verbatim (119 pages)
│   ├── content/                main content region only, assets at /assets/
│   └── assets/                 images, CSS, JS, fonts (330 files)
│
├── _assets/                    the same asset tree for the static site
├── <page>/index.html           working static site (119 pages)
├── manifest.json               page list + metadata for the static site
├── serve.js                    tiny static server
└── package.json                `npm start` → http://127.0.0.1:8080
```

---

## The three ways to use it

### 1. Drop the content straight into your theme (fastest)

`source/content.json` has one record per page:

```json
{
  "url": "https://www.matchlesstravels.ca/about/",
  "slug": "about",
  "title": "About Matchless Travels | Umrah & Hajj Agency Mississauga",
  "metaDescription": "Matchless Travels is a leading Umrah and Hajj travel agency...",
  "keywords": "",
  "ogImage": "https://www.matchlesstravels.ca/wp-content/uploads/2026/07/...",
  "canonical": "https://www.matchlesstravels.ca/about/",
  "headings":   [ { "level": 2, "text": "Our Story" }, ... ],
  "paragraphs": [ "Why Choose Matchless? At Matchless Travels, ...", ... ],
  "listItems":  [ "...", ... ],
  "buttons":    [ "Book Now", "Book with us now" ],
  "images":     [ "https://www.matchlesstravels.ca/wp-content/uploads/...", ... ],
  "links":      [ "https://www.matchlesstravels.ca/contact/", ... ],
  "text":       "full plain text of the page",
  "textLength": 1234,
  "contentFile": "content/about/index.html",
  "sourceFile":  "pages/about/index.html"
}
```

Or use the helper (works in Node / bundlers):

```js
const content = require('./source/content-helper.js');

const page = content.bySlug['about'];
page.title            // "About Matchless Travels | ..."
page.metaDescription  // SEO description
page.headings         // [{ level, text }]
page.paragraphs       // ["Why Choose Matchless? ...", ...]

content.contentHtml('about')   // page body HTML, assets at /assets/...
content.sourceHtml('about')    // the untouched server HTML
content.assetPath(page.images[0])  // "wp-content/uploads/2025/11/....jpeg"
```

### 2. Use the content HTML fragment

`source/content/<path>/index.html` holds just the page body (the
`data-elementor-type="wp-page"` container) with every asset URL pointed at
`/assets/…`. Paste it into your template and it renders with the original
classes and markup.

Copy `source/assets/` into your theme's assets folder so `/assets/…` resolves.

### 3. Use the original page HTML as-is

`source/pages/<path>/index.html` is the untouched server response. Use it if
you want to keep Elementor markup exactly as the site serves it.

---

## Running the static clone

```bash
cd /home/ubuntu/travel-clone
node serve.js . 8080
# → http://127.0.0.1:8080
```

---

## Coverage

| | |
|---|---|
| Pages captured | **119** (all sitemap URLs + every in-site page linked from them) |
| Post-JS DOM captures | 119 (REA browser scenarios, DOM + network) |
| Raw server HTML | 119 |
| Assets mirrored | 330 files (images, CSS, JS, fonts) |
| Content text extracted | ~85 000 characters |
| Broken local references | 0 |

### Pages not cloned (3)

`/package/april-umrah-package-gold-2nd-to-12th-2026/`,
`/package/january-umrah-package-15th-to-25th-2026/` and
`/package/january-umrah-package-silver-15th-to-25th-2026/` are **301 redirects
on the live site** to `/umrah-packages/`, which is cloned. There is no page
behind them. Their links in the clone point straight at `/umrah-packages/`.

### Deliberate changes

* Google Ads / Meta Pixel / Google Analytics tags are removed, so the clone
  sends no tracking and no traffic to the live site.
* `wp-admin`, `wp-login.php`, `wp-json`, `xmlrpc.php` and `*/feed/` endpoints
  are neutralised — they need a live WordPress server.
* 21 images that already 404 on the live site were replaced with a
  transparent 1×1 placeholder, so the layout is unaffected.
* `/vacations` and `/cruises` are stubs that redirect to the homepage, matching
  the live site's own redirects.

### Licensing

This clone contains the content of someone else's website. Make sure you have
the rights to the copy, images, logos and trademarks before you publish it.
