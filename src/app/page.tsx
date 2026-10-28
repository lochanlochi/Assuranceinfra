import EnquiryForm from "@/components/EnquiryForm";
import { company, projects, stats, strengths, type ProjectStatus } from "@/content/site";

const statusStyles: Record<ProjectStatus, string> = {
  Ongoing: "bg-brand/10 text-brand",
  Upcoming: "bg-accent/15 text-accent",
  Completed: "bg-muted/15 text-muted",
};

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#why-us", label: "Why us" },
  { href: "#enquire", label: "Enquire" },
];

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
              <li key={link.href} className={link.href === "#enquire" ? "" : "hidden sm:block"}>
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
            Build your next chapter on solid ground.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{company.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-brand px-6 py-3 font-medium text-background hover:bg-brand-strong"
            >
              View projects
            </a>
            <a
              href="#enquire"
              className="rounded-full border border-border px-6 py-3 font-medium hover:border-brand hover:text-brand"
            >
              Book a site visit
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

        <section id="projects" className="scroll-mt-20 border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Our projects</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Homes, plots and commercial spaces, each with approvals and documents ready to review.
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <li
                  key={project.name}
                  className="flex flex-col rounded-2xl border border-border bg-background p-6"
                >
                  <span
                    className={`self-start rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-semibold">{project.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.type} · {project.location}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed">{project.summary}</p>
                  <a href="#enquire" className="mt-6 text-sm font-medium text-brand hover:underline">
                    Enquire about {project.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="why-us" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Why buyers choose us</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {strengths.map((item) => (
              <div key={item.title} className="border-l-2 border-accent pl-5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="enquire" className="scroll-mt-20 bg-brand-strong text-background">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Talk to our team</h2>
              <p className="mt-4 max-w-md opacity-80">
                Tell us what you are looking for and we will call you back within one working day to share
                prices, floor plans and a time for a site visit.
              </p>
              <dl className="mt-8 space-y-3 text-sm">
                <div>
                  <dt className="opacity-60">Phone</dt>
                  <dd className="font-medium">{company.phone}</dd>
                </div>
                <div>
                  <dt className="opacity-60">Email</dt>
                  <dd className="font-medium">{company.email}</dd>
                </div>
                <div>
                  <dt className="opacity-60">Office</dt>
                  <dd className="font-medium">{company.address}</dd>
                </div>
              </dl>
            </div>
            <EnquiryForm projectNames={projects.map((p) => p.name)} />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} {company.name}
          </span>
          <span>{company.address}</span>
        </div>
      </footer>
    </>
  );
}
