"""
Raju Tailor & PhotoState — Flask application
----------------------------------------------
Run locally with:  python app.py
Then open:          http://127.0.0.1:5000
"""

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# ----------------------------------------------------------------------
# PLACEHOLDER BUSINESS DATA
# Replace every value below with the real business details.
# Everything on the page is driven from here — edit once, updates everywhere.
# ----------------------------------------------------------------------
BUSINESS = {
    "name": "Raju Tailor & PhotoState",
    "tagline": "Quality Tailoring & Convenient Document Services Under One Roof.",
    "status": "Open / Available",  # shown in the hero status pill
    "phone_display": "9876844306",
    "phone_tel": "+910000000000",       # used in tel: link — replace with real number
    "whatsapp_display": "9876844306",
    "whatsapp_number": "910000000000",  # digits only, country code first, used in wa.me link
    "whatsapp_message": "Hello Raju Tailor & PhotoState, I would like to know more about your services.",
        "address": "Village-Chahal, Faridkot, Punjab 151203",        "hours": "7 AM to 9 PM",    "email": "[ADD EMAIL ADDRESS]",
    "map_query": "",  # e.g. "Raju Tailor and PhotoState, Your City" once known
    "year": 2026,
    "stats": [
        {"value": 15, "suffix": "+", "label": "Years of Experience"},
        {"value": 5, "suffix": "", "label": "Services Available"},
        {"value": 3000, "suffix": "+", "label": "Happy Customers"},
    ],
}

SERVICES = [
    {
        "icon": "needle",
        "title": "Tailoring",
        "tag": "\U0001F9F5",
        "desc": "Custom stitching, alterations and clothing adjustments finished with a tailor's eye for fit.",
        "points": ["Custom stitching", "Alterations", "Clothing adjustments"],
    },
    {
        "icon": "copy",
        "title": "Photostat",
        "tag": "\U0001F4C4",
        "desc": "Fast, clean photocopies for every document — single pages to full bound sets.",
        "points": ["Black & white photocopy", "Colour photocopy", "Document duplication"],
    },
    {
        "icon": "printer",
        "title": "Printing",
        "tag": "\U0001F5A8\uFE0F",
        "desc": "Crisp document and colour printing for study, work and personal needs.",
        "points": ["Document printing", "Colour printing", "General printing services"],
    },
    {
        "icon": "scan",
        "title": "Scanning",
        "tag": "\U0001F4D1",
        "desc": "Turn paper into clean digital files, ready to share, store or email in seconds.",
        "points": ["Document scanning", "Digital copies", "File conversion"],
    },
    {
        "icon": "camera",
        "title": "Photo Services",
        "tag": "\U0001F4F8",
        "desc": "Passport and document photography shot and printed to official specification.",
        "points": ["Passport-size photos", "Document photos", "Basic photo services"],
    },
]

GALLERY = [
    {"id": "tailoring", "title": "Tailoring Work", "category": "Tailoring"},
    {"id": "sewing-machine", "title": "Sewing Machine", "category": "Tailoring"},
    {"id": "clothes", "title": "Finished Clothing", "category": "Tailoring"},
    {"id": "printing", "title": "Printing Services", "category": "Printing"},
    {"id": "photostat-machine", "title": "Photostat Machine", "category": "Photostat"},
    {"id": "documents", "title": "Document Handling", "category": "Documents"},
    {"id": "passport-photos", "title": "Passport Photos", "category": "Photo Services"},
]


@app.route("/")
def index():
    return render_template(
        "index.html",
        business=BUSINESS,
        services=SERVICES,
        gallery=GALLERY,
    )


@app.route("/api/contact", methods=["POST"])
def contact():
    """
    Lightweight contact-form handler.
    Currently just validates and echoes back a success message — no email/DB
    is wired up yet. Hook this up to an email service or database before
    going live.
    """
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not message:
        return jsonify({"ok": False, "error": "Please fill in your name and message."}), 400

    # TODO: send an email / save to a database here.
    return jsonify({"ok": True, "message": "Thanks! Your message has been received."})


if __name__ == "__main__":
    app.run(debug=True)
