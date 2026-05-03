import UniversityGrid from "@/components/UniversityGrid";
import PostCard from "@/components/PostCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/app/actions/postActions";

export default async function Home() {
  const latestOffers = await getPosts("offer", 8);
  const latestRequests = await getPosts("request", 8);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight max-w-5xl">
            Wherever life takes you, <br className="hidden md:block" />
            your next home awaits.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl text-balance font-medium">
            Find short - and long-term rentals in every corner of the world. Move smart with verified listings and local support.
          </p>

          <Link href="/offers" className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
            Explore Rentals
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* University Grid Section */}
      <div className="bg-[#FCFCFD] relative z-20">
        <UniversityGrid />
      </div>

      {/* Recent Offers Section */}
      <section className="py-16 bg-white relative z-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Offers</h2>
              <p className="text-slate-500">Discover the latest spaces available for rent.</p>
            </div>
            <Link href="/offers" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View all offers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestOffers.length > 0 ? (
              latestOffers.map((post: any) => (
                <PostCard 
                  key={post._id} 
                  id={post._id}
                  type={post.type}
                  title={post.title}
                  price={post.price}
                  location={post.address}
                  targetUniversity={post.targetUniversity}
                  genderPreference={post.genderPreference}
                  imageUrl={post.images?.[0]}
                  createdAt={new Date(post.createdAt).toLocaleDateString()}
                  authorName={post.author.name}
                />
              ))
            ) : (
              <p className="col-span-full text-slate-500 text-center py-8">No offers available yet.</p>
            )}
          </div>
          
          <div className="mt-10 flex justify-center sm:hidden">
            <Link href="/offers" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors px-6 py-3 border border-blue-200 rounded-full w-full justify-center">
              View all offers
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Requests Section */}
      <section className="py-16 bg-gray-50 relative z-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Requests</h2>
              <p className="text-slate-500">See what students are currently looking for.</p>
            </div>
            <Link href="/requests" className="hidden sm:flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors">
              View all requests
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestRequests.length > 0 ? (
              latestRequests.map((post: any) => (
                <PostCard 
                  key={post._id} 
                  id={post._id}
                  type={post.type}
                  title={post.title}
                  budgetRange={post.budgetRange}
                  location={post.address}
                  targetUniversity={post.targetUniversity}
                  genderPreference={post.genderPreference}
                  createdAt={new Date(post.createdAt).toLocaleDateString()}
                  authorName={post.author.name}
                />
              ))
            ) : (
              <p className="col-span-full text-slate-500 text-center py-8">No requests available yet.</p>
            )}
          </div>
          
          <div className="mt-10 flex justify-center sm:hidden">
            <Link href="/requests" className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors px-6 py-3 border border-purple-200 rounded-full w-full justify-center">
              View all requests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
