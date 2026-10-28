/* Assurance Infra — shared behaviour */
(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");

  // Header background after scrolling past the top
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Reveal on scroll
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  const watch = (el) => (io ? io.observe(el) : el.classList.add("in"));
  document.querySelectorAll(".reveal").forEach(watch);

  // Count-up numbers
  const counters = document.querySelectorAll("[data-count]");
  const countIO = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
          const step = (t) => {
            const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
            el.textContent = v;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countIO.unobserve(el);
        });
      }, { threshold: 0.5 })
    : null;
  counters.forEach((c) => (countIO ? countIO.observe(c) : (c.textContent = c.dataset.count)));

  // Session storage can be blocked (private mode); never let that break a form
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: (k) => { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  // Remember where a visitor came from (ad campaign UTM tags) for the enquiry message
  const params = new URLSearchParams(location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => params.get(k)).filter(Boolean).join(" / ");
  if (utm) store.set("ai-source", utm);
  const source = [document.title.split(" — ")[0], store.get("ai-source")].filter(Boolean).join(" · ");
  document.querySelectorAll('input[type="hidden"][name="Source"]').forEach((i) => (i.value = source));

  // Preselect a package from ?package=… (package buttons) or data-pick links on the campaign page
  const pick = (name) => document.querySelectorAll('[name="Package"]').forEach((el) => {
    if (el.type === "radio") el.checked = el.value === name;
    else if ([...el.options].some((o) => o.value === name)) el.value = name;
  });
  if (params.get("package")) pick(params.get("package"));
  document.querySelectorAll("[data-pick]").forEach((a) => a.addEventListener("click", () => pick(a.dataset.pick)));

  const message = (form) => {
    const lines = [form.dataset.intro || "Hello Assurance Infra, I'd like a consultation."];
    new FormData(form).forEach((v, k) => { if (String(v).trim()) lines.push(`${k}: ${v}`); });
    return lines.join("\n");
  };

  // Enquiry forms → WhatsApp message to the sales desk, then on to our clients and works
  document.querySelectorAll("form[data-whatsapp]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(message(form))}`, "_blank", "noopener");
      const name = String(new FormData(form).get("Name") || "").trim().split(/\s+/)[0];
      store.set("ai-enquiry", name || "1");
      const next = form.dataset.next || "clients.html";
      if (location.pathname.endsWith("/" + next)) showThanks();
      else location.href = next + "#thanks";
    });
    const mail = form.querySelector("[data-mail]");
    if (mail) mail.addEventListener("click", () => {
      if (!form.reportValidity()) return;
      location.href = `mailto:${mail.dataset.mail}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(message(form))}`;
    });
  });

  // Clients page: thank the visitor who just enquired
  function showThanks() {
    const bar = document.getElementById("thanks");
    const who = store.get("ai-enquiry");
    if (!bar || !who) return;
    store.del("ai-enquiry");
    const slot = bar.querySelector("[data-thanks-name]");
    if (slot && who !== "1") slot.textContent = ", " + who;
    bar.hidden = false;
    bar.scrollIntoView({ block: "start" });
  }
  showThanks();

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  window.AI = { watch };
})();
