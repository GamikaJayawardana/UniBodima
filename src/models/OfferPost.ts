import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOfferPost extends Document {
  type: "offer";
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  address: string;
  price: number;
  genderPreference: "Male" | "Female" | "Any";
  targetUniversity: string;
  images: string[];
  contactNumber: string;
  distanceToUni?: number;
  estimatedTravelTime?: number;
  isVerified: boolean;
  roomFacilities?: Record<string, boolean>;
  buildingAmenities?: Record<string, boolean>;
  mealPlan?: Record<string, boolean>;
  utilitiesIncluded?: Record<string, boolean>;
  availableFrom?: Date;
  leaseDuration?: "short" | "long" | "flexible";
  occupancy?: number;
  totalRooms?: number;
  roomType?: "single" | "shared" | "dorm" | "apartment";
  rating?: number;
  reviewCount?: number;
  postcode?: string;
  district?: string;
  savedBy?: mongoose.Types.ObjectId[];
  viewCount?: number;
  lastViewedAt?: Date;
}

const OfferPostSchema: Schema<IOfferPost> = new Schema(
  {
    type: { type: String, enum: ["offer"], default: "offer", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"],
      required: true,
      default: "Any",
    },
    targetUniversity: { type: String, required: true },
    images: [{ type: String }],
    contactNumber: { type: String, required: true },
    distanceToUni: { type: Number },
    estimatedTravelTime: { type: Number },
    isVerified: { type: Boolean, default: false },
    roomFacilities: { type: Schema.Types.Mixed },
    buildingAmenities: { type: Schema.Types.Mixed },
    mealPlan: { type: Schema.Types.Mixed },
    utilitiesIncluded: { type: Schema.Types.Mixed },
    availableFrom: { type: Date },
    leaseDuration: { type: String, enum: ["short", "long", "flexible"] },
    occupancy: { type: Number },
    totalRooms: { type: Number },
    roomType: { type: String, enum: ["single", "shared", "dorm", "apartment"] },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    postcode: { type: String },
    district: { type: String },
    savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date },
  },
  { timestamps: true, collection: "posts" },
);

export const OfferPost: Model<IOfferPost> =
  mongoose.models.OfferPost || mongoose.model<IOfferPost>("OfferPost", OfferPostSchema);
