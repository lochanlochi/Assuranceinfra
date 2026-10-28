// Site copy and project listings. Everything here is placeholder content:
// replace it with Assurance Infra's real details before going live.

export const company = {
  name: "Assurance Infra",
  tagline: "Homes and spaces built to be trusted",
  intro:
    "We plan, build and deliver residential and commercial projects with transparent pricing, clear timelines and quality you can inspect at every stage.",
  phone: "+91 00000 00000",
  email: "info@example.com",
  address: "Office address, City, State",
};

export const stats = [
  { value: "10+", label: "Years building" },
  { value: "25+", label: "Projects delivered" },
  { value: "1,500+", label: "Families housed" },
];

export type ProjectStatus = "Ongoing" | "Completed" | "Upcoming";

export type Project = {
  name: string;
  location: string;
  type: string;
  status: ProjectStatus;
  summary: string;
};

export const projects: Project[] = [
  {
    name: "Project One",
    location: "Location A",
    type: "2 & 3 BHK apartments",
    status: "Ongoing",
    summary: "Mid-rise residences with clubhouse, landscaped courtyard and covered parking.",
  },
  {
    name: "Project Two",
    location: "Location B",
    type: "Villa plots",
    status: "Upcoming",
    summary: "Gated plotted development with internal roads, power and water ready on handover.",
  },
  {
    name: "Project Three",
    location: "Location C",
    type: "Commercial spaces",
    status: "Completed",
    summary: "Retail and office units on a main road frontage, delivered on schedule.",
  },
];

export const strengths = [
  {
    title: "Clear approvals",
    body: "Every project is launched with its approvals in place, and documents are shared before you book.",
  },
  {
    title: "Fixed payment schedules",
    body: "Construction-linked payments with no surprise charges added after booking.",
  },
  {
    title: "Site visits any week",
    body: "See progress for yourself. Our team walks you through the site and answers questions on the spot.",
  },
  {
    title: "After-handover support",
    body: "A dedicated contact for snags, documentation and society formation after you move in.",
  },
];

export const interestOptions = ["Buying a home", "Buying a plot", "Commercial space", "Other"] as const;
