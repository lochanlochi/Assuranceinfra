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

All copy (company details, stats, projects, strengths) lives in `src/content/site.ts`. The current values are placeholders; replace them with real details before going live.

## Enquiries

The form posts to `/api/enquiry`, which validates the input and appends each enquiry as one JSON line to `data/enquiries.jsonl`. That folder is git-ignored because it holds customers' personal data.

Writing to a local file works when running on your own machine or a single server. On serverless hosting (such as Vercel) the file system isn't persistent, so swap the storage in `src/app/api/enquiry/route.ts` for a database, CRM or email service first.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: run ESLint
