import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Agentic Review Article Generator",
  description:
    "Generate SEO-focused geo-targeted review articles with affiliate links, product intelligence, spell-checking, and Nano Banana imagery."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
