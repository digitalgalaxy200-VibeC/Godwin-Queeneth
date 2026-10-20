# Godwin & Queeneth — The GQ Affair

A responsive wedding invitation website prototype for Sunday, 15 November 2026.

## Features
- Portrait-led cinematic invitation opening and landing hero so guests see the couple's faces immediately.
- Four supplied wedding portraits, each served as WebP with a JPEG fallback for browsers or preview panes that cannot decode WebP.
- Bilingual in English and French, chosen automatically from the device language, with a manual EN/FR switch and `?lang=fr` links.
- Love-story chapters with editorial image hierarchy and romantic copy.
- Wedding countdown, ceremony directions, reception announcement placeholder, and colour note.
- Wedding gift section with wording and a clear note that confirmed gift/payment details must be requested directly; no bank details are fabricated.
- RSVP message preparation for WhatsApp (not stored in a database).
- Gallery lightbox, share control, responsive navigation, ambient motion and reduced-motion support.

## Preview locally
Open `index.html` in a browser. Keep the `assets` directory alongside it — the photos live in `assets/` and are loaded with relative paths.

## Deploy
Upload the complete `gq-affair-site` folder to a static host such as Vercel or GitHub Pages. Keep `translations.js` and `i18n.js` next to `index.html`.

## Languages
English is the authored source; French is a formal translation. On first visit the site picks the device language (`fr*` becomes French, everything else English). A manual choice via the EN/FR switch is remembered in `localStorage`, and `?lang=fr` / `?lang=en` forces a language for shared links.

To add another language:
1. Add the language table to `translations.js` (copy `en` and translate every key).
2. Add its code to `SUPPORTED` in `i18n.js`.
3. Add a button with `data-lang-btn="<code>"` to the `.lang-switch` in `index.html`.

## Details still to confirm
- Reception venue and timing.
- Official dress code, if any.
- Whether the couple wants confirmed gift/payment instructions displayed publicly.
- A dedicated RSVP recipient number or backend if responses should be received/stored reliably.
