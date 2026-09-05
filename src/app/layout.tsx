import type { Metadata } from "next";
import {
  Playfair_Display,
  Raleway,
  Libre_Baskerville,
} from "next/font/google";
import "./globals.css";

// Public landing page typography (unchanged): Playfair headings, Aileron
// body (Aileron is loaded via the cdnfonts <link> below).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// App typography — applied only inside `.font-app` wrappers (auth,
// student, admin, discussion). Loaded here so the variables exist on
// <html>, but nothing outside `.font-app` references them, so the
// landing page is unaffected. See the `.font-app` block in globals.css.
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
      className={`${playfair.variable} ${raleway.variable} ${libreBaskerville.variable} h-full antialiased scroll-smooth`}
    >
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
