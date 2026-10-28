"use client";

import { useState } from "react";
import { company, interestOptions } from "@/content/site";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function EnquiryForm({ projectNames }: { projectNames: string[] }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", message: "Could not reach the server. Please try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-2xl bg-surface p-8 text-foreground">
        <h3 className="font-serif text-2xl font-semibold">Thank you</h3>
        <p className="mt-2 text-muted">We have your details and will call you within one working day.</p>
        {company.brochureUrl && (
          <a
            href={company.brochureUrl}
            download
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-background hover:bg-brand-strong"
          >
            Download the brochure
          </a>
        )}
        <br />
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 text-sm font-medium text-brand hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-4 rounded-2xl bg-surface p-6 text-foreground sm:p-8">
      <label className="text-sm font-medium">
        Full name
        <input name="name" required maxLength={100} autoComplete="name" className={fieldClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Phone
          <input
            name="phone"
            type="tel"
            required
            pattern="[0-9+\-\s]{7,20}"
            title="7 to 20 digits"
            autoComplete="tel"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium">
          Email <span className="font-normal text-muted">(optional)</span>
          <input name="email" type="email" maxLength={200} autoComplete="email" className={fieldClass} />
        </label>
      </div>
      <label className="text-sm font-medium">
        City / area
        <input name="city" maxLength={100} autoComplete="address-level2" className={fieldClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Interested in
          <select name="interest" className={fieldClass} defaultValue={interestOptions[0]}>
            {interestOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Project
          <select name="project" className={fieldClass} defaultValue="">
            <option value="">Not sure yet</option>
            {projectNames.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-sm font-medium">
        Message <span className="font-normal text-muted">(optional)</span>
        <textarea name="message" rows={3} maxLength={1000} className={fieldClass} />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status.kind === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-full bg-brand px-6 py-3 font-medium text-background hover:bg-brand-strong disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Request a call back"}
      </button>
      <p className="text-xs text-muted">
        We use your details and approximate location only to contact you about our projects. We never sell or
        share them. To have them deleted, email {company.email}.
      </p>
    </form>
  );
}
