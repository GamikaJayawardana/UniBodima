"use client";

import { GraduationCap, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const universities = [
  { name: "University of Colombo", listings: 124 },
  { name: "University of Moratuwa", listings: 98 },
  { name: "University of Peradeniya", listings: 85 },
  { name: "University of Kelaniya", listings: 110 },
  { name: "University of Sri Jayewardenepura", listings: 145 },
  { name: "University of Ruhuna", listings: 42 },
  { name: "University of Jaffna", listings: 36 },
  { name: "Rajarata University", listings: 28 },
  { name: "Sabaragamuwa University", listings: 31 },
  { name: "Eastern University", listings: 18 },
  { name: "South Eastern University", listings: 15 },
  { name: "Wayamba University", listings: 24 },
  { name: "Uva Wellassa University", listings: 22 },
  { name: "Open University", listings: 56 },
  { name: "SLIIT", listings: 89 },
  { name: "NSBM", listings: 74 },
  { name: "KDU", listings: 45 },
];

export default function UniversityGrid() {
  const [showAll, setShowAll] = useState(false);
  const displayedUniversities = showAll
    ? universities
    : universities.slice(0, 8);

  return (
    <section id="universities" className="py-16 container mx-auto px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Find a space near your campus
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl">
          Explore verified offers and requests around major universities and
          higher education institutes in Sri Lanka.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedUniversities.map((uni, index) => (
          <Link
            href={`/universities/${encodeURIComponent(uni.name)}`}
            key={index}
            className="group"
          >
            <div className="bg-white rounded-xl p-3 flex items-center gap-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-100">
              <div className="w-12 h-12 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                <GraduationCap className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {uni.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50">
                    <MapPin className="w-2.5 h-2.5 text-blue-500" />
                  </div>
                  <span className="font-medium text-slate-600">
                    {uni.listings}
                  </span>{" "}
                  spaces
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors px-6 py-2.5 border border-slate-200 hover:border-blue-200 rounded-full bg-white shadow-sm"
        >
          {showAll ? (
            <>
              View Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              View All Universities <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
