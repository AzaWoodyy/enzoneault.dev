import type { BrandIconName } from "~/app/brand-icon";

export const profile = {
  name: "Enzo Neault",
  role: "Développeur",
  location: "Annecy, France",
  coordinates: "45.8992° N, 6.1294° E",
  timezone: "GMT+1",
} as const;

// The intro sentence, each technology wearing a small brand sticker.
export const intro: readonly { text: string; icon?: BrandIconName }[] = [
  { text: "Développeur depuis 2022, je construis des applications de bout en bout : le back avec " },
  { text: "Laravel", icon: "laravel" },
  { text: " et " },
  { text: "FastAPI", icon: "fastapi" },
  { text: ", le front avec " },
  { text: "React", icon: "react" },
  { text: " et " },
  { text: "Vue", icon: "vue" },
  { text: ", le natif avec " },
  { text: "React Native", icon: "react" },
  { text: " et " },
  { text: "Tauri", icon: "tauri" },
  { text: ", le déploiement sur " },
  { text: "Kubernetes", icon: "kubernetes" },
  { text: "." },
];

export type TimelineEntry = {
  period: string;
  title: string;
  place: string;
  note?: string;
  details: readonly string[];
  stack?: readonly string[];
};

export const experience: readonly TimelineEntry[] = [
  {
    period: "2023 — auj.",
    title: "Développeur",
    place: "Web Expert Business (Miliboo)",
    note: "CDI",
    details: [
      "Microservice SAV avec Kafka",
      "Prévision de la demande (DRP) en Python",
      "Application native en Rust",
      "Agents IA avec LangGraph",
      "Déploiement Kubernetes avec FluxCD",
    ],
    stack: ["Laravel", "Symfony", "FastAPI", "NestJS", "React", "Vue"],
  },
  {
    period: "2022 — 2023",
    title: "Développeur",
    place: "Web Expert Business",
    note: "Alternance, 10 mois",
    details: ["Application de gestion de stock", "Mobile en React Native", "Web en Laravel"],
  },
  {
    period: "2022",
    title: "Développeur mobile",
    place: "Alyseo",
    note: "Stage puis CDD, 5 mois",
    details: ["Intégration de maquettes", "Développement React Native"],
  },
];

export const education: readonly TimelineEntry[] = [
  {
    period: "2022 — 2023",
    title: "Licence pro DIM",
    place: "Université Savoie Mont Blanc, Annecy",
    details: ["Jeu en C#", "Projets collaboratifs", "Déploiement cloud"],
  },
  {
    period: "2020 — 2022",
    title: "DUT Informatique",
    place: "Université de La Rochelle",
    details: ["Logiciel en C++", "Web avec Symfony"],
  },
  {
    period: "2019 — 2020",
    title: "Prépa intégrée, 1re année",
    place: "ISEN Nantes",
    details: ["Maths et physique", "Algorithmique C/C++", "Web avec Angular"],
  },
];

export const tools = [
  "Laravel",
  "Symfony",
  "FastAPI",
  "NestJS",
  "React",
  "Vue",
  "Next.js",
  "React Native",
  "Rust",
  "LangGraph",
  "Kafka",
  "Docker",
  "Kubernetes",
  "FluxCD",
  "MariaDB",
  "PostgreSQL",
  "Tauri",
] as const;

export const languages = ["Français, natif", "Anglais, TOEIC 900"] as const;

export type Project = {
  name: string;
  description: string;
  stack: string;
  href: string;
};

export const projects: readonly Project[] = [
  {
    name: "homelab-ai",
    description: "Serveur IA auto-hébergé sur un PC : LLM locaux, voix hors ligne et dashboard sécurisé via Tailscale.",
    stack: "PowerShell · React · Ollama",
    href: "https://github.com/AzaWoodyy/homelab-ai",
  },
  {
    name: "WorkBridge",
    description: "Une app de bureau locale qui réunit la planification de GitLab, ClickUp et Rocket.Chat.",
    stack: "Electron · TypeScript",
    href: "https://github.com/AzaWoodyy/WorkBridge",
  },
  {
    name: "x-karakeep-sync",
    description: "Archive automatiquement mes favoris X dans Karakeep, sans jamais rien supprimer.",
    stack: "JavaScript · API X",
    href: "https://github.com/AzaWoodyy/x-karakeep-sync",
  },
  {
    name: "enzoneault.dev",
    description: "Mon site personnel et CV en ligne.",
    stack: "Next.js 16 · Bun",
    href: "https://github.com/AzaWoodyy/enzoneault.dev",
  },
];

export const links: readonly { label: string; href: string; icon: BrandIconName }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/enzoneault", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/AzaWoodyy", icon: "github" },
];

export const footerAlt =
  "Une falaise herbeuse baignée de soleil au-dessus d’une mer turquoise, parsemée de caractères ASCII.";
