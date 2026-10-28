// Build the Bangalore area list from India Post data plus common locality names.
// Usage: node build-areas.mjs raw.json out.json
import { readFile, writeFile } from "node:fs/promises";
const raw = JSON.parse(await readFile(process.argv[2], "utf8"));
const validPins = new Set(raw.map((x) => x.pin));

const DROP = /^(Bangalore|CMM Court Complex|HighCourt|Legislators Home|Vidhana Soudha|Rajbhavan|Bangalore Sub Foreign Post|Bangalore Dist Offices Bldg|Bangalore Corporation Building|Training Command IAF|Air Force Hospital|CMP Centre And School|Governmemnt Electric Factory|Dharmaram College|St\. John.s Medical College|Arabic College|Science Institute|NAL|Msrit|Bnagalore Viswavidalaya|Wipro Limited|ISRO Anthariksha Bhavan|A F Station Yelahanka|BSF Campus Yelahanka|CRPF Campus Yelahanka|Swimming Pool Extn|Sri Chowdeshwari|Viswaneedam|Industrial Estate|State Bank Of Mysore Colony|Bangalore Bazaar|Museum Road|Jalavayuvihar|Virgonagar|Rv Niketan)\b/i;
const RENAME = {
  "Jayangar III Block": "Jayanagar 3rd Block", "Jayangar East S.O": "Jayanagar East", "Jayangar East": "Jayanagar East",
  "B Sk II Stage": "Banashankari 2nd Stage", "Banashankari III Stage": "Banashankari 3rd Stage", "J P Nagar": "JP Nagar",
  "JP Nagar III Phase": "JP Nagar 3rd Phase", "JP Nagar VIII phase": "JP Nagar 8th Phase", "R T Nagar": "RT Nagar",
  "J.C.Nagar": "JC Nagar", "K. G. Road": "KG Road", "H.A.L II Stage": "HAL 2nd Stage", "Mahatma Gandhi Road": "MG Road",
  "C.V.Raman Nagar": "CV Raman Nagar", "H.K.P. Road": "HKP Road", "H.A. Farm": "Hebbal Agricultural Farm",
  "K H B Colony": "KHB Colony", "R.M.V. Extension II Stage": "RMV 2nd Stage", "Koramangala VI Bk": "Koramangala 6th Block",
  "Koramangala I Block": "Koramangala 1st Block", "Rajajinagar IVth Block": "Rajajinagar 4th Block", "Yeswanthpura": "Yeshwanthpur",
  "Yeshwanthpur Bazar": "Yeshwanthpur Bazaar", "Kadugodi Extention": "Kadugodi Extension", "Krishnarajapuram R S": "KR Puram Railway Station",
  "Bangalore City": "Bangalore City (Majestic)", "Electronics City": "Electronic City", "Dasarahalli(Srinagar)": "Dasarahalli (Srinagar)",
  "Rajarajeshwarinagar": "Rajarajeshwari Nagar", "Rameshnagar": "Ramesh Nagar", "Sahakaranagar": "Sahakara Nagar",
  "Vasanthnagar": "Vasanth Nagar", "Vasanthanagar": "Vasanth Nagar", "Kalyananagar": "Kalyan Nagar", "Thyagarajnagar": "Thyagaraja Nagar",
  "Tyagrajnagar": "Thyagaraja Nagar", "Padmanabhnagar": "Padmanabhanagar", "Jeevanbhimanagar": "Jeevan Bhima Nagar",
  "Sampangiramnagar": "Sampangi Rama Nagar", "Anandnagar": "Anand Nagar", "Ashoknagar": "Ashok Nagar", "Chamrajpet": "Chamarajpet",
  "Doorvaninagar": "Dooravani Nagar", "Nandinilayout": "Nandini Layout", "Chandra Lay Out": "Chandra Layout",
  "Ullalu Upanagar": "Ullal Upanagar", "Bangalore International Airport": "Kempegowda International Airport",
  "P&T Col. Kavalbyrasandra": "Kaval Byrasandra", "Mahalakshmipuram Layout": "Mahalakshmi Layout",
  "West of Chord Road II stage": "West of Chord Road 2nd Stage", "Hulsur Bazaar": "Ulsoor (Halasuru)", "Shanthinagar": "Shanti Nagar",
  "Viveknagar": "Vivek Nagar", "Indiranagar": "Indiranagar", "Vijayanagar": "Vijayanagar",
};
const tidy = (s) => {
  s = s.trim().replace(/\s*\((Bangalore|Bengaluru)\)\s*$/i, "").replace(/\s+S\.?O\.?$/i, "").replace(/\s+/g, " ");
  return RENAME[s] || s;
};

