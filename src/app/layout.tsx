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

export const metadata: Metadata = {
  title: {
    template: "%s | UniBoarding.com Sri Lanka",
    default: "UniBoarding.com | #1 Student Housing & Boarding Places in Sri Lanka",
  },
  description:
    "Find the best verified student accommodations, apartments, and bodim places near all major universities in Sri Lanka. Fast, secure, and affordable housing for students.",
  keywords: [
    "Bodima",
    "Bodim places Sri Lanka",
    "Student housing Colombo",
    "University boarding",
    "UniBoarding.com",
    "Kelaniya bodima",
    "Moratuwa bodima",
    "Student accommodations Katubedda",
    "Hostels Sri Lanka",
  ],
  authors: [{ name: "UniBoarding.com" }],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "UniBoarding.com | Find Your Perfect Boarding Place",
    description:
      "Connect with verified boarding places and apartments near your university in Sri Lanka. Start your search today.",
    url: "https://uniboarding.com",
    siteName: "UniBoarding.com",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
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
