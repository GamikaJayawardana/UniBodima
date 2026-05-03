"use client";

import Link from "next/link";
import { Edit2, Trash2, Eye, Bookmark, MapPin, Calendar, Tag } from "lucide-react";
import { PostType } from "./PostCard";

interface DashboardItemProps {
  post: any;
  onDelete: (id: string) => void;
}

export default function DashboardItem({ post, onDelete }: DashboardItemProps) {
  const isOffer = post.type === "offer";
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-48 md:h-auto bg-slate-100 shrink-0 overflow-hidden">
          {post.images?.[0] ? (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <Tag className="w-8 h-8 text-slate-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                isOffer
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {isOffer ? "Offer" : "Request"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/posts/${post._id}`} className="hover:text-blue-600 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                {post.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5">
               <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                 <Eye className="w-3.5 h-3.5" /> {post.viewCount || 0}
               </span>
               <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                 <Bookmark className="w-3.5 h-3.5" /> {post.saveCount || 0}
               </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center text-slate-500 text-xs gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">
                {post.address || "Location not specified"}
              </span>
            </div>
            <div className="flex items-center text-slate-500 text-xs gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5">
                {isOffer ? "Price" : "Budget Range"}
              </p>
              <p className="text-lg font-black text-slate-900">
                {isOffer
                  ? `LKR ${post.price?.toLocaleString()}`
                  : `LKR ${post.budgetRange?.min?.toLocaleString()} - ${post.budgetRange?.max?.toLocaleString()}`}
                <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/edit/${post._id}`}
                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                title="Edit Post"
              >
                <Edit2 className="w-4.5 h-4.5" />
              </Link>
              <button
                onClick={() => onDelete(post._id)}
                className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                title="Delete Post"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
