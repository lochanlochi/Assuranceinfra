// Site copy, taken from assurancedevelopers.com. Edit here to change the website.

export const company = {
  name: "Assurance Infra",
  tagline: "Home construction in Bangalore",
  intro:
    "We design and build custom homes on your plot, from approvals to handover, with a fixed quotation, premium materials and real-time updates at every stage.",
  phone: "+91 98446 68585",
  email: "contact@assurancedevelopers.com",
  address:
    "56/1, Sri Krishna Towers, 9th Main Rd, above Dhanalakshmi Bank, 4th Block, Jayanagar, Bengaluru, Karnataka 560041",
  // Digits only, with country code, for the WhatsApp chat link.
  whatsapp: "919844668585",
  // Path to a PDF in /public (e.g. "/brochure.pdf"), or null to hide the download.
  brochureUrl: null as string | null,
};

export const stats = [
  { value: "240+", label: "Homes completed" },
  { value: "50+", label: "Projects ongoing" },
  { value: "10 yr", label: "Structural warranty" },
];

export const process = [
  { title: "Consultation & planning", body: "Free consultation and site evaluation of your plot." },
  { title: "Design & approvals", body: "Custom designs, plan approvals and a detailed cost estimate." },
  { title: "Construction & monitoring", body: "A dedicated team with real-time project tracking." },
  { title: "Handover & quality check", body: "Timely delivery, backed by a 10-year structural warranty." },
];

export type Package = {
  name: string;
  pricePerSqFt: number;
  pitch: string;
  features: string[];
  recommended?: boolean;
};

export const packages: Package[] = [
  {
    name: "Essential",
    pricePerSqFt: 1879,
    pitch: "Smart essentials for practical living. Built strong, built simple.",
    features: ["Ideal for rental homes", "Low-range features", "Simple construction", "Robust, cost-effective homes"],
  },
  {
    name: "Signature",
    pricePerSqFt: 2099,
    pitch: "A balance of style and substance, the perfect upgrade for modern living.",
    features: ["Versatile choices", "Mid-range features", "Elevated construction", "High-quality finishes"],
    recommended: true,
  },
  {
    name: "Luxury",
    pricePerSqFt: 2499,
    pitch: "Crafted for those who seek elegance, comfort and standout design.",
    features: ["Versatile choices", "High-range features", "Elegant, bespoke living", "Exclusive features"],
  },
];

export type Project = {
  location: string;
  floors: string;
  beds: number;
  baths: number;
  areaSqFt: number;
};

export const projects: Project[] = [
  { location: "Whitefield", floors: "G + 4", beds: 12, baths: 12, areaSqFt: 11250 },
  { location: "JP Nagar 7th Phase", floors: "G + 3", beds: 4, baths: 4, areaSqFt: 12800 },
  { location: "Vakil Garden", floors: "G + 3", beds: 8, baths: 6, areaSqFt: 12000 },
  { location: "Yelahanka", floors: "G + 4", beds: 12, baths: 12, areaSqFt: 11250 },
  { location: "Banashankari", floors: "G + 3", beds: 4, baths: 4, areaSqFt: 7200 },
  { location: "JP Nagar Phase 2", floors: "G + 3", beds: 4, baths: 4, areaSqFt: 4715 },
  { location: "Harlur", floors: "G + 3", beds: 4, baths: 4, areaSqFt: 4500 },
  { location: "Kanakapura Road", floors: "G + 2", beds: 4, baths: 4, areaSqFt: 4100 },
  { location: "Viveknagar", floors: "G + 3", beds: 4, baths: 4, areaSqFt: 2400 },
];

export const strengths = [
  {
    title: "Process-driven execution",
    body: "Systematic planning, tracking and real-time updates for seamless project delivery.",
  },
  {
    title: "High-grade materials",
    body: "Only premium brands for cement, steel and finishes, so you get exactly what was promised.",
  },
  {
    title: "Advanced design & engineering",
    body: "Structural engineering built for safety, utility and long-term performance.",
  },
  {
    title: "Transparent quotation",
    body: "The right price agreed before work starts, with a clear agreement and no surprise charges.",
  },
];

export const testimonials = [
  {
    name: "Divitha Reddy",
    quote:
      "Got my dream home completed on time. Mr Rakshith understood our needs, followed vastu and used the space exceptionally well. A professional team with good coordination.",
  },
  {
    name: "Ketki Mhasawade",
    quote: "They built my 2BHK house at JP Nagar and did a fabulous job. The process was quick and hassle-free.",
  },
  {
    name: "Manjunath Guntur",
    quote:
      "Affordable pricing, great designs and hassle-free service, from plan approvals and permissions to the bank loan. Timely updates at every stage.",
  },
  {
    name: "Boby Thomas",
    quote: "They built a 1BHK rental unit over my house, quickly and efficiently.",
  },
];

export const interestOptions = [
  "Building a new home",
  "Rental / multi-unit building",
  "Luxury villa",
  "Commercial building",
  "Interiors",
  "Get the brochure",
  "Other",
] as const;
