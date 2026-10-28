import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { interestOptions } from "@/content/site";

// Enquiries are appended to data/enquiries.jsonl (one JSON object per line).
// This works for local use and single-server hosting; swap it for a database,
// CRM or email service before deploying to serverless hosting.
const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "enquiries.jsonl");

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const enquiry = {
    name: text(body.name, 100),
    phone: text(body.phone, 20),
    email: text(body.email, 200),
    interest: text(body.interest, 50),
    project: text(body.project, 100),
    message: text(body.message, 1000),
    receivedAt: new Date().toISOString(),
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

  await mkdir(dataDir, { recursive: true });
  await appendFile(dataFile, JSON.stringify(enquiry) + "\n", "utf8");

  return NextResponse.json({ ok: true });
}
