import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistSerif } from "geist/font/serif/variable";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enzo Neault",
  description: "Le site d’Enzo Neault, développeur web.",
  // Light WebP favicon for modern browsers, app/favicon.ico as fallback, and a small JPEG for iOS home screens.
  icons: {
    icon: [{ url: "/icon.webp", type: "image/webp", sizes: "256x256" }],
    apple: [{ url: "/apple-icon.jpg", type: "image/jpeg", sizes: "180x180" }],
  },
};

const fontVariables = [GeistSans.variable, GeistMono.variable, GeistSerif.variable].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
