import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI Syntax - React Component Library",
  description: "Beautiful, modern React components with live previews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950">{children}</body>
    </html>
  );
}