const areas = new Map(); // "name|pin" -> {n, p, a}
const add = (n, p, alias = "") => {
  if (!validPins.has(p)) throw new Error(`Unknown pincode ${p} for ${n}`);
  const key = n.toLowerCase() + "|" + p;
  const cur = areas.get(key);
  if (cur) { if (alias) cur.a = [cur.a, alias].filter(Boolean).join(" "); return; }
  areas.set(key, { n, p, a: alias });
};
for (const x of raw) {
  const original = x.name.trim().replace(/\s*\((Bangalore|Bengaluru)\)\s*$/i, "");
  if (DROP.test(original) && original !== "Bangalore City") continue;
  add(tidy(x.name), x.pin);
}

// Common locality names that aren't post office names, mapped to their official pincode.
const COMMON = [
  ["HSR Layout", "560102", "hsr sector"], ["Haralur Road", "560102", "harlur"], ["Sarjapur Road", "560035", "sarjapura road"],
  ["Kasavanahalli", "560035"], ["Marathahalli", "560037"], ["Brookefield", "560037"], ["ITPL", "560066", "whitefield"],
  ["KR Puram", "560036", "krishnarajapuram k r puram"], ["Hebbal", "560024"],
  ["Electronic City Phase 1", "560100", "ecity e-city"], ["Electronic City Phase 2", "560100", "ecity e-city"],
  ["BTM Layout 1st Stage", "560029", "btm"], ["BTM Layout 2nd Stage", "560076", "btm"],
  ["JP Nagar 1st Phase", "560078", "jayaprakash nagar"], ["JP Nagar 2nd Phase", "560078", "jayaprakash nagar"],
  ["JP Nagar 4th Phase", "560078", "jayaprakash nagar"], ["JP Nagar 5th Phase", "560078", "jayaprakash nagar"],
  ["JP Nagar 6th Phase", "560078", "jayaprakash nagar"], ["JP Nagar 7th Phase", "560078", "jayaprakash nagar"],
  ["JP Nagar 9th Phase", "560062", "jayaprakash nagar"], ["Uttarahalli", "560061"], ["Kengeri", "560060"],
  ["Kengeri Satellite Town", "560060"], ["Arekere", "560076"], ["Kudlu Gate", "560068"], ["Singasandra", "560068"],
  ["Hongasandra", "560068"], ["Akshayanagar", "560068", "akshaya nagar"], ["Old Airport Road", "560017"],
  ["Murugeshpalya", "560017"], ["Kaggadasapura", "560093"], ["HRBR Layout", "560043"], ["HBR Layout", "560043"],
  ["Hennur", "560043"], ["Thanisandra", "560077"], ["Hegde Nagar", "560077"], ["Malleshwaram", "560003", "malleswaram"],
  ["Frazer Town", "560005", "fraser town"], ["Cox Town", "560005"], ["Cooke Town", "560084"], ["Kammanahalli", "560084"],
  ["Shivajinagar", "560051"], ["Ejipura", "560047"], ["Jayanagar 4th Block", "560011"], ["Jayanagar 9th Block", "560069"],
  ["Koramangala 4th Block", "560034"], ["Koramangala 5th Block", "560095"], ["Koramangala 8th Block", "560095"],
  ["Peenya", "560058"], ["Kanakapura Road", "560062"], ["Talaghattapura", "560109", "thalaghattapura"],
  ["Hebbagodi", "560099"], ["Bommasandra", "560099"], ["Budigere Cross", "560049"], ["Thindlu", "560097"],
  ["Yelahanka New Town", "560064"], ["Devanahalli", "562110"], ["Hoskote", "562114"], ["Nelamangala", "562123"],
  ["Mysore Road", "560026"], ["Tumkur Road", "560022"], ["Hosur Road", "560068"], ["Ulsoor", "560008", "halasuru"],
  ["Madiwala", "560068", "madivala"], ["Varthur", "560087", "vartur"], ["Sarjapura", "562125", "sarjapur"],
  ["Rajarajeshwari Nagar", "560098", "rr nagar"], ["Banashankari", "560050", "bsk"],
];
for (const [n, p, a] of COMMON) add(n, p, a || "");

// Alternate spellings for official names
const ALIAS = {
  "Malleswaram": "malleshwaram", "Krishnarajapuram": "kr puram k r puram", "Banashankari": "bsk", "Koramangala": "kormangala",
  "Yeshwanthpur": "yesvantpur yeshwantpur", "Thyagaraja Nagar": "tyagaraja t nagar", "Ulsoor (Halasuru)": "halasuru ulsoor",
  "Bangalore City (Majestic)": "majestic kempegowda bus stand", "Vartur": "varthur", "Madivala": "madiwala",
  "Kempegowda International Airport": "kia devanahalli airport",
};
for (const v of areas.values()) if (ALIAS[v.n]) v.a = [v.a, ALIAS[v.n]].filter(Boolean).join(" ");

const list = [...areas.values()].sort((a, b) => a.n.localeCompare(b.n) || a.p.localeCompare(b.p));
await writeFile(process.argv[3], JSON.stringify(list.map((x) => (x.a ? [x.n, x.p, x.a] : [x.n, x.p]))));
console.log("areas:", list.length, "pincodes:", new Set(list.map((x) => x.p)).size);
