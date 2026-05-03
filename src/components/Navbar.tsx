"use client";

import Link from "next/link";
import { PlusCircle, Search, User, ChevronDown, LayoutDashboard, Menu, X, LogOut, Settings, Home, Compass, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when pathname changes
  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/offers?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isSolid = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isSolid
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm py-3"
            : "bg-gradient-to-b from-black/50 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSolid ? "bg-blue-600" : "bg-white"}`}
              >
                <span
                  className={`font-bold text-lg ${isSolid ? "text-white" : "text-blue-600"}`}
                >
                  U
                </span>
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${isSolid ? "text-slate-900" : "text-white"}`}
              >
                UniBodimHub
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80 border border-gray-200">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location or uni..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link
                href="/offers"
                className={`text-sm font-bold transition-colors hover:opacity-80 ${isSolid ? "text-slate-600" : "text-white"}`}
              >
                Offers
              </Link>
              <Link
                href="/requests"
                className={`text-sm font-bold transition-colors hover:opacity-80 ${isSolid ? "text-slate-600" : "text-white"}`}
              >
                Requests
              </Link>
              <Link
                href="/#universities"
                className={`text-sm font-bold transition-colors hover:opacity-80 ${isSolid ? "text-slate-600" : "text-white"}`}
              >
                Universities
              </Link>
            </nav>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/create"
                  className={`hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-sm ${
                    isSolid
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post</span>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:ring-4 hover:ring-blue-500/20 flex items-center justify-center"
                    style={{
                      borderColor: isSolid ? "#f1f5f9" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-sm font-bold text-slate-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                  isSolid
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white text-slate-900 hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-xl ${isSolid ? "text-slate-900" : "text-white"}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black text-slate-900">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              <nav className="flex flex-col gap-2 flex-grow">
                <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600">
                  <Home className="w-5 h-5" /> Home
                </Link>
                <Link href="/offers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600">
                  <Compass className="w-5 h-5" /> Browse Offers
                </Link>
                <Link href="/requests" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600">
                  <Search className="w-5 h-5" /> Student Requests
                </Link>
                <Link href="/how-it-works" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600">
                  <Info className="w-5 h-5" /> How it Works
                </Link>
              </nav>

              {!session && (
                <Link 
                  href="/login" 
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-center shadow-lg shadow-blue-100 mt-auto"
                >
                  Sign In
                </Link>
              )}
              {session && (
                <div className="mt-auto border-t border-slate-100 pt-6">
                  <Link 
                    href="/create"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mb-4"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Post Now</span>
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
