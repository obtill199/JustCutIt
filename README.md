# Just Cut It Lawn Care

Website for Just Cut It Lawn Care LLC: lawn mowing, yard cleanups, gutter cleaning and junk removal in Wichita, KS.

Live at https://obtill199.github.io/JustCutIt/ (GitHub Pages from `main` / root).

A static site with no build step: `index.html`, `styles.css`, `script.js`, plus `assets/` (icons and social share image). The quote form doesn't send data anywhere. It opens a pre-filled text message to Jimmy (with copy and email fallbacks).

## Run locally

```bash
python3 -m http.server 8413
```

Then open http://localhost:8413.

## Updating

- **Phone/email:** in several places in `index.html` (including the JSON-LD in `<head>`), plus `PHONE` / `EMAIL` at the top of `script.js`.
- **Services, prices, FAQ:** `index.html`. The FAQ questions and answers also appear in the `FAQPage` JSON-LD in `<head>`, so keep both in sync. The "$40–$60 a cut" range and some FAQ answers come from his GreenPal profile. Confirm them with Jimmy.
- **Hero animation:** the six `.stripe` elements and `.mower` SVG in the hero, animated in `script.js`.

## SEO

- Title, meta description, canonical URL, Open Graph/Twitter tags, `LocalBusiness` + `WebSite` + `FAQPage` structured data, `sitemap.xml`, `robots.txt`.
- **If the site moves to its own domain** (e.g. justcutitlawncare.com), find/replace `https://obtill199.github.io/JustCutIt/` in `index.html`, `sitemap.xml` and `robots.txt`. `robots.txt` only takes effect at a domain root.
- Submit `sitemap.xml` in Google Search Console, and link the site from Jimmy's Google Business Profile, Facebook, BBB and GreenPal pages.
