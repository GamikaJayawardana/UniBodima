"use client";

import { MapPin, Heart, ShieldCheck, Bed, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toggleSavePost } from "@/app/actions/postActions";

export type PostType = "offer" | "request";

export interface PostCardProps {
  id: string;
  type: PostType;
  title: string;
  price?: number;
  budgetRange?: { min: number; max: number };
  district?: string;
  targetUniversity: string;
  genderPreference: string;
  imageUrl?: string;
  createdAt: string;
  authorName: string;
  roomType?: string;
  occupancy?: number;
  distanceToUni?: number;
  isSavedInitial?: boolean;
  authorRole?: string;
}

export default function PostCard({
  id,
  type,
  title,
  price,
  budgetRange,
  district,
  targetUniversity,
  genderPreference,
  imageUrl,
  createdAt,
  authorName,
  roomType,
  occupancy,
  distanceToUni,
  isSavedInitial = false,
  authorRole = "user",
}: PostCardProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loading, setLoading] = useState(false);
  const isOffer = type === "offer";

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    const result = await toggleSavePost(id);
    if (result.success) {
      setIsSaved(result.saved || false);
    }
    setLoading(false);
  };

  return (
    <Link href={`/posts/${id}`} className="group block">
      <div className="bg-white rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full border border-slate-100/50">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
              <Building2 className="w-12 h-12" />
            </div>
          )}

          {/* Top Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg ${isOffer ? 'bg-sky-600/90 text-white' : 'bg-emerald-600/90 text-white'}`}>
                {isOffer ? "Premium Offer" : "Housing Request"}
              </span>
              {(authorRole === 'admin' || authorRole === 'super-admin') && (
                <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-rose-500/30 shadow-lg bg-rose-600/90 text-white flex items-center gap-1.5 w-fit">
                  <ShieldCheck className="w-3 h-3" /> Official Admin
                </span>
              )}
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={loading}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-lg ${isSaved ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white/90 text-slate-400 hover:text-rose-500'}`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-7 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-sky-100 flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {targetUniversity || "General Housing"}
            </div>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest ml-auto">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
              {title}
            </h3>
            <div className="text-right shrink-0">
              <p className="text-lg font-black text-slate-900">
                {isOffer
                  ? `LKR ${price?.toLocaleString()}`
                  : `LKR ${(budgetRange?.min || 0).toLocaleString()}+`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold mb-3">
            <MapPin className="w-4 h-4 shrink-0 text-slate-300" />
            <span className="truncate">{district || "Location Not Set"}</span>
          </div>

          {/* Stats Bar */}
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Bed className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">{roomType || "Room"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">{occupancy ? `${occupancy} Person` : "Shared"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">{genderPreference}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


