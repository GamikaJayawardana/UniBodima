import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRequestPost extends Document {
  type: "request";
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budgetRange: { min: number; max: number };
  genderPreference: "Male" | "Female" | "Any";
  targetUniversity: string;
  contactNumber: string;
  roomType?: "single" | "shared" | "dorm" | "apartment";
  occupancy?: number;
  availableFrom?: Date;
  rating?: number;
  reviewCount?: number;
  savedBy?: mongoose.Types.ObjectId[];
  images?: string[];
  address?: string;
  district?: string;
  postcode?: string;
}

const RequestPostSchema: Schema<IRequestPost> = new Schema(
  {
    type: {
      type: String,
      enum: ["request"],
      default: "request",
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budgetRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"],
      required: true,
      default: "Any",
    },
    targetUniversity: { type: String, required: true },
    contactNumber: { type: String, required: true },
    roomType: { type: String, enum: ["single", "shared", "dorm", "apartment"] },
    occupancy: { type: Number },
    availableFrom: { type: Date },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String, default: [] }],
    address: { type: String, default: "" },
    district: { type: String, default: "" },
    postcode: { type: String, default: "" },
    savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, collection: "posts" },
);

export const RequestPost: Model<IRequestPost> =
  mongoose.models.RequestPost ||
  mongoose.model<IRequestPost>("RequestPost", RequestPostSchema);
