import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Directly check the database so we aren't reliant on client-side session updates
  await connectToDatabase();
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  if (!dbUser || (dbUser.role !== "admin" && dbUser.role !== "super-admin")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-500 mb-8 font-medium">You do not have the required permissions to view this dashboard.</p>
          <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 lg:p-12">
        {children}
      </main>
    </div>
  );
}
