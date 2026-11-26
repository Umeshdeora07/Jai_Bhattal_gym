# Jai Bhattal — Website

The website for **Jai Bhattal, Online Fitness & Nutrition Coach**: a fast, single-page site with plans, results, certificates, FAQ and an enquiry form that sends straight to WhatsApp.

- No database and no monthly fees: enquiries go to Jai's WhatsApp as a ready-made message.
- Plain HTML, CSS and JavaScript, so it works on any free static host (Netlify, GitHub Pages, Cloudflare Pages).

## Folder layout

| Path | What it is |
| --- | --- |
| `docs/index.html` | The whole page: all text and sections |
| `docs/assets/css/styles.css` | Theme: colours, fonts, layout |
| `docs/assets/js/main.js` | WhatsApp links, mobile menu, certificate viewer, form, calorie calculator |
| `docs/assets/img/certificates/` | Certificate images shown on the site |
| `docs/assets/img/og-image.jpg` | Preview image when the link is shared on WhatsApp or social media |
| `instagram-screenshots/`, `photo_*.jpg`, `*.pdf` | Source material (not part of the site) |

## Preview on your computer

Open `docs/index.html` in a browser, or run a small local server from the `docs` folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Publish (free)

**Option A: Netlify (recommended; works with a private repository)**

1. Sign up at netlify.com with GitHub.
2. "Add new site" → "Import an existing project" → choose this repository.
3. Netlify reads `netlify.toml` and publishes the `docs` folder. No build step is needed.
4. You get a test address such as `jaibhattal.netlify.app`. Every push to the chosen branch updates the site automatically.

**Option B: GitHub Pages (free only while the repository is public)**

Repository → Settings → Pages → "Deploy from a branch" → choose the branch and the `/docs` folder.

## Connect jaibhattal.com (after the new site is approved)

1. In Netlify: Site settings → Domain management → Add `jaibhattal.com`. Netlify shows the DNS records to add.
2. At the company where the domain was bought, open its DNS settings. Remove the records that point to Google Sites, and add the ones Netlify shows. Keep any MX (email) records.
3. In Google Sites, remove the custom domain from the old site (Settings → Custom domains).
4. HTTPS switches on automatically. DNS changes can take from a few minutes up to 48 hours.
5. Then change `og:image` in `docs/index.html` to the full address, `https://www.jaibhattal.com/assets/img/og-image.jpg`, so link previews always show the image.

## Calorie & protein calculator

The "Free tool" section works out daily calories, protein, BMI and a healthy weight range, then sends the results to Jai on WhatsApp. Nothing is stored.

| Number | Method |
| --- | --- |
| Calories | Mifflin-St Jeor equation × activity level; fat loss = 80% of maintenance (never below 1,200 kcal for women or 1,500 for men, and never above maintenance); muscle gain = 110% |
| BMI categories | Indian consensus cut-offs (Misra et al., 2009): healthy 18.5–22.9, overweight 23–24.9, obese 25+ |
| Protein | International Society of Sports Nutrition range, 1.4–2.0 g per kg; uses a healthy reference weight (BMI 25) for people above it |
| Food list | Approximate protein per serving of common Indian foods |

The percentages, protein ranges and food list are at the top of the calculator code in `docs/assets/js/main.js` (`GOALS` and `FOODS`).

## Common edits

| To change | Where |
| --- | --- |
| WhatsApp number | `WHATSAPP_NUMBER` at the top of `docs/assets/js/main.js` |
| Phone and email shown on the page | "CONTACT / FORM" and "FOOTER" sections of `docs/index.html` |
| Prices or plan features | "PLANS" section of `docs/index.html`, and the `makesOffer` prices near the top |
| Certificates | Add the image to `docs/assets/img/certificates/` and copy one `<button class="cert">` block in the "CERTIFICATES" section |

## Confirm before going live

These are written from the plans PDF, certificates and Instagram profile. Please check them with Jai:

- [ ] **WhatsApp number:** the site uses +91 90342 80004 from the plans PDF.
- [ ] **Plan features:** each plan lists "personalised home-food diet, personalised training plan, plan adjustments as you progress, direct guidance from Jai". Add check-in frequency, calls and so on if they are included.
- [ ] **Free consultation?** If the first chat is free, say so on the buttons ("Book a free consultation"). It usually brings more enquiries.
- [ ] **Credentials:** the site shows only certificates that were uploaded. Add ACE-FNS, NASM-CPT, ISSA and the renewed ACE-CPT once their certificates are uploaded.
- [ ] **Sample day (hero):** the meals are an illustration of a home-food plan; Jai should approve them.
- [ ] **Photos:** add a good photo of Jai (About section) and transformation photos, only with each client's permission.
- [ ] **Testimonials:** add real client reviews when available.
