"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
} from "@/app/actions/userActions";
import { getUserPosts } from "@/app/actions/postActions";
import Link from "next/link";
import { LogOut, Edit, Heart, FileText, MessageSquare, ShieldCheck, GraduationCap, MapPin, Phone, Mail, Star, Loader2, Plus, User as UserIcon, Sparkles, Building2, LayoutGrid, CheckCircle2 } from "lucide-react";
import PostCard from "@/components/PostCard";
import Navbar from "@/components/Navbar";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  university?: string;
  yearOfStudy?: string;
  bio?: string;
  district?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  verificationStatus?: string;
}

function ProfileStat({ label, value, icon: Icon, colorClass }: { label: string, value: string, icon: any, colorClass: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 flex items-center gap-5 group hover:border-sky-500/20 transition-all shadow-sm">
       <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
       </div>
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-black text-slate-900">{value}</p>
       </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"profile" | "posts">("profile");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "posts" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session && session.user) {
      const sessionUser = session.user as any;

      async function loadUserData() {
        setLoading(true);
        const userResult = await getCurrentUserProfile();
        if (userResult.success && userResult.user) {
          setUser(userResult.user as User);
        } else {
          setUser({
            _id: sessionUser.id || "",
            name: sessionUser.name || "User",
            email: sessionUser.email || "",
            image: sessionUser.image || undefined,
          });
        }

        const resolvedUserId = (userResult.success && (userResult.user as any)?._id) || sessionUser.id;
        if (resolvedUserId) {
          const postsResult = await getUserPosts(resolvedUserId);
          if (postsResult.success) {
            setUserPosts(postsResult.posts);
          }
        }
        setLoading(false);
      }
      loadUserData();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

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
        
        {/* Profile Header - Premium High Impact Card */}
        <div className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 shadow-3xl mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <UserIcon className="w-64 h-64 -rotate-12 text-sky-600" />
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="relative group/avatar">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-44 h-44 rounded-[40px] object-cover border-8 border-slate-50 shadow-2xl group-hover/avatar:scale-105 transition-transform" />
                ) : (
                  <div className="w-44 h-44 rounded-[40px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-6xl font-black border-8 border-slate-50 shadow-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-center lg:text-left space-y-5">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                   <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
                   <span className="px-5 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      PLATINUM PARTNER
                   </span>
                </div>
                <p className="text-2xl text-slate-400 font-medium">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-2">
                   <div className="flex items-center gap-2.5">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                      <span className="font-black text-xl text-slate-900">{user.rating?.toFixed(1) || "5.0"}</span>
                      <span className="text-slate-400 text-sm font-bold">({user.reviewCount || 0} Reviews)</span>
                   </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link href="/profile/edit" className="flex items-center justify-center gap-3 px-10 py-5 bg-sky-600 text-white rounded-[24px] font-black hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20 hover:-translate-y-1">
                <Edit className="w-5 h-5" /> Edit Profile
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center justify-center gap-3 px-10 py-5 bg-rose-50 text-rose-500 border border-rose-100 rounded-[24px] font-black hover:bg-rose-500 hover:text-white transition-all hover:-translate-y-1">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-50 relative z-10">
            <ProfileStat label="University" value={user.university || "University of Colombo"} icon={GraduationCap} colorClass="bg-sky-50 text-sky-600" />
            <ProfileStat label="Year of Study" value={user.yearOfStudy || "Not specified"} icon={FileText} colorClass="bg-indigo-50 text-indigo-600" />
            <ProfileStat label="Current District" value={user.district || "Not specified"} icon={MapPin} colorClass="bg-emerald-50 text-emerald-600" />
            <ProfileStat label="Verified Phone" value={user.phoneNumber || "Not specified"} icon={Phone} colorClass="bg-amber-50 text-amber-600" />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap p-2 bg-slate-50/80 backdrop-blur-xl rounded-[32px] border border-slate-100 shadow-sm mb-16 w-full md:w-fit mx-auto lg:mx-0">
          <button onClick={() => { setActiveTab("profile"); router.push("?tab=profile", { scroll: false }) }} className={`flex items-center justify-center flex-1 md:flex-none gap-3 px-8 py-4 rounded-[24px] font-black transition-all text-sm ${activeTab === "profile" ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-900 hover:bg-white/50"}`}>
            <UserIcon className="w-5 h-5" /> About Me
          </button>
          <button onClick={() => { setActiveTab("posts"); router.push("?tab=posts", { scroll: false }) }} className={`flex items-center justify-center flex-1 md:flex-none gap-3 px-8 py-4 rounded-[24px] font-black transition-all text-sm ${activeTab === "posts" ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-900 hover:bg-white/50"}`}>
            <Building2 className="w-5 h-5" /> My Listings ({userPosts.length})
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {activeTab === "profile" && (
            <div className="bg-white rounded-[48px] p-12 md:p-20 border border-slate-100 shadow-2xl">
              <div className="grid lg:grid-cols-12 gap-20">
                 <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-6">
                       <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4">
                          <Sparkles className="w-10 h-10 text-sky-500" /> 
                          Personal Biography
                       </h2>
                       <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 italic relative">
                          <div className="absolute top-0 left-10 -translate-y-1/2 px-4 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">User Summary</div>
                          <p className="text-slate-600 text-2xl font-medium leading-relaxed">
                             "{user.bio || "No bio information provided yet. Tell the community about your housing needs or your properties to build trust!"}"
                          </p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="lg:col-span-5 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900">Contact Information</h3>
                    <div className="grid gap-6">
                       <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-6 group hover:bg-white transition-all shadow-sm">
                          <div className="p-4 bg-white text-sky-600 rounded-2xl shadow-sm"><Mail className="w-7 h-7" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email</p>
                             <p className="text-xl font-black text-slate-900">{user.email}</p>
                          </div>
                       </div>
                       <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-6 group hover:bg-white transition-all shadow-sm">
                          <div className="p-4 bg-white text-sky-600 rounded-2xl shadow-sm"><Phone className="w-7 h-7" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                             <p className="text-xl font-black text-slate-900">{user.phoneNumber || "Not provided"}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div>
              {userPosts.length === 0 ? (
                <div className="bg-white rounded-[48px] p-32 text-center border border-slate-100 shadow-2xl">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                     <LayoutGrid className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No active listings.</h3>
                  <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto">You haven't posted any housing offers or requests yet. Ready to start?</p>
                  <Link href="/create" className="inline-flex items-center gap-4 px-12 py-5 bg-sky-600 text-white rounded-[24px] font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20">
                     Create First Post <Plus className="w-6 h-6" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {userPosts.map((post) => (
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
                      authorName={user.name}
                      authorRole={user.role}
                      roomType={post.roomType}
                      occupancy={post.occupancy}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
