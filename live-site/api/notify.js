// Vercel serverless function: forwards chatbot questions and call-back requests
// to the sales team's WhatsApp using the free CallMeBot API.
//
// Setup (once): from the WhatsApp number that should receive messages, follow
// https://www.callmebot.com/blog/free-api-whatsapp-messages/ to get an API key,
// then add these environment variables to the Vercel project and redeploy:
//   CALLMEBOT_PHONE   e.g. 917407111999   (the receiving number, with country code)
//   CALLMEBOT_APIKEY  the key CallMeBot sends you
// Without them the function accepts requests and does nothing, so the site never breaks.

const ALLOWED = /^(https?:\/\/)?((www\.)?assuranceinfra\.com|assurance-infra[\w-]*\.vercel\.app|localhost(:\d+)?)$/i;
const hits = new Map(); // per-instance rate limit: ip -> [timestamps]

const clean = (v, n) => String(v || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const origin = (req.headers.origin || req.headers.referer || "").replace(/^(https?:\/\/[^/]+).*$/, "$1");
  if (!ALLOWED.test(origin)) return res.status(403).json({ ok: false });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0] || "anon";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 15) return res.status(429).json({ ok: false });
  recent.push(now);
  hits.set(ip, recent);

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const type = body.type === "lead" ? "lead" : "question";
  const q = clean(body.q, 400);
  const name = clean(body.name, 60);
  const phone = clean(body.phone, 20).replace(/[^\d+]/g, "");
  const page = clean(body.page, 60);
  const sid = clean(body.sid, 12);
  if (type === "question" && !q) return res.status(400).json({ ok: false });

  const lines = type === "lead"
    ? ["📞 Call-back request (website chat)", `Name: ${name || "—"}`, `Phone: ${phone || "—"}`]
    : ["💬 Website chat question", `“${q}”`, ...(name || phone ? [`From: ${[name, phone].filter(Boolean).join(" · ")}`] : [])];
  lines.push(`Page: ${page || "/"} · Chat #${sid || "—"}`);

  const { CALLMEBOT_PHONE, CALLMEBOT_APIKEY } = process.env;
  if (!CALLMEBOT_PHONE || !CALLMEBOT_APIKEY) return res.status(202).json({ ok: true, forwarded: false });

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(CALLMEBOT_PHONE)}&text=${encodeURIComponent(lines.join("\n"))}&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.status(200).json({ ok: r.ok, forwarded: r.ok });
  } catch (e) {
    return res.status(200).json({ ok: false, forwarded: false });
  }
};
