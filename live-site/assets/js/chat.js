/* Assurance Infra assistant — answers from the site's own knowledge base (kb.js) and
   routes the customer's messages to the official WhatsApp (+91 74071 11999): one tap
   opens WhatsApp with the whole conversation, so the team can reply to the customer
   directly. /api/notify additionally pings the team automatically once configured. */
(function () {
  const KB = window.AI_KB;
  if (!KB || document.querySelector(".ai-chat")) return;
  const WA = "917407111999";
  const C = KB.contact;
  const MAP = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Assurance Infra, " + C.studio);
  const WELCOME = {
    title: "Welcome to Assurance Infra",
    text: "Thank you for reaching out! How can we help with your home or building project today?",
    after: `📍 Visit our studio: ${C.studio} · Open ${C.hours}`,
    link: { href: MAP, label: "Get directions", ext: true },
  };

  // ---------- Storage (sessionStorage can be blocked; never break the widget) ----------
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const state = store.get("ai-chat", null) || { sid: Math.random().toString(36).slice(2, 10), log: [], lead: {}, step: null, open: false };
  const save = () => store.set("ai-chat", state);

  // ---------- Retrieval ----------
  const STOP = new Set("a an the is are was be to of in on for and or with do does did you your we our i me my can could would will should what which who how when where why it its this that there have has about any from at by as if just please tell know want need get".split(" "));
  const SYN = {
    price: "cost rate budget charge fee fees expensive cheap affordable quote estimate pricing priced sqft sq ft per square feet package packages rupees inr",
    time: "timeline duration delay late long months month weeks deadline finish handover schedule on-time ontime complete completion",
    warranty: "guarantee guaranteed warranty structural",
    loan: "loans finance financing bank emi mortgage",
    approval: "approvals sanction sanctions permit permits permission permissions bbmp bda plan-approval paperwork",
    address: "location where office studio visit located directions map jayanagar hours timing timings open",
    contact: "phone call number email mail reach whatsapp talk speak contact",
    design: "architect architects designer drawings plan plans vastu revisions changes",
    material: "materials brand brands cement steel quality tiles paint fittings",
    client: "clients customers project projects portfolio work works previous past reference references built homes completed",
    interior: "interiors kitchen wardrobe wardrobes furnishing",
    villa: "villas bungalow luxury",
    commercial: "office offices shop shops retail building",
    apartment: "apartments flats rental rentals units",
    team: "team engineer engineers manager supervision execute execution quality",
    sell: "sell selling sale mandate resale",
  };
  const SYN_INDEX = {};
  for (const [root, words] of Object.entries(SYN)) for (const w of words.split(" ").concat(root)) SYN_INDEX[w] = root;
  const stem = (w) => w.replace(/(ings|ing|ies|es|s|ed)$/, (m) => (w.length > 4 ? (m === "ies" ? "y" : "") : m));
  const tokens = (s) => s.toLowerCase().replace(/₹/g, " price ").replace(/[^a-z0-9+\s-]/g, " ").split(/\s+/)
    .filter((w) => w && !STOP.has(w)).flatMap((w) => { const r = SYN_INDEX[w]; return r ? [stem(w), r] : [stem(w)]; });

  const docs = KB.docs.map((d) => ({ ...d, tt: tokens(d.t), ta: tokens(d.a), tk: tokens(d.k || "") }));
  const df = {};
  for (const d of docs) for (const w of new Set([...d.tt, ...d.ta, ...d.tk])) df[w] = (df[w] || 0) + 1;
  const idf = (w) => Math.log(1 + docs.length / (df[w] || 0.5));
  // Words that appear in almost any question about building; alone they prove nothing
  const GENERIC = new Set("build builds builder house home project construction construct make bengaluru bangalore assurance infra company service work".split(" "));
  // Query terms: the word itself (full weight) plus its synonym group (half weight)
  const qterms = (s) => {
    const m = new Map();
    for (const w of s.toLowerCase().replace(/₹/g, " price ").replace(/[^a-z0-9+\s-]/g, " ").split(/\s+/)) {
      if (!w || STOP.has(w)) continue;
      const st = stem(w), r = SYN_INDEX[w];
      m.set(st, Math.max(m.get(st) || 0, 1));
      if (r && r !== st) m.set(r, Math.max(m.get(r) || 0, 0.5));
    }
    return m;
  };
  const score = (q, d) => {
    let s = 0, specific = false;
    for (const [w, wt] of q) {
      const n = idf(w) * wt;
      if ((d.tt.includes(w) || d.tk.includes(w) || d.ta.includes(w)) && !GENERIC.has(w)) specific = true;
      if (d.tt.includes(w)) s += 2.6 * n;
      if (d.tk.includes(w)) s += 1.4 * n;
      if (d.ta.includes(w)) s += 1 * n;
    }
    return specific ? s / Math.sqrt(1 + d.ta.length / 40) : 0;
  };
  const search = (text) => {
    const q = qterms(text);
    if (!q.size) return [];
    return docs.map((d) => ({ d, s: score(q, d) })).filter((r) => r.s > 2.2).sort((a, b) => b.s - a.s).slice(0, 4);
  };

  // ---------- Intents handled before retrieval ----------
  const packages = () => docs.filter((d) => /package$/.test(d.t));
  const intents = [
    { re: /^(hi|hello|hey|hii+|namaste|good (morning|afternoon|evening))\b/i, run: () => reply(WELCOME.text.replace("Thank you for reaching out! ", "Hello, and welcome! "), { title: WELCOME.title, after: WELCOME.after, link: WELCOME.link, chips: START }) },
    { re: /\b(thank(s| you)|thx|great|awesome|perfect)\b/i, run: () => reply("You're welcome! Anything else I can help with?", { chips: ["Request a call back", "Continue on WhatsApp"] }) },
    { re: /\b(call ?back|call me|callback|speak to (a )?(human|person|someone)|talk to (a )?(human|person|someone)|agent|representative)\b/i, run: () => startLead() },
    { re: /\b(price|prices|pricing|cost|rate|rates|package|packages|per sq|sq ?ft|budget)\b/i, test: (t) => !/essential|signature|luxury/i.test(t), run: () => {
      const p = packages();
      reply("We have three construction packages, all priced per square foot and inclusive of tax:", {
        list: p.map((d) => d.a.split(". ")[0].replace(", inclusive of tax", "")),
        after: "Every package can be tailored, and the price is fixed before we start. Want a free estimate for your plot?",
        link: { href: "index.html#services", label: "Compare packages" },
        chips: ["Request a call back", "What's included in Signature?", "Do you handle approvals & loans?"],
      });
    } },
    { re: /\b(where|address|located|location|office|studio|visit|directions|hours|timings?|open)\b/i, run: () => reply(`Our studio is at ${C.studio}. We're open ${C.hours}.`, { link: { href: MAP, label: "Get directions", ext: true }, chips: ["Request a call back", "Continue on WhatsApp"] }) },
    { re: /\b(phone|number|email|mail|contact|reach you|whatsapp)\b/i, run: () => reply(`You can call us on ${C.phone} or email ${C.email}. We're open ${C.hours}.`, { chips: ["Request a call back", "Continue on WhatsApp"] }) },
  ];

  // ---------- UI ----------
  const START = ["Package prices", "Will my project finish on time?", "Do you handle approvals & loans?", "Show me your past projects", "Where is your office?", "Request a call back"];
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  const root = el("div", "ai-chat");
  root.innerHTML = `
    <button class="ai-launch" type="button" aria-label="Chat with Assurance Infra" aria-expanded="false">
      <img class="i-open" src="assets/img/logo-sunmark-240.png" alt="" width="240" height="127">
      <span class="ai-badge" aria-hidden="true">AI</span>
      <svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <nav class="ai-quick" aria-label="Contact us">
      <a class="ai-q ai-q-mail" href="mailto:support@assuranceinfra.com?subject=Website%20enquiry" aria-label="Email us at support@assuranceinfra.com"><span>Email us</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg></a>
      <a class="ai-q ai-q-wa" href="https://wa.me/917407111999?text=Hello%20Assurance%20Infra%2C%20I%27d%20like%20to%20know%20more." target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"><span>WhatsApp us</span><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.2-.1-.4-.2-.9-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg></a>
    </nav>
    <div class="ai-nudge" hidden><button type="button" class="ai-nudge-x" aria-label="Dismiss">×</button><b>Planning to build?</b> Ask me about prices, approvals or timelines.</div>
    <section class="ai-panel" role="dialog" aria-label="Assurance Infra assistant" hidden>
      <header class="ai-head">
        <img src="assets/img/logo-sunmark-240.png" alt="" width="240" height="127">
        <div><b>Assurance Assistant</b><span><i></i>Online · replies instantly</span></div>
        <a class="ai-wa" target="_blank" rel="noopener" aria-label="Continue on WhatsApp" title="Continue on WhatsApp"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.2-.1-.4-.2-.9-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg></a>
        <button class="ai-x" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </header>
      <div class="ai-log" aria-live="polite"></div>
      <a class="ai-route" target="_blank" rel="noopener" hidden><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg><span><b>Send this chat to our WhatsApp</b><small>+91 74071 11999 · our team replies there</small></span><i aria-hidden="true">→</i></a>
      <form class="ai-input" autocomplete="off">
        <input type="text" name="q" placeholder="Type your question…" aria-label="Your question" maxlength="400">
        <button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/></svg></button>
      </form>
      <p class="ai-foot">Instant answers from our website · a real person on WhatsApp</p>
    </section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const panel = $(".ai-panel"), log = $(".ai-log"), form = $(".ai-input"), input = form.q, launch = $(".ai-launch"), nudge = $(".ai-nudge");

  const waLink = () => {
    const skip = /^(request a call back|continue on whatsapp|send (this|my) .*whatsapp)$/i;
    const qs = state.log.filter((m) => m.who === "me" && !skip.test(m.text)).slice(-10).map((m) => "• " + m.text);
    const lines = ["Hello Assurance Infra, I'm messaging from your website chat."];
    if (state.lead.name) lines.push(`Name: ${state.lead.name}`);
    if (state.lead.phone) lines.push(`Phone: ${state.lead.phone}`);
    if (qs.length) lines.push("", "My questions:", ...qs);
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
  };
  const refreshWa = () => {
    const href = waLink();
    root.querySelectorAll(".ai-wa, .ai-route, .ai-wa-btn").forEach((a) => (a.href = href));
    $(".ai-route").hidden = !state.log.some((m) => m.who === "me");
  };

  const render = (m) => {
    const row = el("div", "ai-msg " + (m.who === "me" ? "me" : "bot"));
    const bubble = el("div", "ai-bubble");
    if (m.title) bubble.appendChild(el("b", "ai-title", m.title));
    bubble.appendChild(el("p", null, m.text));
    if (m.list) { const ul = el("ul"); m.list.forEach((t) => ul.appendChild(el("li", null, t))); bubble.appendChild(ul); }
    if (m.after) bubble.appendChild(el("p", null, m.after));
    if (m.link) { const a = el("a", "ai-link", m.link.label + " →"); a.href = m.link.href; if (m.link.ext) { a.target = "_blank"; a.rel = "noopener"; } bubble.appendChild(a); }
    if (m.wa) { const a = el("a", "ai-wa-btn", m.wa); a.target = "_blank"; a.rel = "noopener"; a.href = waLink(); bubble.appendChild(a); }
    row.appendChild(bubble);
    log.appendChild(row);
    if (m.chips && m.chips.length) {
      const chips = el("div", "ai-chips");
      m.chips.forEach((c) => { const b = el("button", null, c); b.type = "button"; b.addEventListener("click", () => ask(c)); chips.appendChild(b); });
      log.appendChild(chips);
    }
    log.scrollTop = log.scrollHeight;
  };
  const push = (m) => { log.querySelectorAll(".ai-chips").forEach((c) => c.remove()); state.log.push(m); state.log = state.log.slice(-40); save(); render(m); refreshWa(); };

  let typing = null;
  const reply = (text, opts = {}) => {
    if (!typing) { typing = el("div", "ai-msg bot ai-typing"); typing.innerHTML = '<div class="ai-bubble"><span></span><span></span><span></span></div>'; log.appendChild(typing); log.scrollTop = log.scrollHeight; }
    setTimeout(() => { if (typing) { typing.remove(); typing = null; } push({ who: "bot", text, ...opts }); }, 420 + Math.min(text.length * 4, 600));
  };

  // ---------- Forward to the team's WhatsApp (server function; silent if unavailable) ----------
  const notify = (payload) => {
    try {
      fetch("/api/notify", {
        method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
        body: JSON.stringify({ ...payload, sid: state.sid, page: location.pathname, name: state.lead.name || "", phone: state.lead.phone || "" }),
      }).catch(() => {});
    } catch (e) {}
  };

  // ---------- Lead capture ----------
  const startLead = () => {
    if (state.lead.phone) return reply(`We already have your number (${state.lead.phone}). A senior consultant will call you within one working day.`, { chips: ["Continue on WhatsApp"] });
    state.step = "name"; save();
    reply("Happy to arrange a call back from a senior consultant. What's your name?");
  };
  const leadStep = (text) => {
    if (state.step === "name") {
      state.lead.name = text.slice(0, 60); state.step = "phone"; save();
      return reply(`Thanks, ${state.lead.name.split(" ")[0]}. What's the best phone number to reach you on?`);
    }
    if (state.step === "phone") {
      const digits = text.replace(/[^\d+]/g, "");
      if (digits.replace(/\D/g, "").length < 10) return reply("That doesn't look like a full phone number — could you check it? (10 digits, e.g. 98765 43210)");
      state.lead.phone = digits; state.step = null; save();
      notify({ type: "lead" });
      return reply(`Thanks — please tap below to send your details to our team on WhatsApp, and we'll call ${state.lead.phone} within one working day (${C.hours}).`, { wa: "Send my call-back request", chips: ["Package prices", "Show me your past projects"] });
    }
  };

  // ---------- Answering ----------
  const answer = (text) => {
    if (state.step) return leadStep(text);
    if (/continue on whatsapp/i.test(text)) { window.open(waLink(), "_blank", "noopener"); return reply("I've opened WhatsApp with our conversation — just press send and our team will take it from there."); }
    if (/past projects|your work|portfolio/i.test(text)) return reply("We've completed 240+ projects across Bengaluru, with 50+ ongoing — independent homes, villas, apartment blocks and commercial buildings.", { link: { href: "clients.html#works", label: "See our clients & works" }, chips: ["Package prices", "Request a call back"] });
    for (const it of intents) if (it.re.test(text) && (!it.test || it.test(text))) return it.run();
    const hits = search(text);
    if (!hits.length) {
      return reply("That's a good question for our team — the answer isn't on our website yet.", {
        after: "Send it to us on WhatsApp and a consultant will reply to you there, or ask for a call back.", wa: "Send my question on WhatsApp", chips: ["Request a call back"],
      });
    }
    const top = hits[0].d;
    const here = location.pathname.split("/").pop() || "index.html";
    const related = hits.slice(1).filter((h) => h.s > hits[0].s * 0.55 && h.d.t !== top.t).slice(0, 2).map((h) => h.d.t.replace(/\.$/, "") + (/\?$/.test(h.d.t) ? "" : "?"));
    reply(top.a, {
      title: /\?$/.test(top.t) || top.t.length > 60 ? null : top.t.replace(/\.$/, ""),
      link: top.u.split("#")[0] !== here ? { href: top.u, label: "Learn more" } : null,
      chips: related.length ? related : ["Request a call back", "Package prices"],
    });
  };

  const ask = (raw) => {
    const text = String(raw).trim().slice(0, 400);
    if (!text) return;
    push({ who: "me", text });
    if (!state.step && !/^(request a call back|continue on whatsapp)$/i.test(text)) notify({ type: "question", q: text });
    answer(text);
  };

  // ---------- Open / close ----------
  const setOpen = (open) => {
    state.open = open; save();
    panel.hidden = !open; root.classList.toggle("is-open", open);
    launch.setAttribute("aria-expanded", String(open));
    nudge.hidden = true;
    if (open) {
      if (!state.log.length) push({ who: "bot", ...WELCOME, chips: START });
      setTimeout(() => input.focus(), 60);
      log.scrollTop = log.scrollHeight;
    }
  };
  launch.addEventListener("click", () => setOpen(panel.hidden));
  $(".ai-x").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); launch.focus(); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });
  $(".ai-nudge-x").addEventListener("click", () => { nudge.hidden = true; store.set("ai-nudged", 1); });
  nudge.addEventListener("click", (e) => { if (!e.target.closest(".ai-nudge-x")) setOpen(true); });

  // Restore the conversation across pages
  state.log.forEach(render);
  log.querySelectorAll(".ai-chips").forEach((c, i, all) => { if (i < all.length - 1) c.remove(); });
  refreshWa();
  if (state.open) setOpen(true);
  else if (!store.get("ai-nudged", 0)) setTimeout(() => { if (panel.hidden) { nudge.hidden = false; store.set("ai-nudged", 1); } }, 9000);

  window.AIChat = { ask, search, open: () => setOpen(true) };
})();
