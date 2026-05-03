"use client";

import { useEffect, useState, Suspense } from "react";
import { getMyPosts, deletePost } from "@/app/actions/postActions";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardItem from "@/components/DashboardItem";
import { LayoutDashboard, PlusCircle, Home, Search, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTab = (searchParams.get("tab") as "offer" | "request") || "offer";
  const [activeTab, setActiveTab] = useState<"offer" | "request">(initialTab);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadPosts();
    }
  }, [status, activeTab, router]);

  async function loadPosts() {
    setLoading(true);
    try {
      const result = await getMyPosts(activeTab);
      if (result.success) {
        setPosts(result.posts || []);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setDeletingId(postId);
    try {
      const result = await deletePost(postId);
      if (result.success) {
        setPosts(posts.filter(p => p._id !== postId));
      } else {
        alert("Error deleting post: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeletingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-1">
              <LayoutDashboard className="w-4 h-4" />
              <span>User Panel</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              My Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Manage and track your listed boarding offers and requests
            </p>
          </div>
          
          <Link
            href={`/create?type=${activeTab}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New {activeTab === "offer" ? "Offer" : "Request"}</span>
          </Link>
        </div>

        {/* Tabs Section */}
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 w-full md:w-fit">
          <button
            onClick={() => setActiveTab("offer")}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === "offer"
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Home className="w-4.5 h-4.5" />
            My Offers
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === "request"
                ? "bg-purple-600 text-white shadow-md shadow-purple-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Search className="w-4.5 h-4.5" />
            My Requests
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === "offer" ? (
                <Home className="w-10 h-10 text-slate-300" />
              ) : (
                <Search className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No {activeTab}s Found</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven't posted any {activeTab}s yet. Start listing today to reach more students.
            </p>
            <Link
              href={`/create?type=${activeTab}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
            >
              Post Your First {activeTab === "offer" ? "Offer" : "Request"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <div key={post._id} className={deletingId === post._id ? "opacity-50 pointer-events-none" : ""}>
                <DashboardItem post={post} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
