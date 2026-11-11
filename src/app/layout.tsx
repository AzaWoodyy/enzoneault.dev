import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistSerif } from "geist/font/serif/variable";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enzo Neault",
  description: "Enzo Neault's website",
};

const fontVariables = [GeistSans.variable, GeistMono.variable, GeistSerif.variable].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
