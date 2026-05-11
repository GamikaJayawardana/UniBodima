"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, ArrowLeft, Settings, Flag } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Manage Posts", href: "/admin/posts", icon: FileText },
    { name: "User Reports", href: "/admin/reports", icon: Flag },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-screen overflow-y-auto sticky top-0">
      <div className="p-8 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
          <Settings className="w-4 h-4" />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900">
          Admin Panel
        </span>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                isActive 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>
    </aside>
  );
}
