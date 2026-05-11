"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSavedPosts } from "@/app/actions/userActions";
import Link from "next/link";
import { Heart, Loader2, Sparkles, ArrowRight } from "lucide-react";
import PostCard from "@/components/PostCard";
import Navbar from "@/components/Navbar";

export default function SavedPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      async function loadSavedPosts() {
        setLoading(true);
        const savedResult = await getSavedPosts();
        if (savedResult.success && savedResult.posts) {
          setSavedPosts(savedResult.posts);
        }
        setLoading(false);
      }
      loadSavedPosts();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col pt-32 pb-24 font-sans text-slate-900">
      {/* Architectural Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <Navbar />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/5 border border-sky-100">
                 <Heart className="w-4 h-4 fill-sky-600" />
                 <span>Your Collection</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                 Saved <span className="text-sky-600">Posts.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-xl">
                 Your curated list of boarding places, apartments, and housing requests.
              </p>
           </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {savedPosts.length === 0 ? (
            <div className="bg-white rounded-[48px] p-32 text-center border border-slate-100 shadow-3xl">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                 <Heart className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your collection is empty.</h3>
              <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto">Save interesting listings to find them easily later.</p>
              <Link href="/offers" className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-sky-600 text-white rounded-[24px] font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20 group">
                 Browse Marketplace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {savedPosts.map((post) => (
                <PostCard 
                  key={post._id} 
                  id={post._id} 
                  type={post.type} 
                  title={post.title} 
                  price={post.price} 
                  budgetRange={post.budgetRange} 
                  district={post.district} 
                  targetUniversity={post.targetUniversity} 
                  genderPreference={post.genderPreference} 
                  imageUrl={post.images?.[0]} 
                  createdAt={post.createdAt} 
                  authorName={post.author?.name || "Member"}
                  authorRole={post.author?.role}
                  roomType={post.roomType}
                  occupancy={post.occupancy}
                  isSavedInitial={true}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
