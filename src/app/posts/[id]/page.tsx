"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, toggleSavePost } from "@/app/actions/postActions";
import { useSession } from "next-auth/react";
import {
  Heart,
  MapPin,
  Home,
  Wifi,
  Wind,
  UtensilsCrossed,
  Zap,
  Shield,
  Phone,
  Mail,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Share2,
  Clock,
  ArrowRight,
  Sparkles,
  Bed,
  Users,
  Building2,
  Check,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

interface Post {
  _id: string;
  type: "offer" | "request";
  title: string;
  description: string;
  address?: string;
  district?: string;
  postcode?: string;
  targetUniversity: string;
  price?: number;
  budgetRange?: { min: number; max: number };
  genderPreference: string;
  images: string[];
  contactNumber: string;
  distanceToUni?: number;
  estimatedTravelTime?: number;
  roomType?: string;
  occupancy?: number;
  totalRooms?: number;
  leaseDuration?: string;
  availableFrom?: string;
  rating?: number;
  reviewCount?: number;
  roomFacilities?: {
    hasAC: boolean;
    hasWiFi: boolean;
    hasHotWater: boolean;
    isFurnished: boolean;
    hasPrivateBathroom: boolean;
    hasWardrobe: boolean;
    hasDeskStudyArea: boolean;
  };
  buildingAmenities?: {
    hasParking: boolean;
    has24HourSecurity: boolean;
    hasGarden: boolean;
    hasGym: boolean;
    hasCommonRoom: boolean;
    hasLaundry: boolean;
    hasGenerator: boolean;
    hasCCTV: boolean;
  };
  mealPlan?: {
    included: boolean;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    packingAllowed: boolean;
  };
  utilitiesIncluded?: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    gas?: boolean;
    garbage?: boolean;
  };
  author: {
    _id: string;
    name: string;
    image?: string;
    email: string;
    phoneNumber?: string;
    university?: string;
    district?: string;
    bio?: string;
    rating?: number;
    reviewCount?: number;
  };
  createdAt: string;
}

