"use client";

import { use, useState, useEffect } from "react";
import { getPostById, toggleSavePost, reportPost } from "@/app/actions/postActions";
import Navbar from "@/components/Navbar";
import { 
  MapPin, User, Calendar, Tag, Heart, Share2, Phone, 
  MessageCircle, Building2, Users, Bed, Clock, ChevronLeft, 
  ChevronRight, ShieldCheck, Check, Sparkles, GraduationCap,
  ArrowLeft, ArrowRight, Info, LayoutGrid, X, AlertOctagon, Flag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StatCard({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all hover:border-sky-500/30 group">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-base font-black text-slate-900 capitalize leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      const result = await getPostById(resolvedParams.id);
      if (result.success) {
        setPost(result.post);
      }
      setLoading(false);
    }
    loadPost();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 mb-6 animate-pulse">
           <Building2 className="w-8 h-8 animate-bounce" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Fetching Details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-20">
         <div className="text-center p-12 bg-white rounded-[48px] shadow-2xl border border-slate-100">
            <Info className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 mb-4">Listing Not Found</h2>
            <p className="text-slate-500 font-medium mb-8">The listing you're looking for might have been removed or is no longer available.</p>
            <button onClick={() => router.back()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all">Go Back</button>
         </div>
      </div>
    );
  }

  const isOffer = post.type === "offer";
  
  // Deriving amenities from backend structure
  const derivedAmenities = [];
  if (isOffer) {
    if (post.roomFacilities?.hasWiFi) derivedAmenities.push("Free Wi-Fi");
    if (post.roomFacilities?.hasAC) derivedAmenities.push("Air Conditioning");
    if (post.roomFacilities?.hasHotWater) derivedAmenities.push("Hot Water");
    if (post.roomFacilities?.isFurnished) derivedAmenities.push("Fully Furnished");
    if (post.roomFacilities?.hasPrivateBathroom) derivedAmenities.push("Private Bathroom");
    
    if (post.buildingAmenities?.hasParking) derivedAmenities.push("Parking Available");
    if (post.buildingAmenities?.has24HourSecurity) derivedAmenities.push("24h Security");
    if (post.buildingAmenities?.hasCCTV) derivedAmenities.push("CCTV");
    
    if (post.mealPlan?.included) derivedAmenities.push("Meals Included");
    if (post.utilitiesIncluded?.electricity) derivedAmenities.push("Electricity Included");
    if (post.utilitiesIncluded?.water) derivedAmenities.push("Water Included");
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % (post.images?.length || 1));
  const prevImage = () => setActiveImage((prev) => (prev - 1 + (post.images?.length || 1)) % (post.images?.length || 1));

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Back Navigation */}
        <button 
          onClick={() => router.back()}
          className="mb-10 flex items-center gap-3 text-slate-400 hover:text-sky-600 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
        </button>

        {/* Top Section - Visuals & Booking */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          {/* Left - Immersive Gallery */}
          <div className="lg:col-span-8">
            <div className="relative group rounded-[40px] overflow-hidden bg-white border border-slate-100 shadow-2xl h-[450px] md:h-[600px]">
               {post.images && post.images.length > 0 ? (
                 <img 
                   src={post.images[activeImage]} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   alt={post.title} 
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                   <Tag className="w-20 h-20 mb-4 opacity-20" />
                   <p className="font-black uppercase tracking-widest text-xs">No Visuals Provided</p>
                 </div>
               )}

               {/* Navigation Controls */}
               {post.images && post.images.length > 1 && (
                 <>
                   <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2.5 z-20">
                     {post.images.map((_: any, i: number) => (
                       <button 
                         key={i} 
                         onClick={() => setActiveImage(i)}
                         className={`h-1.5 rounded-full transition-all ${i === activeImage ? 'w-10 bg-white shadow-xl' : 'w-4 bg-white/40 hover:bg-white/60'}`}
                       />
                     ))}
                   </div>
                   <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6" /></button>
                   <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-6" /></button>
                 </>
               )}

               {/* Top Badges */}
               <div className="absolute top-6 left-6 flex gap-2.5">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20 ${isOffer ? 'bg-sky-600/90 text-white' : 'bg-emerald-600/90 text-white'}`}>
                    {isOffer ? 'Elite Housing Offer' : 'Student Request'}
                  </span>
                  {(post.author?.role === 'admin' || post.author?.role === 'super-admin') && (
                    <span className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-rose-500/50 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> Official Admin
                    </span>
                  )}
               </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-3xl overflow-hidden h-full flex flex-col">
              <div className="p-8 md:p-10 space-y-8 flex-grow">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2.5">
                       {isOffer ? 'Official Monthly Rent' : 'Student Budget Cap'}
                    </p>
                    <div className="flex items-baseline gap-2.5">
                       <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                          {isOffer 
                            ? `LKR ${post.price?.toLocaleString()}` 
                            : `LKR ${post.budgetRange?.min?.toLocaleString()} - ${post.budgetRange?.max?.toLocaleString()}`}
                       </span>
                       <span className="text-lg font-black text-sky-600 italic">/mo</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <a 
                      href={`tel:${post.contactNumber || post.author?.phoneNumber}`}
                      className="flex items-center justify-center gap-3 w-full py-5 bg-sky-600 text-white rounded-[24px] font-black text-lg hover:bg-sky-700 transition-all shadow-2xl shadow-sky-600/20 active:translate-y-1 group"
                    >
                       <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                       Call Primary Host
                    </a>
                    <button className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                       <MessageCircle className="w-5 h-5" />
                       Secure WhatsApp
                    </button>
                 </div>

                 <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                           {post.author?.name?.charAt(0) || "M"}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Listed By</p>
                           <p className="text-base font-black text-slate-900 leading-tight">{post.author?.name || "Member"}</p>
                           {(post.author?.role === 'admin' || post.author?.role === 'super-admin') && (
                             <div className="flex items-center gap-1 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Official Admin</span>
                             </div>
                           )}
                        </div>
                     </div>
                 </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 p-6">
                 <div className="flex items-center justify-around">
                    <button 
                      onClick={async () => {
                        const result = await toggleSavePost(post._id);
                        if (result.success) {
                          alert(result.saved ? "Listing saved to favorites!" : "Listing removed from favorites.");
                        }
                      }}
                      className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors group"
                    >
                       <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Save Post</span>
                    </button>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }}
                      className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-sky-600 transition-colors group"
                    >
                       <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Share Hub</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Details */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl space-y-10">
                <div className="space-y-6">
                   <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-sky-100 flex items-center gap-2">
                         <GraduationCap className="w-3.5 h-3.5" />
                         {post.targetUniversity || "General Student Housing"}
                      </div>
                      <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5" />
                         Listed {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently"}
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                         {post.title}
                      </h1>
                      <div className="flex items-center gap-2.5 text-slate-400 text-lg font-medium">
                         <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                         <span className="italic">{post.address || post.district || "Location details hidden for privacy"}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <StatCard icon={Users} label="Gender" value={post.genderPreference} colorClass="bg-indigo-50 text-indigo-600" />
                   <StatCard icon={Bed} label="Room" value={post.roomType || 'Standard'} colorClass="bg-sky-50 text-sky-600" />
                   <StatCard icon={post.author?.role === 'admin' || post.author?.role === 'super-admin' ? ShieldCheck : User} label="Host" value={post.author?.role === 'admin' || post.author?.role === 'super-admin' ? "Admin" : "Standard"} colorClass="bg-emerald-50 text-emerald-600" />
                   <StatCard icon={Clock} label="Policy" value={post.occupancy ? `${post.occupancy} Pax` : "Shared"} colorClass="bg-amber-50 text-amber-600" />
                </div>

                <div className="pt-10 border-t border-slate-100">
                   <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-sky-500" /> 
                      {isOffer ? 'Property Description' : 'Request Details'}
                   </h3>
                   <div className="prose prose-slate max-w-none">
                     <p className="text-slate-600 text-lg font-medium leading-relaxed">
                       {post.description || 'No detailed description provided by the author.'}
                     </p>
                   </div>
                </div>

                {isOffer && (
                  <div className="space-y-10">
                     <div className="pt-10 border-t border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                           <LayoutGrid className="w-6 h-6 text-sky-600" />
                           Amenities & Facilities
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-5">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Features</h4>
                              <div className="grid grid-cols-1 gap-3.5">
                                 {[
                                    { key: post.roomFacilities?.hasWiFi, label: "High-Speed Wi-Fi" },
                                    { key: post.roomFacilities?.hasAC, label: "Air Conditioning" },
                                    { key: post.roomFacilities?.hasHotWater, label: "Hot Water" },
                                    { key: post.roomFacilities?.isFurnished, label: "Fully Furnished" },
                                    { key: post.roomFacilities?.hasPrivateBathroom, label: "Private Bathroom" },
                                 ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 font-bold text-sm ${item.key ? 'text-slate-900' : 'text-slate-300 line-through opacity-50'}`}>
                                       <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${item.key ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                          {item.key ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                       </div>
                                       {item.label}
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-5">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Building & Security</h4>
                              <div className="grid grid-cols-1 gap-3.5">
                                 {[
                                    { key: post.buildingAmenities?.hasParking, label: "Secure Parking" },
                                    { key: post.buildingAmenities?.has24HourSecurity, label: "24/7 Security" },
                                    { key: post.buildingAmenities?.hasCCTV, label: "CCTV Surveillance" },
                                    { key: post.mealPlan?.included, label: "Meal Plan Available" },
                                    { key: post.utilitiesIncluded?.electricity && post.utilitiesIncluded?.water, label: "Utilities Included" },
                                 ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 font-bold text-sm ${item.key ? 'text-slate-900' : 'text-slate-300 line-through opacity-50'}`}>
                                       <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${item.key ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                          {item.key ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                       </div>
                                       {item.label}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {(post.mealPlan?.included || post.utilitiesIncluded) && (
                        <div className="p-6 bg-sky-50 rounded-[24px] border border-sky-100 grid md:grid-cols-2 gap-6">
                           {post.mealPlan?.included && (
                              <div className="flex gap-3.5">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm shrink-0 font-black text-sm">
                                    M
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Meal Policy</p>
                                    <p className="text-xs font-bold text-slate-700">{post.mealPlan.type || "Meals provided"}</p>
                                 </div>
                              </div>
                           )}
                           <div className="flex gap-3.5">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm shrink-0 font-black text-sm">
                                 U
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Utilities Coverage</p>
                                 <p className="text-xs font-bold text-slate-700">
                                    {[
                                       post.utilitiesIncluded?.electricity ? "Electricity" : null,
                                       post.utilitiesIncluded?.water ? "Water" : null,
                                       post.utilitiesIncluded?.gas ? "Gas" : null,
                                    ].filter(Boolean).join(", ") || "No utilities included"}
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
                )}

                <div className="pt-10 border-t border-slate-100">
                   <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-sky-600" /> 
                      Safety Guidelines
                   </h3>
                   <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 grid md:grid-cols-2 gap-6">
                      <div className="flex gap-3.5">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <Info className="w-5 h-5" />
                         </div>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            <strong className="text-slate-900 block mb-0.5 text-xs">Visit Before Paying</strong>
                            Never pay any advance money before visiting the property in person.
                         </p>
                      </div>
                      <div className="flex gap-3.5">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <User className="w-5 h-5" />
                         </div>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            <strong className="text-slate-900 block mb-0.5 text-xs">Bring a Companion</strong>
                            Always bring a friend when visiting a property for the first time.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar - Audit & Sticky Info */}
          <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32">
                 <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-6">
                      <Flag className="w-12 h-12 text-rose-500 mb-4 opacity-80" />
                      <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-2">Report Listing</h4>
                      <p className="text-slate-400 text-xs font-medium">
                        Notice something wrong? Help us keep the community safe.
                      </p>
                    </div>
                    
                    {reportSuccess ? (
                      <div className="py-4 px-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                        <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Report Submitted</p>
                      </div>
                    ) : (
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!reportReason.trim()) return;
                        setReporting(true);
                        const res = await reportPost(post._id, post.type, reportReason);
                        setReporting(false);
                        if (res.success) {
                          setReportSuccess(true);
                        } else {
                          alert(res.error || "Failed to submit report");
                        }
                      }} className="space-y-4">
                        <textarea 
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Why are you reporting this?"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-rose-500/50 transition-colors resize-none h-24 placeholder:text-slate-500"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={reporting}
                          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                          {reporting ? "Submitting..." : <><AlertOctagon className="w-4 h-4" /> Submit Report</>}
                        </button>
                      </form>
                    )}
                 </div>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}
