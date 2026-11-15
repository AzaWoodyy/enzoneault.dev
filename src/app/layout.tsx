import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistSerif } from "geist/font/serif/variable";
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Long enough (~150 characters) for Google to use it as the search snippet instead of rewriting it from the page text.
const description =
  "Enzo Neault, développeur full-stack à Annecy depuis 2016 : agents IA, React, React Native, NestJS, Laravel, Symfony et Vue. Expérience, projets et contact.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enzoneault.dev"),
  title: "Enzo Neault — Développeur",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "fr_FR",
    url: "/",
    siteName: "Enzo Neault",
    title: "Enzo Neault — Développeur",
    description,
    firstName: "Enzo",
    lastName: "Neault",
  },
  twitter: { card: "summary", title: "Enzo Neault — Développeur", description },
  // Light WebP favicon for modern browsers, app/favicon.ico as fallback, and a small JPEG for iOS home screens.
  icons: {
    icon: [{ url: "/icon.webp", type: "image/webp", sizes: "256x256" }],
    apple: [{ url: "/apple-icon.jpg", type: "image/jpeg", sizes: "180x180" }],
  },
};

// Draw under the iPhone safe areas so the footer image reaches the bottom edge instead of leaving a paper strip.
export const viewport: Viewport = { viewportFit: "cover" };

const fontVariables = [GeistSans.variable, GeistMono.variable, GeistSerif.variable].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
