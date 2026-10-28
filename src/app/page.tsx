import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { company, packages, process, projects, stats, strengths, testimonials } from "@/content/site";

const navLinks = [
  { href: "#process", label: "Process" },
  { href: "#packages", label: "Packages" },
  { href: "#work", label: "Our work" },
  { href: "#enquire", label: "Free consultation" },
];

const inr = new Intl.NumberFormat("en-IN");

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="font-serif text-xl font-semibold text-brand">
            {company.name}
          </a>
          <ul className="flex items-center gap-5 text-sm sm:gap-8">
            {navLinks.map((link) => (
              <li key={link.href} className={link.href === "#enquire" ? "" : "hidden md:block"}>
                <a
                  href={link.href}
                  className={
                    link.href === "#enquire"
                      ? "rounded-full bg-brand px-4 py-2 font-medium text-background hover:bg-brand-strong"
                      : "text-muted hover:text-foreground"
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">{company.tagline}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight font-semibold sm:text-6xl">
            Your dream home, built with assurance.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{company.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#enquire"
              className="rounded-full bg-brand px-6 py-3 font-medium text-background hover:bg-brand-strong"
            >
              Book a free consultation
            </a>
            <a
              href="#packages"
              className="rounded-full border border-border px-6 py-3 font-medium hover:border-brand hover:text-brand"
            >
              See packages
            </a>
          </div>
          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="mt-1 font-serif text-3xl font-semibold text-brand">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="process" className="scroll-mt-20 border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">The Assurance process</h2>
            <p className="mt-3 max-w-2xl text-muted">
              From concept to completion, a method that keeps quality, cost and timelines clear at every stage.
            </p>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border bg-background p-6">
                  <span className="font-serif text-3xl font-semibold text-accent">{i + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="packages" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Built for every budget</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Clear per-square-foot pricing, inclusive of tax. Pick a package and we&apos;ll tailor it to your plot.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => (
              <li
                key={pkg.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  pkg.recommended ? "border-brand bg-surface shadow-lg" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-wide uppercase">{pkg.name}</h3>
                  {pkg.recommended && (
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-4 font-serif text-4xl font-semibold">
                  ₹{inr.format(pkg.pricePerSqFt)}
                  <span className="font-sans text-base font-normal text-muted"> / sq ft</span>
                </p>
                <p className="mt-1 text-xs text-muted">Inclusive of tax</p>
                <p className="mt-4 text-sm">{pkg.pitch}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#enquire"
                  className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-medium ${
                    pkg.recommended
                      ? "bg-brand text-background hover:bg-brand-strong"
                      : "border border-border hover:border-brand hover:text-brand"
                  }`}
                >
                  Get a quote for {pkg.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="work" className="scroll-mt-20 border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Homes we&apos;ve built</h2>
            <p className="mt-3 max-w-2xl text-muted">Custom homes across Bangalore, from compact rentals to large villas.</p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.location} className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-xl font-semibold">{p.location}</h3>
                    <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {p.floors}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {inr.format(p.areaSqFt)} sq ft · {p.beds} beds · {p.baths} baths
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Why Assurance?</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {strengths.map((item) => (
              <div key={item.title} className="border-l-2 border-accent pl-5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">What our clients say</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <li key={t.name} className="rounded-2xl border border-border bg-background p-6">
                  <blockquote className="leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <p className="mt-4 text-sm font-semibold text-brand">{t.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="enquire" className="scroll-mt-20 border-t border-border bg-background text-foreground">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Book a free consultation</h2>
              <p className="mt-4 max-w-md opacity-80">
                Tell us about your plot and what you want to build. We&apos;ll call you back within one working day
                to arrange a free site evaluation and quotation.
              </p>
              <dl className="mt-8 space-y-3 text-sm">
                <div>
                  <dt className="opacity-60">Phone</dt>
                  <dd className="font-medium">
                    <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:underline">
                      {company.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="opacity-60">Email</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${company.email}`} className="hover:underline">
                      {company.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="opacity-60">Office</dt>
                  <dd className="max-w-sm font-medium">{company.address}</dd>
                </div>
              </dl>
            </div>
            <EnquiryForm packageNames={packages.map((p) => p.name)} />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 pb-24 text-sm text-muted sm:flex-row sm:justify-between sm:px-6 sm:pb-8">
          <span>
            © {new Date().getFullYear()} {company.name}
          </span>
          <span>Jayanagar, Bengaluru</span>
        </div>
      </footer>
      <WhatsAppButton />
    </>
  );
}
