"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, GraduationCap, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUniversityCounts } from "@/app/actions/postActions";

const allUniversities = [
  {
    name: "University of Colombo",
    location: "Colombo 07",
    color: "bg-indigo-600",
    logo: "https://cmb.ac.lk/wp-content/uploads/logo-color.png",
  },
  {
    name: "University of Moratuwa",
    location: "Moratuwa",
    color: "bg-emerald-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/60/University_of_Moratuwa_logo.png",
  },
  {
    name: "University of Kelaniya",
    location: "Kelaniya",
    color: "bg-teal-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/e/e0/Kelaniya.png",
  },
  {
    name: "University of Sri Jayewardenepura",
    location: "Nugegoda",
    color: "bg-purple-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1f/University_of_Sri_Jayewardenepura_crest.png",
  },
  {
    name: "University of Peradeniya",
    location: "Peradeniya",
    color: "bg-amber-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/University_of_Peradeniya_crest.png",
  },
  {
    name: "University of Ruhuna",
    location: "Matara",
    color: "bg-rose-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/2e/University_of_Ruhuna_logo.png",
  },
  {
    name: "University of Jaffna",
    location: "Jaffna",
    color: "bg-orange-500",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/UoJ_logo.png",
  },
  {
    name: "SLIIT",
    location: "Malabe",
    color: "bg-slate-900",
    logo: "https://images.seeklogo.com/logo-png/61/2/sliit-campus-logo-png_seeklogo-611785.png",
  },
  {
    name: "NSBM",
    location: "Homagama",
    color: "bg-green-700",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9b/NSBM_Green_University_seal.png",
  },
  {
    name: "IIT",
    location: "Colombo 06",
    color: "bg-red-700",
    logo: "https://education.iit.ac.lk/pluginfile.php/1/theme_remui/logomini/1748492830/IIT_Logo_PNG.png",
  },
  {
    name: "Horizon Campus",
    location: "Malabe",
    color: "bg-blue-600",
    logo: "https://nica.team/wp-content/uploads/2022/10/Logo_Campus_1.png",
  },
  {
    name: "KDU",
    location: "Ratmalana",
    color: "bg-green-800",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/23/Kotelawala_Defence_University_crest.png",
  },
  {
    name: "Wayamba University",
    location: "Kuliyapitiya",
    color: "bg-blue-500",
    logo: "https://wyb.ac.lk/wp-content/uploads/2021/12/NewLogoWUSL.svg",
  },
  {
    name: "Rajarata University",
    location: "Mihintale",
    color: "bg-red-800",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Rajarata_logo.png/250px-Rajarata_logo.png",
  },
  {
    name: "Sabaragamuwa University",
    location: "Belihuloya",
    color: "bg-yellow-700",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/5a/Logo-SUSL.png",
  },
  {
    name: "Eastern University",
    location: "Batticaloa",
    color: "bg-red-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a0/EUSL_logo2.png",
  },
  {
    name: "South Eastern University",
    location: "Oluvil",
    color: "bg-green-600",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/6c/South_Eastern_University_of_Sri_Lanka_logo.png",
  },
  {
    name: "Uva Wellassa University (UWU)",
    location: "Badulla",
    color: "bg-amber-700",
    logo: "https://internhub.lk/static/img/universities/logo/uva-wellassa-university.png",
  },
  {
    name: "Open University",
    location: "Nawala",
    color: "bg-blue-800",
    logo: "https://ou.ac.lk/wp-content/uploads/2026/03/ousl-logo-512-transparent.png",
  },
];

export default function UniversityGrid() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      setIsLoading(true);
      const fetchedCounts = await getUniversityCounts();
      setCounts(fetchedCounts || {});
      setIsLoading(false);
    }
    loadCounts();
  }, []);

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, allUniversities.length));
  };

  const visibleUniversities = allUniversities.slice(0, visibleCount);

  return (
    <section
      id="universities"
      className="py-20 flex flex-col justify-center bg-slate-50/50 relative overflow-hidden"
    >
      {/* Background Architectural Elements */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              Find Housing Near <br /> Your Institution.
            </h2>
          </div>
          <p className="text-lg text-slate-500 font-medium max-w-md lg:text-right">
            We've mapped out the best student accommodations across Sri Lanka's
            leading universities to make your search effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleUniversities.map((uni, index) => {
            const slug = uni.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "");
            return (
              <Link
                key={index}
                href={`/university/${slug}`}
                className="group relative p-6 rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-sky-100 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Content */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="bg-slate-50 p-3 rounded-[18px] border border-slate-100 group-hover:scale-105 transition-transform duration-500 shrink-0">
                    <img
                      src={
                        uni.logo
                          ? uni.logo
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name.replace("University of ", "").replace("University", ""))}&color=0f172a&background=f8fafc&size=100&font-size=0.4&bold=true`
                      }
                      alt={`${uni.name} Logo`}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  </div>

                  <div className="flex-1 pr-2">
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                      {uni.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-semibold mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {uni.location}
                    </div>
                  </div>

                  <div className="self-start mt-1 shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Available Listings
                  </span>
                  <span className="flex items-center justify-center px-4 py-1 bg-sky-50 text-sky-600 rounded-lg font-bold text-xs">
                    {isLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin mx-2" />
                    ) : (
                      counts[uni.name] || 0
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {visibleCount < allUniversities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={showMore}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-black text-sm hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-slate-900/20"
            >
              Load More Universities
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
