# Pragati & Arindam — Save the Date (v2)

Pure static HTML/CSS/JS. No build step, no dependencies to install.

## File structure
```
index.html
css/style.css
js/main.js
assets/couple.jpg   ← your illustration
```

## Preview locally
```
cd wedding-site
python3 -m http.server 8000
```
Visit http://localhost:8000

## Deploy on GitHub Pages (free)
1. Create a public GitHub repo (e.g. `save-the-date`).
2. Push `index.html`, `css/`, `js/`, `assets/` to the repo root.
3. Repo → Settings → Pages → Source: Deploy from a branch → main / (root) → Save.
4. Live at `https://<username>.github.io/save-the-date/` within a minute.
5. Generate a QR code pointing to that URL for the physical card.

## What's in v2
- No tap-gate — auto-playing entrance, works reliably across mobile browsers and in-app browsers (WhatsApp/Instagram) on iOS and Android.
- One consistent ivory/gold/marigold palette throughout (no per-event recoloring).
- Flip-calendar date reveal + live countdown as the centerpiece.
- Your actual illustration is now live in the hero (assets/couple.jpg, resized/compressed from ~2.1MB to ~92KB for fast mobile loading), with a soft edge-fade so it blends into the page, a gentle idle sway, tap-for-hearts, and tilt parallax (device tilt on mobile, mouse-move on desktop).
- Real "Add to Calendar" button — downloads a working .ics file (opens Calendar app on iPhone and Android).
- Native "Share the date" button (Share sheet on supported phones, copy-link fallback).
- Events as a compact swipeable card carousel.
- Continuous ambient petals throughout the page.
- Safer viewport-height handling for consistent full-height sections across iOS Safari, Chrome, Edge, and older Android WebViews.

## Swapping the illustration later
Replace `assets/couple.jpg` with a new file of the same name (or update the `src` in `index.html`, `#couple-photo`). Keep it under ~200KB for fast mobile load — resize to ~700px wide and export as JPEG quality ~80 if needed.

## Adding things later
- More photos: extend the `assets/` folder.
- RSVP: add a Formspree or Google Form embed as a new section.
- Venue reveal: update "to be revealed 🤫" lines, optionally add a Google Maps embed.
- Custom domain: buy a domain, add a `CNAME` file, configure under Settings → Pages.
