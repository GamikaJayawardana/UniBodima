"use client";

import Link from "next/link";
import { Menu, X, LogOut, User, LayoutDashboard, Sparkles, Heart, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || !isHome
          ? "bg-white/80 backdrop-blur-xl py-4 border-b border-slate-100"
          : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src="/UniBoarding-black.png" alt="BoardingFor.me Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
          </Link>

          {/* Minimal Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Home", "Offers", "Requests", "Universities", "How it Works"].map(
              (item) => {
                const itemHash =
                  item === "Universities"
                    ? "/#universities"
                    : item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(/ /g, "-")}`;
                return (
                  <Link
                    key={item}
                    href={itemHash}
                    className={`text-[13px] font-bold transition-colors hover:text-slate-900 ${(pathname === "/" &&
                      (item === "Home" || item === "Universities")) ||
                      pathname.includes(item.toLowerCase().replace(/ /g, "-"))
                      ? "text-slate-900"
                      : "text-slate-400"
                      }`}
                  >
                    {item}
                  </Link>
                );
              },
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {session && (
              <Link
                href="/create"
                className="hidden md:flex items-center gap-2 text-[13px] font-bold text-slate-900 hover:text-sky-600 transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Post Housing
              </Link>
            )}

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[13px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  Account
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-slate-50">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {session.user?.name}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-bold text-[13px]">My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-bold text-[13px]">Dashboard</span>
                    </Link>
                    <Link
                      href="/saved"
                      className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-bold text-[13px]">Saved Posts</span>
                    </Link>
                    {((session.user as any)?.role === "admin" ||
                      (session.user as any)?.role === "super-admin") && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="font-bold text-[13px]">Admin Panel</span>
                      </Link>
                    )}
                    <div className="h-px bg-slate-50 my-1"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-5 py-3 text-rose-500 hover:bg-rose-50 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-[13px]">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="?auth=register"
                  className="hidden md:block text-[13px] font-bold text-slate-600 hover:text-sky-600 transition-colors scroll-smooth"
                  scroll={false}
                >
                  Register
                </Link>
                <Link
                  href="?auth=login"
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-full text-[13px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 scroll-smooth"
                  scroll={false}
                >
                  Login
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <img src="/UniBoarding-black.png" alt="BoardingFor.me Logo" className="h-8 w-auto object-contain" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {[
                  "Home",
                  "Offers",
                  "Requests",
                  "Universities",
                  "How it Works",
                ].map((item) => {
                  const itemHash =
                    item === "Universities"
                      ? "/#universities"
                      : item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(/ /g, "-")}`;
                  return (
                    <Link
                      key={item}
                      href={itemHash}
                      className="text-lg font-bold text-slate-900 hover:text-sky-600"
                    >
                      {item}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
