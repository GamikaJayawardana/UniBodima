import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Providers } from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.boardingfor.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | BoardingFor.me Sri Lanka",
    default: "BoardingFor.me | #1 Student Housing & Boarding Places in Sri Lanka",
  },
  description:
    "Find the best verified student accommodations, apartments, and bodim places near all major universities in Sri Lanka. Fast, secure, and affordable housing for students.",
  keywords: [
    "Bodima",
    "Bodim places Sri Lanka",
    "Student housing Colombo",
    "University boarding",
    "BoardingFor.me",
    "Kelaniya bodima",
    "Moratuwa bodima",
    "Student accommodations Katubedda",
    "Hostels Sri Lanka",
  ],
  authors: [{ name: "BoardingFor.me" }],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "BoardingFor.me | Find Your Perfect Boarding Place",
    description:
      "Connect with verified boarding places and apartments near your university in Sri Lanka. Start your search today.",
    url: "https://www.boardingfor.me",
    siteName: "BoardingFor.me",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BoardingFor.me",
    url: SITE_URL,
    logo: `${SITE_URL}/UniBoarding-black.png`,
    description:
      "Sri Lanka's student housing platform connecting university students with verified boarding places, bodim, and accommodation near every major university.",
    areaServed: { "@type": "Country", name: "Sri Lanka" },
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BoardingFor.me",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/offers?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Providers>
          <Navbar />
          <Suspense fallback={null}>
            <AuthModal />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
