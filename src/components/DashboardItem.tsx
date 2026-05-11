"use client";

import { MapPin, Calendar, Eye, Bookmark, Edit2, Trash2, ArrowRight, Tag, ShieldCheck, GraduationCap } from "lucide-react";
import Link from "next/link";

interface DashboardItemProps {
  post: any;
  onDelete: (id: string) => void;
}

export default function DashboardItem({ post, onDelete }: DashboardItemProps) {
  const isOffer = post.type === "offer";
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="group arctic-card hover:border-sky-500/20 transition-all duration-700 overflow-hidden flex flex-col md:flex-row items-stretch bg-white">
      {/* Thumbnail Area */}
      <div className="relative w-full md:w-72 h-60 md:h-auto overflow-hidden bg-slate-50 border-r border-slate-100/50">
        {post.images?.[0] ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-10 h-10 text-slate-200" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg border border-white/20 backdrop-blur-md ${
              isOffer
                ? "bg-sky-600/90 text-white"
                : "bg-emerald-600/90 text-white"
            }`}
          >
            {isOffer ? "Offer" : "Request"}
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="flex-grow p-8 md:p-12 flex flex-col relative">
        <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
          <div className="space-y-3 flex-1">
            <Link href={`/posts/${post._id}`} className="group/link block">
              <h3 className="text-3xl font-black text-slate-900 group-hover/link:text-sky-600 transition-colors leading-tight tracking-tight">
                {post.title}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center text-slate-500 text-xs font-bold gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.district || "Location"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.targetUniversity?.split(' ').slice(-1) || "Any Uni"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-black text-xs border border-slate-100">
               <Eye className="w-4 h-4 text-sky-600" /> 
               <span>{post.viewCount || 0}</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-black text-xs border border-slate-100">
               <Bookmark className="w-4 h-4 text-rose-500" /> 
               <span>{post.saveCount || 0}</span>
             </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              {isOffer ? "Contract Rent" : "Student Budget"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                {isOffer
                  ? `LKR ${post.price?.toLocaleString()}`
                  : `LKR ${(post.budgetRange?.min || 0) / 1000}k - ${(post.budgetRange?.max || 0) / 1000}k`}
              </span>
              <span className="text-sm font-black text-sky-600 italic">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/edit/${post._id}`}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm hover:bg-slate-800 transition-all w-full sm:w-auto shadow-lg shadow-slate-900/10 hover:-translate-y-1"
            >
              <Edit2 className="w-4 h-4" />
              Edit Listing
            </Link>
            <button
              onClick={() => onDelete(post._id)}
              className="p-4 bg-rose-50 text-rose-500 rounded-[20px] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all group/del shadow-sm"
              title="Delete Post"
            >
              <Trash2 className="w-5 h-5 group-hover/del:rotate-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
