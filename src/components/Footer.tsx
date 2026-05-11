"use client";

import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Globe,
  Users,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Architectural Grid (subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center">
              <img src="/UniBoarding-white.png" alt="UniBoarding Logo" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
              Empowering Sri Lankan university students with verified,
              high-quality housing solutions near academic hubs.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Users, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 bg-slate-900 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all border border-slate-800 hover:border-slate-700"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">
              Platform
            </h4>
            <ul className="space-y-4">
              {["Offers", "Requests", "How it Works", "Safety First"].map(
                (item) => {
                  const target =
                    item === "Safety First"
                      ? "/safety"
                      : `/${item.toLowerCase().replace(/ /g, "-")}`;
                  return (
                    <li key={item}>
                      <Link
                        href={target}
                        className="text-slate-400 font-bold hover:text-sky-400 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">
              Support
            </h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl group-hover:bg-slate-800 group-hover:text-sky-400 group-hover:border-slate-700 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">
                  hello@uniboarding.com
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl group-hover:bg-slate-800 group-hover:text-sky-400 group-hover:border-slate-700 transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">
                  +94 77 123 4567
                </span>
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-black text-lg">
                Verified Ecosystem
              </p>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mt-1">
                Manual property auditing and student identity verification
                protocols active.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold">
            © {currentYear} UniBoarding.com. All rights reserved. Sri Lanka's #1
            Student Housing Solution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-bold text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
