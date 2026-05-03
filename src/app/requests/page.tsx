"use client";

import { useEffect, useState } from "react";
import { searchAndFilterPosts } from "@/app/actions/postActions";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Filter } from "lucide-react";

interface FilterState {
  university?: string;
  priceMin?: number;
  priceMax?: number;
  genderPreference?: string;
  district?: string;
  rating?: number;
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

export default function RequestsPage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 12,
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
    async function loadPosts() {
      setLoading(true);
      const result = await searchAndFilterPosts({
        type: "request",
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
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 12 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Student Requests
          </h1>
          <p className="text-gray-600">
            Find students looking for spaces to rent in Sri Lanka
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            + Post Your Request
          </Link>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Budget (LKR)
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Budget (LKR)
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </label>
                <select
                  value={filters.genderPreference || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "genderPreference",
                      e.target.value || undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={filters.district || ""}
                  onChange={(e) =>
                    handleFilterChange("district", e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Districts</option>
                  {SRI_LANKAN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters.rating || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "rating",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">
              No requests found matching your criteria
            </p>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {posts.map((post) => (
                <Link key={post._id} href={`/posts/${post._id}`}>
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
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handleFilterChange("page", page)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        filters.page === page
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
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

        <div className="text-center text-gray-600 text-sm mt-8">
          {pagination.total} request{pagination.total !== 1 ? "s" : ""} found
        </div>
      </div>
    </div>
  );
}
