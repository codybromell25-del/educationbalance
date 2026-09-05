import type { Metadata } from "next";
import { Raleway, Libre_Baskerville } from "next/font/google";
import "./globals.css";

// Site-wide typography, self-hosted at build via next/font (no runtime
// request to Google or any third-party font CDN). The CSS variables land
// on <html>; globals.css maps them to --font-body / --font-heading.
//   Body     : Raleway
//   Headings : Libre Baskerville, italic by default
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    <html
      lang="en"
      className={`${raleway.variable} ${libreBaskerville.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
