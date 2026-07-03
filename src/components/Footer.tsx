"use client";

import {
  Mail,
  Phone,
  ShieldCheck,
  Globe,
  Users,
  Share2,
  ArrowRight,
  Heart,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const platformLinks = [
    { label: "Browse Offers", href: "/offers" },
    { label: "Housing Requests", href: "/requests" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Safety First", href: "/safety" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="relative bg-slate-950 overflow-hidden">
      {/* Soft glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[380px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
      {/* Architectural grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 pt-16 md:pt-20 pb-10">
        {/* Top band: brand + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 pb-14 border-b border-white/5">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <Link href="/" className="flex items-center mb-6">
              <img
                src="/UniBoarding-white.png"
                alt="BoardingFor.me Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Sri Lanka's trusted platform connecting university students with
              verified, high-quality boarding places near every campus.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, Users, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all border border-white/10 hover:border-sky-500 hover:-translate-y-0.5"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="w-full lg:w-auto lg:min-w-[340px] bg-gradient-to-br from-sky-600/20 to-slate-900/0 border border-sky-500/20 rounded-3xl p-8 text-center lg:text-left">
            <p className="text-white font-black text-xl mb-2">
              Have a place to rent out?
            </p>
            <p className="text-slate-400 text-sm font-medium mb-6">
              List your boarding place for free and reach thousands of students.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-sky-500 text-white rounded-full font-bold text-sm hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20"
            >
              Post a Listing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 text-center md:text-left">
          {/* Platform */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              Platform
            </h4>
            <ul className="space-y-4">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 font-bold text-sm hover:text-sky-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 font-bold text-sm hover:text-sky-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@boardingfor.me"
                  className="flex items-center justify-center md:justify-start gap-2.5 text-slate-400 font-bold text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                  hello@boardingfor.me
                </a>
              </li>
              <li>
                <a
                  href="tel:+94771234567"
                  className="flex items-center justify-center md:justify-start gap-2.5 text-slate-400 font-bold text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  +94 77 123 4567
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2.5 text-slate-400 font-bold text-sm">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          {/* Trust badge */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              Verified
            </h4>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="w-10 h-10 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-xs font-bold leading-tight text-left">
                Manually audited listings & verified students.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-slate-500 text-sm font-bold text-center md:text-left order-2 md:order-1">
            © {currentYear} BoardingFor.me — Sri Lanka's #1 Student Housing
            Platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 order-1 md:order-2">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-slate-500 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-slate-600 text-xs font-bold">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in
          Sri Lanka
        </div>
      </div>
    </footer>
  );
}
