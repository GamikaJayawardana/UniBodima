"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  getSavedPosts,
} from "@/app/actions/userActions";
import { getUserPosts } from "@/app/actions/postActions";
import Link from "next/link";
import { LogOut, Edit, Heart, FileText, MessageSquare } from "lucide-react";
import PostCard from "@/components/PostCard";

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "posts" | "saved">(
    "profile",
  );

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

        const resolvedUserId =
          (userResult.success && (userResult.user as any)?._id) ||
          sessionUser.id;

        if (resolvedUserId) {
          const postsResult = await getUserPosts(resolvedUserId);
          if (postsResult.success) {
            setUserPosts(postsResult.posts);
          }
        }

        const savedResult = await getSavedPosts();
        if (savedResult.success && savedResult.posts) {
          setSavedPosts(savedResult.posts);
        }

        setLoading(false);
      }

      loadUserData();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user && status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Could not load profile</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const verificationColor = {
    unverified: "text-gray-600",
    "email-verified": "text-blue-600",
    "phone-verified": "text-blue-600",
    "fully-verified": "text-green-600",
  }[user.verificationStatus || "unverified"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                {user.rating && (
                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                    ★ {user.rating.toFixed(1)} ({user.reviewCount} reviews)
                  </div>
                )}
                {user.verificationStatus && (
                  <p className={`text-sm ${verificationColor} mt-2 capitalize`}>
                    ✓ {user.verificationStatus.replace("-", " ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/profile/edit"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            {user.university && (
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-semibold text-gray-800">{user.university}</p>
              </div>
            )}
            {user.yearOfStudy && (
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-gray-800">
                  {user.yearOfStudy}
                </p>
              </div>
            )}
            {user.phoneNumber && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">
                  {user.phoneNumber}
                </p>
              </div>
            )}
            {user.district && (
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p className="font-semibold text-gray-800">{user.district}</p>
              </div>
            )}
          </div>

          {user.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            About
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === "posts"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            My Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === "saved"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Saved ({savedPosts.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About Me</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                {user.university && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      University
                    </label>
                    <p className="text-gray-800">{user.university}</p>
                  </div>
                )}
                {user.yearOfStudy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Year of Study
                    </label>
                    <p className="text-gray-800">{user.yearOfStudy}</p>
                  </div>
                )}
                {user.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone Number
                    </label>
                    <p className="text-gray-800">{user.phoneNumber}</p>
                  </div>
                )}
                {user.district && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      District
                    </label>
                    <p className="text-gray-800">{user.district}</p>
                  </div>
                )}
              </div>
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Bio
                  </label>
                  <p className="text-gray-800">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            {userPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">
                  You haven't posted anything yet
                </p>
                <Link href="/create" className="text-blue-600 hover:underline">
                  Create your first post →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userPosts.map((post) => (
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
                      authorName={user.name}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            {savedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">
                  You haven't saved any posts yet
                </p>
                <Link href="/offers" className="text-blue-600 hover:underline">
                  Browse available spaces →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedPosts.map((post) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
