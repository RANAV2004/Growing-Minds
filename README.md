# Growing Minds Child Development Center — Website

Website for **Dr. Khyati Rana** and **Growing Minds Child Development Center, Bhopal**.

A single, fast, mobile-friendly page. No build step, no server, no database.

```
site/
├── index.html      ← page content and structure
├── css/style.css   ← all styling (colours, layout, mobile)
├── js/script.js    ← behaviour (menu, booking form, calendar, milestone checker, map)
├── assets/         ← all images (photos, logo, card backgrounds)
└── README.md
```

## Put it online (free)

**Vercel** (recommended)
1. Push this folder to a GitHub repository.
2. On vercel.com → *Add New → Project* → import the repo → *Deploy* (no settings needed).
3. Add a custom domain (e.g. `growingmindscdc.in`) under *Project → Settings → Domains*.

**Netlify**: drag and drop this folder onto app.netlify.com/drop.

**GitHub Pages**: repo → *Settings → Pages* → deploy from the `main` branch, root folder.

Preview locally: open `index.html` in a browser, or run `python3 -m http.server` inside this folder and visit http://localhost:8000.

## How bookings work

There is no backend. The 4-step booking form (service → therapist → visit type → preferred date → parent details)
builds a message and opens **WhatsApp to +91 90980 70339** with everything pre-filled. The clinic replies to
confirm the appointment time. A "Copy details" button and the phone number are offered as fallbacks.

Therapist is auto-selected from the service (editable by the parent):
- Speech & Language Therapy, Communication Therapy → Nafees Khan
- Special Education, ABA → Growing Minds team
- Everything else → Dr. Khyati Rana

## Common edits

| What | File | Search for |
|---|---|---|
| Phone / WhatsApp number | `index.html` and `js/script.js` | `919098070339` and `90980 70339` (change all) |
| Clinic hours | `index.html` | `7:30 AM` |
| Weekend closure in calendar | `js/script.js` | `dt.getDay()===0` |
| Address & map | `index.html` | `Abhiruchi Parisar` |
| Instagram | `index.html` | `growingmindscdc` |
| Therapist auto-assignment | `js/script.js` | `function therFor` |
| Milestone checklist | `js/script.js` | `const M={` |
| Colours (dark cyan theme) | `css/style.css` | `:root{` at the top |
| Services list | `index.html` | `<!-- SERVICES -->` |
| Team members | `index.html` | `id="team"` |

To change a photo, replace the file in `assets/` with one of the same name.

## Notes
- The Google Map appears automatically once the site is on a real domain.
- Please confirm the clinic address and that the OSIT and Interoception images are licensed for use
  (or replace them with the clinic's own photos) before going public.
