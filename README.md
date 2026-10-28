# Assurance Infra website

Company website for Assurance Infra: homepage, project listings, "why us" section and an enquiry form that captures call-back requests.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS 4.

## Running locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Editing content

All copy (company details, stats, process, packages, past projects, strengths, testimonials) lives in `src/content/site.ts`. It was taken from assurancedevelopers.com.

## Enquiries (leads)

The form posts to `/api/enquiry`, which validates the input and saves: name, phone, email, the city the visitor typed, their approximate location detected by Vercel (city, state, country), what they're interested in, the package and their message.

- **On Vercel:** each enquiry is added as a row in a Google Sheet (setup below). If the sheet isn't configured, the form shows an error asking people to call or WhatsApp instead, so leads are never silently lost.
- **Locally** (no sheet configured): enquiries are appended to `data/enquiries.csv`, which opens in Excel. The `data/` folder is git-ignored because it holds customers' personal data.

A hidden field catches most spam bots, and text that looks like a spreadsheet formula is neutralised before saving.

### Saving leads to Google Sheets

1. Create a new Google Sheet (for example "Assurance Infra Leads").
2. In the sheet, open **Extensions → Apps Script**. Delete the sample code and paste in the contents of `google-apps-script/Code.gs`. Save.
3. In Apps Script, open **Project Settings → Script properties → Add script property**. Name: `SECRET`. Value: a long random password you make up. This stops anyone else from writing to your sheet.
4. Click **Deploy → New deployment**, choose type **Web app**, set *Execute as* to **Me** and *Who has access* to **Anyone**, then **Deploy**. Approve the permissions, and copy the **Web app URL**.
5. In Vercel, open the project's **Settings → Environment Variables** and add:
   - `SHEET_WEBHOOK_URL` = the Web app URL
   - `SHEET_WEBHOOK_SECRET` = the same secret as step 3
6. Redeploy. New enquiries appear in a **Leads** tab in the sheet.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

To test the sheet locally, put the same two variables in a `.env.local` file (git-ignored) and restart `npm run dev`.

## WhatsApp and brochure

Set the WhatsApp number (digits with country code) and an optional brochure PDF in `src/content/site.ts`. Put the PDF in `public/` and set `brochureUrl` to e.g. `"/brochure.pdf"`; visitors who submit the form then get a download button.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: run ESLint
