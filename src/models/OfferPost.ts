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
  roomFacilities?: {
    hasAC: boolean;
    hasWiFi: boolean;
    hasHotWater: boolean;
    isFurnished: boolean;
    hasPrivateBathroom: boolean;
    hasWardrobe: boolean;
    hasDeskStudyArea: boolean;
  };
  buildingAmenities?: {
    hasParking: boolean;
    has24HourSecurity: boolean;
    hasGarden: boolean;
    hasGym: boolean;
    hasCommonRoom: boolean;
    hasLaundry: boolean;
    hasGenerator: boolean;
    hasCCTV: boolean;
  };
  mealPlan?: {
    included: boolean;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    packingAllowed: boolean;
  };
  utilitiesIncluded?: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    gas?: boolean;
    garbage?: boolean;
  };
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
  createdAt: Date;
  updatedAt: Date;
}

const RoomFacilitiesSchema = new Schema({
  hasAC: { type: Boolean, default: false },
  hasWiFi: { type: Boolean, default: false },
  hasHotWater: { type: Boolean, default: false },
  isFurnished: { type: Boolean, default: false },
  hasPrivateBathroom: { type: Boolean, default: false },
  hasWardrobe: { type: Boolean, default: false },
  hasDeskStudyArea: { type: Boolean, default: false }
}, { _id: false });

const BuildingAmenitiesSchema = new Schema({
  hasParking: { type: Boolean, default: false },
  has24HourSecurity: { type: Boolean, default: false },
  hasGarden: { type: Boolean, default: false },
  hasGym: { type: Boolean, default: false },
  hasCommonRoom: { type: Boolean, default: false },
  hasLaundry: { type: Boolean, default: false },
  hasGenerator: { type: Boolean, default: false },
  hasCCTV: { type: Boolean, default: false }
}, { _id: false });

const MealPlanSchema = new Schema({
  included: { type: Boolean, default: false },
  breakfast: { type: Boolean, default: false },
  lunch: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false },
  packingAllowed: { type: Boolean, default: false }
}, { _id: false });

const UtilitiesIncludedSchema = new Schema({
  electricity: { type: Boolean, default: false },
  water: { type: Boolean, default: false },
  internet: { type: Boolean, default: false },
  gas: { type: Boolean, default: false },
  garbage: { type: Boolean, default: false }
}, { _id: false });

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
    roomFacilities: { type: RoomFacilitiesSchema },
    buildingAmenities: { type: BuildingAmenitiesSchema },
    mealPlan: { type: MealPlanSchema },
    utilitiesIncluded: { type: UtilitiesIncludedSchema },
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
  { timestamps: true, collection: "offers" },
);

export const OfferPost: Model<IOfferPost> =
  mongoose.models.Offer || mongoose.model<IOfferPost>("Offer", OfferPostSchema);
