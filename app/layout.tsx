import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LedgerComply — Compliance Tracker",
  description: "Track compliance tasks for your clients efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
