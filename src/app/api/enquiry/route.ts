import { appendFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { interestOptions } from "@/content/site";

// Where leads go:
// - If SHEET_WEBHOOK_URL is set, each enquiry is sent to the Google Apps Script
//   in google-apps-script/Code.gs, which adds it as a row in your Google Sheet.
// - Otherwise (local development only) it is appended to data/enquiries.csv,
//   which opens in Excel. Vercel's file system doesn't persist, so production
//   must use the sheet.
const sheetUrl = process.env.SHEET_WEBHOOK_URL;
const sheetSecret = process.env.SHEET_WEBHOOK_SECRET ?? "";
const csvFile = path.join(process.cwd(), "data", "enquiries.csv");

const columns = [
  "receivedAt",
  "name",
  "phone",
  "email",
  "city",
  "detectedLocation",
  "interest",
  "project",
  "message",
] as const;

type Enquiry = Record<(typeof columns)[number], string>;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Stop spreadsheet apps from treating submitted text as a formula.
function cell(value: string) {
  return /^[=+\-@]/.test(value) && !/^\+?[0-9\s-]+$/.test(value) ? `'${value}` : value;
}

// Vercel adds approximate visitor location headers on every request.
function detectedLocation(request: Request) {
  const header = (name: string) => decodeURIComponent(request.headers.get(name) ?? "");
  return [header("x-vercel-ip-city"), header("x-vercel-ip-country-region"), header("x-vercel-ip-country")]
    .filter(Boolean)
    .join(", ");
}

async function saveToSheet(enquiry: Enquiry) {
  const res = await fetch(sheetUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: sheetSecret, row: columns.map((c) => enquiry[c]) }),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok || !result?.ok) {
    throw new Error(`Sheet rejected enquiry: ${res.status} ${JSON.stringify(result)}`);
  }
}

async function saveToCsv(enquiry: Enquiry) {
  const quote = (v: string) => `"${v.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  await mkdir(path.dirname(csvFile), { recursive: true });
  const isNew = await stat(csvFile).then(() => false, () => true);
  const header = isNew ? columns.join(",") + "\r\n" : "";
  await appendFile(csvFile, header + columns.map((c) => quote(enquiry[c])).join(",") + "\r\n", "utf8");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Hidden field that people never see; bots that fill every input get a silent "ok".
  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const enquiry: Enquiry = {
    receivedAt: new Date().toISOString(),
    name: text(body.name, 100),
    phone: text(body.phone, 20),
    email: text(body.email, 200),
    city: text(body.city, 100),
    detectedLocation: detectedLocation(request),
    interest: text(body.interest, 50),
    project: text(body.project, 100),
    message: text(body.message, 1000),
  };

  if (!enquiry.name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[0-9+\-\s]{7,20}$/.test(enquiry.phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!(interestOptions as readonly string[]).includes(enquiry.interest)) {
    enquiry.interest = "Other";
  }

  for (const key of columns) enquiry[key] = cell(enquiry[key]);

  try {
    if (sheetUrl) {
      await saveToSheet(enquiry);
    } else if (process.env.VERCEL) {
      throw new Error("SHEET_WEBHOOK_URL is not set, so enquiries cannot be saved on Vercel.");
    } else {
      await saveToCsv(enquiry);
    }
  } catch (error) {
    console.error("Failed to save enquiry", error);
    return NextResponse.json(
      { error: "Sorry, we couldn't save your enquiry. Please call or WhatsApp us instead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
