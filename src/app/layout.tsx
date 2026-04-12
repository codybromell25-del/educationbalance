import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
    <html lang="en" className={`${playfair.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/aileron"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