function StatCard({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-100 transition-colors">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-base font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
      active 
        ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm" 
        : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
    }`}>
      {active ? <Check className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4" />}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function PostDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadPost() {
      if (!postId) return;
      setLoading(true);
      const result = await getPostById(postId);
      if (result.success && result.post) {
        setPost(result.post as Post);
      } else {
        setPost(null);
      }
      setLoading(false);
    }
    loadPost();
  }, [postId]);

  const isOffer = post?.type === "offer";

  const whatsappLink = useMemo(() => {
    if (!post?.contactNumber) return "#";
    const cleanNumber = post.contactNumber.replace(/\D/g, "");
    // Ensure it has Sri Lanka prefix if needed, or just use as is
    return `https://wa.me/${cleanNumber.startsWith('0') ? '94' + cleanNumber.substring(1) : cleanNumber}`;
  }, [post?.contactNumber]);

  const handleSavePost = async () => {
    if (!session || !postId) {
      alert("Please login to save posts");
      return;
    }
    const result = await toggleSavePost(postId);
    if (result.success && result.saved !== undefined) {
      setSaved(result.saved);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Fetching details...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
             <ArrowRight className="w-10 h-10 rotate-180" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Post Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            The post you're looking for might have been removed or the link is incorrect.
          </p>
          <Link 
            href="/offers" 
            className="inline-flex items-center justify-center w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 py-4">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold group"
          >
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSavePost}
              className={`p-2.5 rounded-xl border transition-all ${
                saved 
                  ? "bg-rose-50 border-rose-100 text-rose-600" 
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Heart className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Section */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
              <div className="relative group aspect-[16/9] md:aspect-[21/9] bg-slate-200">
                {post.images?.length > 0 ? (
                  <img
                    src={post.images[currentImageIndex]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Home className="w-16 h-16" />
                    <p className="font-bold">No images available</p>
                  </div>
                )}

                {post.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-2xl p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % post.images.length)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-2xl p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl">
                      {post.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Title & Stats */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                  isOffer ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {isOffer ? "Offer Listing" : "Housing Request"}
                </span>
                <span className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 font-medium mb-10">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <MapPin className="w-5 h-5" />
                </div>
                <span className="text-lg">{post.address || "Location not specified"}</span>
                {post.district && <span className="text-slate-300 mx-1">•</span>}
                {post.district && <span className="text-lg">{post.district}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard 
                  icon={Building2} 
                  label="University" 
                  value={post.targetUniversity} 
                  colorClass="bg-blue-50 text-blue-600" 
                />
                <StatCard 
                  icon={Users} 
                  label="Gender" 
                  value={post.genderPreference} 
                  colorClass="bg-purple-50 text-purple-600" 
                />
                <StatCard 
                  icon={Bed} 
                  label="Room Type" 
                  value={post.roomType || "Private"} 
                  colorClass="bg-amber-50 text-amber-600" 
                />
                <StatCard 
                  icon={Users} 
                  label="Occupancy" 
                  value={`${post.occupancy || 1} Person`} 
                  colorClass="bg-rose-50 text-rose-600" 
                />
              </div>

              {(post.distanceToUni !== undefined || post.estimatedTravelTime !== undefined) && (
                <div className="flex flex-wrap gap-4 mb-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Distance</p>
                      <p className="font-bold text-slate-900">{post.distanceToUni} km to University</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-blue-100 hidden md:block"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Travel Time</p>
                      <p className="font-bold text-slate-900">~{post.estimatedTravelTime} mins away</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-10 border-t border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  Description
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>
            </div>

            {/* Facilities & Amenities (Grid) */}
            {isOffer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Room Facilities */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Wind className="w-6 h-6 text-blue-600" />
                    Room Facilities
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureItem label="Air Conditioning" active={!!post.roomFacilities?.hasAC} />
                    <FeatureItem label="WiFi Internet" active={!!post.roomFacilities?.hasWiFi} />
                    <FeatureItem label="Hot Water" active={!!post.roomFacilities?.hasHotWater} />
                    <FeatureItem label="Fully Furnished" active={!!post.roomFacilities?.isFurnished} />
                    <FeatureItem label="Private Bathroom" active={!!post.roomFacilities?.hasPrivateBathroom} />
                    <FeatureItem label="Wardrobe" active={!!post.roomFacilities?.hasWardrobe} />
                    <FeatureItem label="Desk & Study Area" active={!!post.roomFacilities?.hasDeskStudyArea} />
                  </div>
                </div>

                {/* Building Amenities */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                    Building Amenities
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureItem label="Parking Space" active={!!post.buildingAmenities?.hasParking} />
                    <FeatureItem label="24/7 Security" active={!!post.buildingAmenities?.has24HourSecurity} />
                    <FeatureItem label="Garden / Outdoor" active={!!post.buildingAmenities?.hasGarden} />
                    <FeatureItem label="Gym / Fitness" active={!!post.buildingAmenities?.hasGym} />
                    <FeatureItem label="Common Lounge" active={!!post.buildingAmenities?.hasCommonRoom} />
                    <FeatureItem label="Laundry Room" active={!!post.buildingAmenities?.hasLaundry} />
                    <FeatureItem label="Power Backup" active={!!post.buildingAmenities?.hasGenerator} />
                    <FeatureItem label="CCTV Surveillance" active={!!post.buildingAmenities?.hasCCTV} />
                  </div>
                </div>
              </div>
            )}

            {/* Meals & Utilities */}
            {isOffer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meal Plan */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                    Meal Plan
                  </h3>
                  <div className="space-y-4">
                     <div className={`flex items-center justify-between p-4 rounded-2xl border ${post.mealPlan?.included ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
                        <span className="font-bold text-slate-900">Meals Included</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${post.mealPlan?.included ? "bg-amber-200 text-amber-800" : "bg-slate-200 text-slate-500"}`}>
                          {post.mealPlan?.included ? "Yes" : "No"}
                        </span>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <FeatureItem label="Breakfast" active={!!post.mealPlan?.breakfast} />
                        <FeatureItem label="Lunch" active={!!post.mealPlan?.lunch} />
                        <FeatureItem label="Dinner" active={!!post.mealPlan?.dinner} />
                        <FeatureItem label="Packing Allowed" active={!!post.mealPlan?.packingAllowed} />
                     </div>
                  </div>
                </div>

                {/* Utilities */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-emerald-600" />
                    Utilities Included
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureItem label="Electricity" active={!!post.utilitiesIncluded?.electricity} />
                    <FeatureItem label="Water Supply" active={!!post.utilitiesIncluded?.water} />
                    <FeatureItem label="Internet Bill" active={!!post.utilitiesIncluded?.internet} />
                    <FeatureItem label="Gas Connection" active={!!post.utilitiesIncluded?.gas} />
                    <FeatureItem label="Waste Collection" active={!!post.utilitiesIncluded?.garbage} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 xl:sticky xl:top-24">
              <div className="mb-8">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">
                  {isOffer ? "Monthly Rent" : "Budget Range"}
                </p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-black text-slate-900">
                    {isOffer
                      ? `LKR ${post.price?.toLocaleString()}`
                      : `LKR ${post.budgetRange?.min?.toLocaleString()} - ${post.budgetRange?.max?.toLocaleString()}`}
                  </h2>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Available From</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {post.availableFrom ? new Date(post.availableFrom).toLocaleDateString() : "Immediate"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Min Lease</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {post.leaseDuration || "Flexible"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${post.contactNumber}`}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Phone className="w-5 h-5" />
                  Call Host
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Listed by</p>
                <div className="flex items-center gap-4">
                   <div className="relative">
                    {post.author.image ? (
                      <img
                        src={post.author.image}
                        alt={post.author.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shadow-md">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 truncate">{post.author.name}</p>
                      <p className="text-xs font-bold text-slate-500 truncate uppercase tracking-tighter">
                        {post.author.university || "Verified Member"}
                      </p>
                   </div>
                   <Link href={`/profile/${post.author._id}`} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <ChevronRight className="w-5 h-5" />
                   </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
