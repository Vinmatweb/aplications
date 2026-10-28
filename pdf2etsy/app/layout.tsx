import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paperwork — Etsy PDF Studio",
  description: "Z podkladů hotový balíček. Omalovánky, obtahovačky a barevné vzory v jednom pracovním prostoru.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
