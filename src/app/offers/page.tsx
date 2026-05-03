"use client";

import { useEffect, useState, Suspense } from "react";
import { searchAndFilterPosts } from "@/app/actions/postActions";
import { Compass, X, Filter, Search, RotateCcw, Plus } from "lucide-react";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  mealIncluded?: boolean;
  rating?: number;
  distanceMax?: number;
  q?: string;
  page: number;
  limit: number;
}

const SRI_LANKAN_UNIVERSITIES = [
  "University of Colombo",
  "University of Moratuwa",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Peradeniya",
  "Open University of Sri Lanka",
  "SLIIT",
  "NSBM",
  "IIT",
];

const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matara",
  "Galle",
  "Jaffna",
  "Mullaitivu",
  "Vavuniya",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
  "Puttalam",
  "Ratnapura",
  "Kegalle",
  "Nuwara Eliya",
  "Badulla",
  "Monaragala",
  "Ampara",
  "Batticaloa",
  "Trincomalee",
];

function OffersContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || undefined;

  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 12,
    q: initialQ,
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  });

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== filters.q) {
      setFilters(prev => ({ ...prev, q: q || undefined, page: 1 }));
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const result = await searchAndFilterPosts({
        type: "offer",
        ...filters,
      });
      if (result.success) {
        setPosts(result.posts);
        setPagination(result.pagination);
      }
      setLoading(false);
    }
    loadPosts();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 12 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Available Spaces
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">
            Discover the perfect room or apartment tailored for student life in Sri Lanka. 
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                showFilters 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            
            {filters.q && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-100">
                <Search className="w-4 h-4" />
                <span>Results for "{filters.q}"</span>
                <button 
                  onClick={() => handleFilterChange("q", undefined)}
                  className="ml-2 hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          
          <Link
            href="/create?type=offer"
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="w-5 h-5" />
            Post Your Space
          </Link>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-[32px] shadow-xl p-8 mb-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  University
                </label>
                <select
                  value={filters.university || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "university",
                      e.target.value || undefined,
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option value="">All Universities</option>
                  {SRI_LANKAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Min Price (LKR)
                </label>
                <input
                  type="number"
                  value={filters.priceMin || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "priceMin",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  placeholder="Min"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Max Price (LKR)
                </label>
                <input
                  type="number"
                  value={filters.priceMax || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "priceMax",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  placeholder="Max"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Room Type
                </label>
                <select
                  value={filters.roomType || ""}
                  onChange={(e) =>
                    handleFilterChange("roomType", e.target.value || undefined)
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option value="">All Types</option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="dorm">Dorm</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.hasWiFi || false}
                  onChange={(e) =>
                    handleFilterChange("hasWiFi", e.target.checked || undefined)
                  }
                  className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">WiFi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.hasAC || false}
                  onChange={(e) =>
                    handleFilterChange("hasAC", e.target.checked || undefined)
                  }
                  className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">AC</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.hasFurnished || false}
                  onChange={(e) =>
                    handleFilterChange(
                      "hasFurnished",
                      e.target.checked || undefined,
                    )
                  }
                  className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Furnished</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.hasParking || false}
                  onChange={(e) =>
                    handleFilterChange(
                      "hasParking",
                      e.target.checked || undefined,
                    )
                  }
                  className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Parking</span>
              </label>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all hover:text-slate-900"
              >
                <RotateCcw className="w-4.5 h-4.5" />
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-200" />
             </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No results found</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">
              We couldn't find any spaces matching your current filters. Try resetting or adjusting them.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {posts.map((post) => (
                <div key={post._id} className="hover:-translate-y-1 transition-transform duration-300">
                  <Link href={`/posts/${post._id}`}>
                    <PostCard
                      id={post._id}
                      type={post.type}
                      title={post.title}
                      price={post.price}
                      budgetRange={post.budgetRange}
                      location={post.address}
                      targetUniversity={post.targetUniversity}
                      genderPreference={post.genderPreference}
                      imageUrl={post.images?.[0]}
                      createdAt={post.createdAt}
                      authorName={post.author?.name || "Unknown"}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-3 mb-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handleFilterChange("page", page)}
                      className={`w-12 h-12 rounded-xl font-black transition-all ${
                        filters.page === page
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}

        <div className="text-center text-slate-400 text-sm mt-12 font-bold tracking-tight uppercase">
          Showing {posts.length} of {pagination.total} spaces available
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OffersContent />
    </Suspense>
  );
}
