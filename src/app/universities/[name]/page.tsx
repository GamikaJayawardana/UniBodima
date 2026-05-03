"use client";

import { useEffect, useState } from "react";
import { searchAndFilterPosts } from "@/app/actions/postActions";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { MapPin, Users, BookOpen } from "lucide-react";

const UNIVERSITY_INFO: {
  [key: string]: {
    description: string;
    city: string;
    established: number;
    students: string;
    faculties: number;
    image: string;
  };
} = {
  "University of Colombo": {
    description: "The oldest university in Sri Lanka, located in Colombo.",
    city: "Colombo",
    established: 1921,
    students: "10,000+",
    faculties: 5,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "University of Moratuwa": {
    description:
      "Sri Lanka's leading technology university specializing in engineering and technology.",
    city: "Moratuwa",
    established: 1978,
    students: "8,000+",
    faculties: 5,
    image:
      "https://images.unsplash.com/photo-1434637866556-6b63e9b50cea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "University of Kelaniya": {
    description:
      "Located on the outskirts of Colombo, known for liberal arts education.",
    city: "Kelaniya",
    established: 1959,
    students: "12,000+",
    faculties: 7,
    image:
      "https://images.unsplash.com/photo-1549144992-afc6e1f4d1e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "University of Sri Jayewardenepura": {
    description:
      "Established in 1873, one of the premier universities in Sri Lanka.",
    city: "Nugegoda",
    established: 1873,
    students: "9,000+",
    faculties: 6,
    image:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  "University of Peradeniya": {
    description: "Located in Kandy, the cultural capital of Sri Lanka.",
    city: "Kandy",
    established: 1942,
    students: "11,000+",
    faculties: 8,
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
};

export default function UniversityPage({
  params,
}: {
  params: { name: string };
}) {
  const universityName = decodeURIComponent(params.name);
  const info = UNIVERSITY_INFO[universityName];

  const [offers, setOffers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);

      const offersResult = await searchAndFilterPosts({
        type: "offer",
        university: universityName,
        limit: 8,
      });

      const requestsResult = await searchAndFilterPosts({
        type: "request",
        university: universityName,
        limit: 8,
      });

      if (offersResult.success) {
        setOffers(offersResult.posts);
      }

      if (requestsResult.success) {
        setRequests(requestsResult.posts);
      }

      setLoading(false);
    }

    loadPosts();
  }, [universityName]);

  if (!info) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            University Not Found
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url('${info.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-2">
              {universityName}
            </h1>
            <p className="text-gray-200">Established {info.established}</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Location</h3>
                <p className="text-gray-600">{info.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Students</h3>
                <p className="text-gray-600">{info.students}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Faculties</h3>
                <p className="text-gray-600">{info.faculties}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-lg">{info.description}</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Offers */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Available Spaces
            </h2>
            <Link
              href={`/offers?university=${encodeURIComponent(universityName)}`}
              className="text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No available spaces yet</p>
              <Link href="/create" className="text-blue-600 hover:underline">
                Post a space →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offers.map((post) => (
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
          )}
        </section>

        {/* Requests */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Student Requests
            </h2>
            <Link
              href={`/requests?university=${encodeURIComponent(universityName)}`}
              className="text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No requests yet</p>
              <Link href="/create" className="text-blue-600 hover:underline">
                Post a request →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {requests.map((post) => (
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
          )}
        </section>
      </div>
    </div>
  );
}
