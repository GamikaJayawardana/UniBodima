import { Metadata } from "next";
import { searchAndFilterPosts } from "@/app/actions/postActions";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ArrowRight, MapPin, GraduationCap } from "lucide-react";
import { notFound } from "next/navigation";

const universitiesData = [
  { name: "University of Colombo", location: "Colombo 07" },
  { name: "University of Moratuwa", location: "Moratuwa" },
  { name: "University of Kelaniya", location: "Kelaniya" },
  { name: "University of Sri Jayewardenepura", location: "Nugegoda" },
  { name: "University of Peradeniya", location: "Peradeniya" },
  { name: "University of Ruhuna", location: "Matara" },
  { name: "University of Jaffna", location: "Jaffna" },
  { name: "SLIIT", location: "Malabe" },
  { name: "NSBM", location: "Homagama" },
  { name: "IIT", location: "Colombo 06" },
  { name: "Horizon Campus", location: "Malabe" },
  { name: "KDU", location: "Ratmalana" },
  { name: "Wayamba University", location: "Kuliyapitiya" },
  { name: "Rajarata University", location: "Mihintale" },
  { name: "Sabaragamuwa University", location: "Belihuloya" },
  { name: "Eastern University", location: "Batticaloa" },
  { name: "South Eastern University", location: "Oluvil" },
  { name: "Uva Wellassa University (UWU)", location: "Badulla" },
  { name: "Open University", location: "Nawala" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const uni = universitiesData.find(
    (u) => slugify(u.name) === resolvedParams.slug,
  );

  if (!uni) return { title: "Not Found" };

  return {
    title: `Boarding Places & Apartments near ${uni.name} | UniBoarding.com`,
    description: `Find the best and most affordable student housing, boarding places, and apartments near ${uni.name}, located in ${uni.location}, Sri Lanka. Verified safe student accommodations.`,
    keywords: [
      `Bodima near ${uni.name}`,
      `${uni.name} student housing`,
      `boarding places in ${uni.location}`,
      `apartments near ${uni.name}`,
      `student hostels ${uni.location}`,
    ],
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const uni = universitiesData.find(
    (u) => slugify(u.name) === resolvedParams.slug,
  );

  if (!uni) {
    notFound();
  }

  // Fetch offers and requests for this university
  const offersData = await searchAndFilterPosts({
    type: "offer",
    university: uni.name,
    limit: 6,
  });
  const requestsData = await searchAndFilterPosts({
    type: "request",
    university: uni.name,
    limit: 6,
  });

  const offers = (offersData as any).posts || offersData || [];
  const requests = (requestsData as any).posts || requestsData || [];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      {/* University Hero Header */}
      <section className="bg-slate-900 text-white py-24 mb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/10 p-4 rounded-3xl mb-6 backdrop-blur-md">
            <GraduationCap className="w-12 h-12 text-sky-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
            Housing near {uni.name}
          </h1>
          <div className="flex items-center gap-2 text-slate-300 text-lg font-medium">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>{uni.location}, Sri Lanka</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 space-y-24">
        {/* Offers Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Available Boarding Places
              </h2>
              <p className="text-slate-500 font-medium">
                Verified apartments, annexes, and rooms near {uni.name}.
              </p>
            </div>
            <Link
              href={`/offers?university=${encodeURIComponent(uni.name)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-50 text-sky-700 font-bold rounded-xl hover:bg-sky-100 transition-colors"
            >
              View all offers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.slice(0, 6).map((post: any) => (
                <PostCard
                  key={post._id || post.id}
                  {...post}
                  id={post._id || post.id}
                  imageUrl={post.images?.[0]}
                  authorName={post.author?.name}
                  authorRole={post.author?.role}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-[24px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No offers available directly matching {uni.name} out right now.
              </h3>
              <p className="text-slate-500 mb-6">
                Check the main offers page or broaden your search slightly.
              </p>
              <Link
                href="/offers"
                className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold"
              >
                Browse All Offers
              </Link>
            </div>
          )}
        </section>

        {/* Requests Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Students Looking for Places
              </h2>
              <p className="text-slate-500 font-medium">
                See requests from students studying at {uni.name}.
              </p>
            </div>
            <Link
              href={`/requests?university=${encodeURIComponent(uni.name)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
            >
              View all requests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {requests.slice(0, 6).map((post: any) => (
                <PostCard
                  key={post._id || post.id}
                  {...post}
                  id={post._id || post.id}
                  imageUrl={post.images?.[0]}
                  authorName={post.author?.name}
                  authorRole={post.author?.role}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-[24px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No housing requests posted yet for {uni.name}.
              </h3>
              <p className="text-slate-500">
                Landlords! Have a property here? List it now to grab attention.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
