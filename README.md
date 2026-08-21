# Raju Tailor & PhotoState — Website

A premium, animated one-page website for a local tailoring + document-services shop, built with Flask (backend) and vanilla HTML/CSS/JS (frontend).

## Project structure

```
raju-tailor/
├── app.py                  # Flask app — business data + routes
├── templates/
│   └── index.html          # Page markup (Jinja2)
├── static/
│   ├── css/style.css       # All styling, animations, responsive rules
│   ├── js/script.js        # Petals/particles canvas, nav, reveals, lightbox, form
│   └── images/             # Placeholder SVG artwork (gold line-art on navy)
└── README.md
```

## Run it locally

You need Python 3.9+ and Flask.

```bash
cd raju-tailor
pip install flask
python app.py
```

Then open the address shown in the terminal — by default:

```
http://127.0.0.1:5000
```

The page is fully self-contained: no database, no external API keys, no build step.

## What to replace before going live

Everything below is clearly marked with `[ADD ...]` placeholders — either on the page itself or in `app.py`.

1. **Business details** — open `app.py` and edit the `BUSINESS` dictionary at the top:
   - `phone_display` / `phone_tel` — the phone number shown and the `tel:` link
   - `whatsapp_display` / `whatsapp_number` — WhatsApp contact + the number the button messages
   - `address`, `hours`, `email`
   - `map_query` — once you know the exact shop location, put a searchable string here (e.g. `"Raju Tailor and PhotoState, Model Town, Ludhiana"`) so the "Get Directions" button links straight to it
   - `stats` — years of experience / services / happy customers shown as animated counters

2. **Map section** — the Contact section currently shows a clearly marked placeholder card (`[ADD GOOGLE MAPS EMBED HERE]`) instead of a guessed address or coordinates. Once you have the real location, replace the `.map-placeholder` block in `templates/index.html` with a Google Maps `<iframe>` embed.

3. **Images** — everything in `static/images/` is placeholder line-art (gold on navy) built to match the site's palette, so nothing looks like a generic stock photo. Swap in real photos of the shop, machines, and finished work with the same filenames, or update the `src` paths in `templates/index.html` / `GALLERY` list in `app.py`.

4. **Favicon** — `static/images/favicon.svg` is a placeholder "RT" monogram. Replace with a real logo when available.

## Design notes

- **Palette**: deep navy/black background (`#0b0e17`) with a warm gold accent (`#d9ac54` / `#f0c878`), used consistently across buttons, icons, and the ambient canvas animation.
- **Type**: Playfair Display for headings (tailoring-appropriate elegance), Inter for body copy, Outfit for UI labels/navigation.
- **Signature motif**: a faint gold stitched thread line runs through the hero background, tying the tailoring theme into the animated cherry-blossom-petal ambiance requested for the page.
- **Performance**: the petal/particle canvas automatically halves its particle count on small screens or lower-core devices, pauses when the tab is hidden, and is skipped entirely if the visitor's OS has "reduce motion" turned on.

## Extending the contact form

`POST /api/contact` currently validates the submission and returns a success message — it doesn't send an email or save anywhere yet. To make it functional, add an email service (e.g. Flask-Mail) or a database write inside the `contact()` view in `app.py`, where the `TODO` comment is.
