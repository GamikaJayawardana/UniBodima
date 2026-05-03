import { MapPin, User, Calendar, Tag } from "lucide-react";

export type PostType = "offer" | "request";

export interface PostCardProps {
  id: string;
  type: PostType;
  title: string;
  price?: number;
  budgetRange?: { min: number; max: number };
  location: string;
  targetUniversity: string;
  genderPreference: string;
  imageUrl?: string;
  createdAt: string;
  authorName: string;
}

export default function PostCard({
  type,
  title,
  price,
  budgetRange,
  location,
  targetUniversity,
  genderPreference,
  imageUrl,
  createdAt,
  authorName,
}: PostCardProps) {
  const isOffer = type === "offer";
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer">
      <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
            <Tag className="w-10 h-10 text-blue-200" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
              isOffer
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {isOffer ? "Offer (Renting)" : "Requesting"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center text-slate-500 text-sm mb-4 gap-1">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {location || "Location not specified"} (Near {targetUniversity})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs flex items-center gap-1">
            <User className="w-3 h-3" /> {genderPreference}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formattedDate}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">
              {isOffer ? "Price" : "Budget"}
            </p>
            <p className="text-lg font-bold text-blue-600">
              {isOffer
                ? `LKR ${price?.toLocaleString()}`
                : `LKR ${budgetRange?.min?.toLocaleString() || "0"} - ${budgetRange?.max?.toLocaleString() || "0"}`}
              <span className="text-sm font-normal text-slate-500">/mo</span>
            </p>
          </div>

          <div
            className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm"
            title={authorName}
          >
            {authorName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
}
