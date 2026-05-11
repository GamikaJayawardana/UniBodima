"use client";

import { useEffect, useState, Suspense } from "react";
import { searchAndFilterPosts } from "@/app/actions/postActions";
import { Compass, X, Filter, Search, RotateCcw, Plus, Sparkles, SlidersHorizontal, MapPin, GraduationCap, ChevronDown } from "lucide-react";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SRI_LANKA_DISTRICTS, UNIVERSITIES } from "@/lib/constants";

interface FilterState {
  university?: string;
  priceMin?: number;
  priceMax?: number;
  genderPreference?: string;
  roomType?: string;
  district?: string;
  hasWiFi?: boolean;
  hasAC?: boolean;
  hasFurnished?: boolean;
  hasParking?: boolean;
  sortBy?: string;
}



function OffersContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    university: searchParams.get("university") || "",
    district: searchParams.get("district") || "",
    genderPreference: "",
    roomType: "",
    sortBy: "newest",
    priceMin: undefined,
    priceMax: undefined,
    hasWiFi: false,
    hasAC: false,
    hasFurnished: false,
    hasParking: false,
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    handleSearch();
  }, [searchParams]);

  async function handleSearch() {
    setLoading(true);
    const result = await searchAndFilterPosts({
      type: "offer",
      query: searchQuery,
      ...filters,
    });
    if (result.success) {
      setPosts(result.posts);
    }
    setLoading(false);
  }

  const clearFilters = () => {
    setFilters({
      university: "",
      district: "",
      genderPreference: "",
      roomType: "",
      sortBy: "newest",
      priceMin: undefined,
      priceMax: undefined,
      hasWiFi: false,
      hasAC: false,
      hasFurnished: false,
      hasParking: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/5 border border-slate-100">
                <Compass className="w-4 h-4" />
                <span>Marketplace Discovery</span>
             </div>
             <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Explore <span className="text-sky-600">Offers.</span>
             </h1>
             <p className="text-xl text-slate-500 font-medium max-w-xl">
                Browse through premium student accommodations verified for quality and security.
             </p>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${showFilters ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/20' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
             >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? 'Close Filters' : 'Filter Options'}
             </button>
             <Link href="/create" className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Plus className="w-5 h-5" />
                List Property
             </Link>
          </div>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-2xl mb-16 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Search */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keywords</label>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     placeholder="Search title, description..."
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
              </div>

              {/* University */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target University</label>
                <div className="relative">
                   <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select
                     className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                     value={filters.university}
                     onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                   >
                     <option value="">All Universities</option>
                     {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* District */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / District</label>
                <div className="relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select
                     className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                     value={filters.district}
                     onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                   >
                     <option value="">All Districts</option>
                     {SRI_LANKA_DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Preference</label>
                <div className="grid grid-cols-3 gap-2">
                   {["Any", "Male", "Female"].map(g => (
                      <button 
                        key={g} 
                        onClick={() => setFilters({ ...filters, genderPreference: g === "Any" ? "" : g })}
                        className={`py-4 rounded-2xl font-bold text-xs transition-all border ${filters.genderPreference === (g === "Any" ? "" : g) ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                      >
                        {g}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
              {/* Budget / Price Range */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range (LKR)</label>
                 <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
                      value={filters.priceMin || ""}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
                      value={filters.priceMax || ""}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value ? Number(e.target.value) : undefined })}
                    />
                 </div>
              </div>

              {/* Sorting */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort By</label>
                 <div className="relative">
                   <select
                     className="w-full pl-6 pr-10 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                     value={filters.sortBy || "newest"}
                     onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                   >
                     <option value="newest">Newest First</option>
                     <option value="price_asc">Price: Low to High</option>
                     <option value="price_desc">Price: High to Low</option>
                     <option value="distance_asc">Closest to University</option>
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
               <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                     <input 
                        type="checkbox" 
                        id="wifi" 
                        className="w-5 h-5 rounded-lg border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={filters.hasWiFi || false}
                        onChange={(e) => setFilters({...filters, hasWiFi: e.target.checked})}
                     />
                     <label htmlFor="wifi" className="text-sm font-bold text-slate-600">Free Wi-Fi</label>
                  </div>
                  <div className="flex items-center gap-3">
                     <input 
                        type="checkbox" 
                        id="ac" 
                        className="w-5 h-5 rounded-lg border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={filters.hasAC || false}
                        onChange={(e) => setFilters({...filters, hasAC: e.target.checked})}
                     />
                     <label htmlFor="ac" className="text-sm font-bold text-slate-600">Air Conditioning</label>
                  </div>
                  <div className="flex items-center gap-3">
                     <input 
                        type="checkbox" 
                        id="furnished" 
                        className="w-5 h-5 rounded-lg border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={filters.hasFurnished || false}
                        onChange={(e) => setFilters({...filters, hasFurnished: e.target.checked})}
                     />
                     <label htmlFor="furnished" className="text-sm font-bold text-slate-600">Furnished</label>
                  </div>
                  <div className="flex items-center gap-3">
                     <input 
                        type="checkbox" 
                        id="parking" 
                        className="w-5 h-5 rounded-lg border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={filters.hasParking || false}
                        onChange={(e) => setFilters({...filters, hasParking: e.target.checked})}
                     />
                     <label htmlFor="parking" className="text-sm font-bold text-slate-600">Parking</label>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-slate-600 font-bold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Filters
                  </button>
                  <button 
                    onClick={handleSearch}
                    className="px-10 py-4 bg-sky-600 text-white rounded-2xl font-black shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all"
                  >
                    Apply Filters
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-6">
               <Compass className="w-8 h-8 animate-spin" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Scanning Marketplace...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-[48px] p-24 text-center border border-slate-100 shadow-2xl animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No offers found.</h3>
            <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto">We couldn't find any listings matching your current filter criteria. Try expanding your search area.</p>
            <button onClick={clearFilters} className="px-12 py-5 bg-sky-600 text-white rounded-[24px] font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20">Clear All Search Data</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                type={post.type}
                title={post.title}
                price={post.price}
                district={post.district}
                targetUniversity={post.targetUniversity}
                genderPreference={post.genderPreference}
                imageUrl={post.images?.[0]}
                createdAt={post.createdAt}
                authorName={post.author?.name || "Verified Member"}
                authorRole={post.author?.role}
                roomType={post.roomType}
                occupancy={post.occupancy}
                distanceToUni={post.distanceToUni}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OffersContent />
    </Suspense>
  );
}
