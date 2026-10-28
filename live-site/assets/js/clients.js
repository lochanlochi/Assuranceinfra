/* Client register — sourced from assurancedevelopers.com/our-projects */
(function () {
  const P = "assets/img/projects/";

  // Named client commissions
  const clients = [
    { name: "Mr. Golden Singh", title: "Golden Singh Residence", kind: "residence", where: "Vakil Garden", spec: ["G + 3", "12,000 sq ft", "8 Beds"], img: "golden-singh" },
    { name: "Mr. Rakshith", title: "Vaibhav Enclave — Rakshith", kind: "apartment", where: "Whitefield", spec: ["G + 4", "11,250 sq ft", "12 Units"], img: "rakshith" },
    { name: "Mr. Jayaramaiah", title: "Jayaramaiah Residence", kind: "residence", where: "JP Nagar 7th Phase", spec: ["G + 3", "12,800 sq ft", "4 Beds"], img: "jayaramaiah" },
    { name: "Mr. Abilash", title: "Abilash Residence", kind: "residence", where: "Banashankari", spec: ["G + 3", "7,200 sq ft", "4 Beds"], img: "abilash" },
    { name: "Mr. Arvind", title: "Arvind Residence", kind: "residence", where: "Harlur", spec: ["G + 3", "4,500 sq ft", "4 Beds"], img: "arvind" },
    { name: "Mr. Ashok", title: "Ashok Residence", kind: "residence", where: "JP Nagar 2nd Phase", spec: ["G + 3", "4,715 sq ft", "4 Beds"], img: "ashok" },
    { name: "Mr. Sudhir", title: "Sudhir Residence", kind: "residence", where: "Kanakapura Road", spec: ["G + 2", "4,100 sq ft", "4 Beds"], img: "sudhir" },
    { name: "Ms. Usha", title: "Usha Residence", kind: "residence", where: "Viveknagar", spec: ["G + 3", "2,400 sq ft", "4 Beds"], img: "usha" },
    { name: "Vaibhav Enclave", title: "Vaibhav Enclave", kind: "apartment", where: "Bengaluru", spec: ["Apartment block"], img: "vaibhav-enclave" },
    { name: "BCCHS", title: "BCCHS Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "bcchs-residence" },
    { name: "Mr. Abhijeet Sharma", title: "Abhijeet Sharma's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "abhijeet-sharma" },
    { name: "Ms. Thushara", title: "Thushara's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "thushara" },
    { name: "Mr. Deepankar", title: "Deepankar's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "deepankar" },
    { name: "Mr. Praveen", title: "Praveen's Apartment", kind: "apartment", where: "Bengaluru", spec: ["Apartment block"], img: "praveen" },
    { name: "Mrs. Bharani", title: "Bharani's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "bharani" },
    { name: "Mrs. Valarmathy", title: "Valarmathy Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "valarmathy" },
    { name: "Mr. M. Y. Anand", title: "M. Y. Anand's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "my-anand" },
    { name: "Mr. Narayana Reddy", title: "Narayana Reddy's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "narayana-reddy" },
    { name: "Mr. Niladri Paul", title: "Niladri Paul's Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "niladri-paul" },
    { name: "Mr. Krishna Prasad", title: "Krishna Prasad Residence", kind: "residence", where: "Bengaluru", spec: ["Independent home"], img: "krishna-prasad" },
    { name: "Mr. Chirag", title: "Chirag's Commercial", kind: "commercial", where: "Bengaluru", spec: ["Commercial building"], img: "chirag" },
  ];

  // Site-by-site portfolio across Bengaluru
  const sites = [
    { name: "Bannerghatta Road", tag: "Residence", img: "bannerghatta-road" },
    { name: "Ejipura", tag: "Residence", img: "ejipura" },
    { name: "Jayanagar 9th Block", tag: "Residence", img: "jayanagar-9th-block" },
    { name: "Jigani", tag: "Residence", img: "jigani" },
    { name: "Kothanur, JP Nagar", tag: "Residence", img: "kothanur" },
    { name: "Hoodi, Whitefield", tag: "Residence", img: "hoodi" },
    { name: "JP Nagar 7th Phase", tag: "Villa", img: "jp-nagar-7-villa" },
    { name: "Koramangala", tag: "Residence", img: "koramangala" },
    { name: "Gottigere", tag: "Residence", img: "gottigere" },
    { name: "Gottigere II", tag: "Residence", img: "gottigere-2" },
    { name: "Sarjapura, Thindlu", tag: "Independent house", img: "sarjapura-thindlu" },
    { name: "Konanakunte, Sarathy Nagar", tag: "Residence", img: "konanakunte" },
    { name: "Bannerghatta Road II", tag: "Residence", img: "bannerghatta-road-2" },
    { name: "Anjanapura 10th Block", tag: "Residence", img: "anjanapura-10th" },
    { name: "Akshaynagar, Begur", tag: "Residence", img: "akshaynagar" },
    { name: "JP Nagar 9th Phase", tag: "Residence", img: "jp-nagar-9" },
    { name: "JP Nagar 8th Phase", tag: "Residence", img: "jp-nagar-8" },
    { name: "JP Nagar 7th Phase", tag: "Residence", img: "jp-nagar-7" },
    { name: "Krishna Nagar, JP Nagar", tag: "Residence", img: "krishna-nagar" },
    { name: "Sarjapur Road", tag: "Under construction", img: "ongoing-sarjapur", ongoing: true },
    { name: "BSK 6th Stage", tag: "Under construction", img: "ongoing-bsk", ongoing: true },
    { name: "Anjanapura 2nd Block", tag: "Under construction", img: "ongoing-anjanapura", ongoing: true },
  ];

  const kindLabel = { residence: "Private Residence", apartment: "Apartment", commercial: "Commercial" };
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const grid = document.getElementById("client-grid");
  const filters = document.getElementById("client-filters");
  const count = document.getElementById("client-count");

  function renderClients(filter) {
    const list = clients.map((c, i) => ({ ...c, no: i + 1 })).filter((c) => filter === "all" || c.kind === filter);
    grid.innerHTML = list.map((c, i) => `
      <article class="client" style="animation-delay:${Math.min(i, 8) * 60}ms">
        <div class="ph">
          <img src="${P}${c.img}.jpg" alt="${esc(c.title)}, ${esc(c.where)}" loading="lazy" width="394" height="362">
          <span class="no">Nº ${pad(c.no)}</span>
        </div>
        <div class="body">
          <span class="kind">${kindLabel[c.kind]}</span>
          <h3>${esc(c.title)}</h3>
          <span class="where">${esc(c.where)}</span>
          <span class="spec">${c.spec.map((x) => `<span>${esc(x)}</span>`).join("")}</span>
        </div>
      </article>`).join("");
    count.textContent = `${pad(list.length)} of ${pad(clients.length)} commissions`;
  }

  if (grid && filters) {
    const kinds = ["all", "residence", "apartment", "commercial"];
    const names = { all: "All", residence: "Residences", apartment: "Apartments", commercial: "Commercial" };
    filters.innerHTML = kinds.map((k) => {
      const n = k === "all" ? clients.length : clients.filter((c) => c.kind === k).length;
      return `<button type="button" data-filter="${k}" aria-pressed="${k === "all"}">${names[k]}<i>${n}</i></button>`;
    }).join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderClients(b.dataset.filter);
    });
    renderClients("all");
  }

  const siteGrid = document.getElementById("site-grid");
  if (siteGrid) {
    siteGrid.innerHTML = sites.map((s) => `
      <figure class="site reveal">
        <img src="${P}${s.img}.jpg" alt="${esc(s.tag)} at ${esc(s.name)}" loading="lazy">
        ${s.ongoing ? '<span class="status">Ongoing</span>' : ""}
        <figcaption><span>${esc(s.tag)}</span><b>${esc(s.name)}</b></figcaption>
      </figure>`).join("") +
      `<a class="site site-next reveal" href="contact.html"><span class="eyebrow">Nº ${pad(sites.length + 1)}</span><b>Your plot could be next.</b><span class="link-arrow">Book a free site visit</span></a>`;
    siteGrid.querySelectorAll(".reveal").forEach((el) => window.AI && window.AI.watch(el));
  }
})();
