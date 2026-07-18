# Pragati & Arindam — Save the Date

A single-page, mobile-first microsite. Pure static HTML/CSS/JS — no build step, no dependencies to install.

## File structure
```
index.html
css/style.css
js/main.js
```

## Preview locally
Just open `index.html` in a browser, or run a tiny local server (recommended, some browsers restrict local file behavior):
```
cd wedding-site
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy on GitHub Pages (free)

1. Create a new **public** GitHub repository (e.g. `save-the-date`).
2. Push these three items (`index.html`, `css/`, `js/`) to the root of that repo:
   ```
   git init
   git add .
   git commit -m "Save the date site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/save-the-date.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)** → Save.
4. After a minute, your site is live at:
   `https://<your-username>.github.io/save-the-date/`
5. Generate a QR code pointing to that URL (any free QR generator, e.g. qr-code-generator.com) for the physical card.

## Updating later
Any edit to `index.html`, `css/style.css`, or `js/main.js`, followed by a `git push`, auto-updates the live site within ~a minute — no rebuild needed.

## What's built
- Tap-to-open entry gate with monogram
- Ink-bleed animated hero reveal (names + date)
- Live countdown to **11 Dec 2026, 00:00 IST**
- Three event sections, each with its own colour mood that transitions in as you scroll (bright Carnival → dark glam Sangeet → soft pastel Wedding)
- Contact cards with one-tap calling on mobile
- Closing section with a hidden petal-burst easter egg (tap the monogram 3×)
- Full `prefers-reduced-motion` support, keyboard accessibility, and mobile-first responsive layout

## Adding things later (v2)
- Photos: drop images into an `assets/` folder and reference them in `index.html`
- RSVP: add a Formspree or Google Form embed as a new section
- Venue reveal: update the "to be revealed 🤫" lines and optionally add a Google Maps embed
- Custom domain: buy a domain and add a `CNAME` file + configure it under Settings → Pages
