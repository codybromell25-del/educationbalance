import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "balance | Premium Pilates Training Course",
    template: "%s | balance",
  },
  description:
    "Master the art of Pilates with balance. A premium, structured training course combining in-person sessions with expert online guidance.",
  keywords: [
    "Pilates",
    "Pilates course",
    "Pilates training",
    "reformer Pilates",
    "balance",
    "Pilates certification",
    "online Pilates",
  ],
  openGraph: {
    type: "website",
    locale: "en_IE",
    siteName: "balance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
