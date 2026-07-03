import {
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Search,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Zap,
  Star,
  LayoutGrid,
  CheckCircle2,
  Globe,
  ArrowUpRight,
  Bed,
  SlidersHorizontal,
  Maximize,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/app/actions/postActions";
import PostCard from "@/components/PostCard";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import UniversityGrid from "@/components/UniversityGrid";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let savedPostIds: string[] = [];

  if (session?.user) {
    await connectToDatabase();
    const user = await User.findById((session.user as any).id).select(
      "savedPosts",
    );
    if (user) {
      savedPostIds = user.savedPosts?.map((id: any) => id.toString()) || [];
    }
  }

  const latestOffers = await getPosts("offer", 6);
  const latestRequests = await getPosts("request", 6);

  return (
    <div className="flex flex-col w-full bg-white font-sans text-slate-900">
      <Navbar />

      {/* Hero Section - Full Screen High-Impact Design */}
      <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 relative overflow-hidden bg-white">
        {/* Architectural Background Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="container mx-auto px-6 flex flex-col gap-8 lg:gap-10 relative z-10">
          {/* Hero Header Area */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-6">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tighter leading-[0.9] text-slate-900">
                Smart Student Housing
                <br />
                for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                  Sri Lanka.
                </span>
              </h1>
            </div>
            <div className="lg:pl-20 space-y-5 pb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                © 2026 BOARDINGFOR.ME. THE ULTIMATE HUB.
              </p>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm italic">
                Connecting university students with verified boarding places and
                apartments across the island.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="w-full h-[240px] sm:h-[360px] lg:h-[46vh] xl:h-[50vh] lg:max-h-[560px] rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-3xl relative group border-[8px] lg:border-[12px] border-slate-50">
              <img
                src="heroimage.avif"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Modern Student Housing"
              />
              <div className="absolute inset-0 bg-slate-900/10 transition-opacity group-hover:opacity-0 duration-500"></div>
            </div>

            {/* Premium Search Component */}
            <HeroSearch />
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 right-10 hidden xl:flex items-center gap-4 text-slate-300 group cursor-pointer">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-slate-900 transition-colors">
            Scroll Discover
          </span>
          <div className="w-px h-12 bg-slate-100 group-hover:h-16 transition-all duration-500 relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-sky-500 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* About Us Section - Full Screen High-Impact UI */}
      <section className="min-h-screen bg-white relative overflow-hidden flex flex-col justify-center py-24">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-20 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-24 mb-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="inline-flex items-center gap-2 text-sky-600 font-black text-[11px] uppercase tracking-[0.3em]">
                <div className="w-10 h-px bg-sky-600"></div>
                Our Mission
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Redefining the <br />
                Student Housing <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                  Experience.
                </span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                BoardingFor.me was born from a simple observation: finding a safe,
                affordable place to stay as a student shouldn't be a full-time
                job. We've built the infrastructure to make it instant.
              </p>
            </div>

            <div className="lg:w-1/2 flex flex-col gap-6 w-full">
              {[
                {
                  label: "Active Students",
                  value: "5,000+",
                  detail: "Across Sri Lanka",
                },
                {
                  label: "Verified Listings",
                  value: "150+",
                  detail: "Hand-picked Quality",
                },
                {
                  label: "Universities",
                  value: "15+",
                  detail: "Growing Network",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group border-b border-slate-100 pb-6 flex items-end justify-between hover:border-slate-900 transition-colors duration-500"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-2xl text-slate-400 font-bold">
                      {stat.detail}
                    </p>
                  </div>
                  <p className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform duration-500 origin-right">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* University Grid Section */}
      <UniversityGrid />

      {/* Latest Housing Offers Section */}
      <section className="py-20 md:py-40 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tight text-slate-900">
                Latest Housing{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                  Offers
                </span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto lg:mx-0">
                Explore the newest boarding places and student apartments.
                Verified for safety and comfort.
              </p>
            </div>
            <Link
              href="/offers"
              className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
            >
              More Offers <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {latestOffers.map((post: any) => (
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
                authorName={post.author?.name || "Verified Partner"}
                authorRole={post.author?.role}
                roomType={post.roomType}
                occupancy={post.occupancy}
                isSavedInitial={savedPostIds.includes(post._id.toString())}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Housing Requests Section */}
      <section className="py-20 md:py-40 bg-white">
        <div className="container mx-auto px-6 border-t border-slate-100 pt-20 md:pt-40">
          <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tight text-slate-900">
                Latest Housing{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                  Requests
                </span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto lg:mx-0">
                Students looking for roommates or boarding places. Help them
                find their perfect home near campus.
              </p>
            </div>
            <Link
              href="/requests"
              className="px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              More Requests <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {latestRequests.map((post: any) => (
              <PostCard
                key={post._id}
                id={post._id}
                type={post.type}
                title={post.title}
                budgetRange={post.budgetRange}
                district={post.district}
                targetUniversity={post.targetUniversity}
                genderPreference={post.genderPreference}
                imageUrl={post.images?.[0]}
                createdAt={post.createdAt}
                authorName={post.author?.name || "Verified Partner"}
                authorRole={post.author?.role}
                roomType={post.roomType}
                occupancy={post.occupancy}
                isSavedInitial={savedPostIds.includes(post._id.toString())}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl space-y-6 mb-15 text-center lg:text-left mx-auto lg:mx-0">
            <h2 className="text-6xl font-black tracking-tight text-slate-900">
              How it{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                Works
              </span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              At BoardingFor.me, we make finding student housing simple. No more
              wandering around campus streets looking for "Boarding" signs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
            {[
              {
                no: "01",
                icon: <SlidersHorizontal className="w-6 h-6" />,
                title: "Search by University",
                desc: "Filter listings by proximity to your specific campus and faculty to minimize your daily commute.",
              },
              {
                no: "02",
                icon: <Calendar className="w-6 h-6" />,
                title: "Compare Amenities",
                desc: "Evaluate properties based on study-critical features like Wi-Fi, power backup, and quiet environments.",
              },
              {
                no: "03",
                icon: <Users className="w-6 h-6" />,
                title: "Find Roommates",
                desc: "Connect with other students looking for shared spaces to split costs and build your campus community.",
              },
              {
                no: "04",
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Book with Confidence",
                desc: "Reach out to verified hosts, visit the place if needed, and secure your new student home for the academic year.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 md:p-12 space-y-10 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-white group-hover:shadow-xl transition-all">
                    {item.icon}
                  </div>
                  <span className="text-xl font-bold text-slate-200">
                    {item.no}
                  </span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic CTA Area */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-white">
        {/* Subtle architectural background pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Soft elegant glow in the background */}
        <div className="absolute inset-0 max-w-4xl mx-auto h-full w-full bg-gradient-to-t from-sky-50 via-transparent to-transparent opacity-80 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              Ready to find your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
                safe haven?
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Join thousands of university students who have already simplified
              their campus living experience with BoardingFor.me.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Link
                href="/create"
                className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-[15px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group"
              >
                Post a Listing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/offers"
                className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-full font-bold text-[15px] hover:border-slate-300 hover:bg-slate-50 transition-all text-center"
              >
                Browse Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
