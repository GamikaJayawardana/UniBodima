"use client";

import { useEffect, useState, Suspense } from "react";
import { getMyPosts, deletePost } from "@/app/actions/postActions";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardItem from "@/components/DashboardItem";
import { LayoutDashboard, PlusCircle, Home, Search, Loader2, AlertCircle, Sparkles, Building2, Users, SlidersHorizontal, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTab = (searchParams.get("tab") as "offer" | "request") || "offer";
  const [activeTab, setActiveTab] = useState<"offer" | "request">(initialTab);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      loadPosts();
    }
  }, [session, activeTab]);

  async function loadPosts() {
    setLoading(true);
    const result = await getMyPosts(activeTab);
    if (result.success) {
      setPosts(result.posts);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      const result = await deletePost(id);
      if (result.success) {
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        alert("Error deleting post: " + result.error);
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Authorizing Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/5 border border-slate-100">
                 <LayoutDashboard className="w-4 h-4" />
                 <span>Control Center</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                 My <span className="text-sky-600">Inventory.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-xl">
                 Manage your housing offers and student requests in one unified arctic dashboard.
              </p>
           </div>
           <Link href="/create" className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 hover:-translate-y-1">
              <PlusCircle className="w-6 h-6" />
              New Listing
           </Link>
        </div>

        {/* Navigation & Stats Bar */}
        <div className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex p-1 bg-slate-50 rounded-[26px] w-full sm:w-auto">
              <button 
                 onClick={() => { setActiveTab("offer"); router.push("/dashboard?tab=offer"); }}
                 className={`flex items-center gap-3 px-10 py-4 rounded-[22px] font-black text-sm transition-all ${activeTab === "offer" ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 <Building2 className="w-5 h-5 text-sky-500" /> My Offers
              </button>
              <button 
                 onClick={() => { setActiveTab("request"); router.push("/dashboard?tab=request"); }}
                 className={`flex items-center gap-3 px-10 py-4 rounded-[22px] font-black text-sm transition-all ${activeTab === "request" ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 <Users className="w-5 h-5 text-emerald-500" /> My Requests
              </button>
           </div>
           
           <div className="px-10 py-4 hidden md:flex items-center gap-3 text-slate-400 font-bold text-sm italic">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>You have <span className="text-slate-900">{posts.length}</span> active {activeTab}s</span>
           </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
           {loading ? (
             <div className="py-40 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Records...</p>
             </div>
           ) : posts.length === 0 ? (
             <div className="bg-white rounded-[48px] p-24 text-center border border-slate-100 shadow-2xl">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                   {activeTab === "offer" ? <Building2 className="w-10 h-10 text-slate-200" /> : <Users className="w-10 h-10 text-slate-200" />}
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Inventory is empty.</h3>
                <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto">
                   You haven't posted any {activeTab}s yet. Start contributing to the community today.
                </p>
                <Link href="/create" className="inline-flex items-center gap-4 px-12 py-5 bg-sky-600 text-white rounded-[24px] font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20">
                   Create First Listing <ArrowRight className="w-6 h-6" />
                </Link>
             </div>
           ) : (
             posts.map((post) => (
               <DashboardItem key={post._id} post={post} onDelete={handleDelete} />
             ))
           )}
        </div>

        {/* Platform Protocols Footer */}
        <div className="mt-24 pt-10 border-t border-slate-200 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">
              Security Handshake: Verified · Session Protocol: Arctic v5.2
           </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
