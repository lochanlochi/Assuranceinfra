import { writeFile } from "node:fs/promises";
const out = [], miss = [];
const codes = [];
for (let p = 560001; p <= 560300; p++) codes.push(p);
for (let p = 562100; p <= 562170; p++) codes.push(p);
for (const p of codes) {
  let data;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { data = await (await fetch(`https://api.postalpincode.in/pincode/${p}`, { signal: AbortSignal.timeout(15000) })).json(); break; }
    catch { await new Promise(r => setTimeout(r, 1000)); }
  }
  const pos = data?.[0]?.PostOffice;
  if (!pos) { miss.push(p); continue; }
  for (const po of pos) {
    if (!/bangalore|bengaluru/i.test(po.District)) continue;
    out.push({ name: po.Name, pin: po.Pincode, district: po.District, block: po.Block, type: po.BranchType });
  }
}
await writeFile(process.argv[2], JSON.stringify(out, null, 1));
console.log("post offices:", out.length, "| pincodes with none/failed:", miss.length);
