import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: number[]; // [longitude, latitude]
}

export interface IRoomFacilities {
  hasAC: boolean;
  hasWiFi: boolean;
  hasHotWater: boolean;
  isFurnished: boolean;
  hasPrivateBathroom: boolean;
  hasWardrobe: boolean;
  hasDeskStudyArea: boolean;
}

export interface IBuildingAmenities {
  hasParking: boolean;
  has24HourSecurity: boolean;
  hasGarden: boolean;
  hasGym: boolean;
  hasCommonRoom: boolean;
  hasLaundry: boolean;
  hasGenerator: boolean;
  hasCCTV: boolean;
}

export interface IMealPlan {
  included: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  packingAllowed: boolean;
}

export interface IUtilitiesIncluded {
  electricity: boolean;
  water: boolean;
  internet: boolean;
  gas?: boolean;
  garbage?: boolean;
}

export interface IPost extends Document {
  type: 'offer' | 'request';
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location?: ILocation;
  address: string;
  price?: number;
  budgetRange?: { min: number; max: number };
  genderPreference: 'Male' | 'Female' | 'Any';
  targetUniversity: string;
  images: string[];
  contactNumber: string;
  distanceToUni?: number;
  estimatedTravelTime?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Sri Lankan boarding specific fields
  roomFacilities?: IRoomFacilities;
  buildingAmenities?: IBuildingAmenities;
  mealPlan?: IMealPlan;
  utilitiesIncluded?: IUtilitiesIncluded;
  availableFrom?: Date;
  leaseDuration?: 'short' | 'long' | 'flexible'; // in months
  occupancy?: number; // number of people in room
  totalRooms?: number; // total rooms in building/space
  roomType?: 'single' | 'shared' | 'dorm' | 'apartment'; // type of room
  rating?: number; // average rating 0-5
  reviewCount?: number;
  postcode?: string;
  district?: string;
  savedBy?: mongoose.Types.ObjectId[]; // users who saved this post
  viewCount?: number;
  lastViewedAt?: Date;
}

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

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

const PostSchema: Schema<IPost> = new Schema(
  {
    type: { type: String, enum: ['offer', 'request'], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: PointSchema },
    address: {
      type: String,
      required: function (this: IPost) {
        return this.type === 'offer';
      },
      default: ''
    },
    price: { type: Number },
    budgetRange: {
      min: { type: Number },
      max: { type: Number },
    },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], required: true, default: 'Any' },
    targetUniversity: { type: String, required: true },
    images: [{ type: String }],
    contactNumber: { type: String, required: true },
    distanceToUni: { type: Number },
    estimatedTravelTime: { type: Number }, // in minutes
    isVerified: { type: Boolean, default: false },
    roomFacilities: { type: RoomFacilitiesSchema },
    buildingAmenities: { type: BuildingAmenitiesSchema },
    mealPlan: { type: MealPlanSchema },
    utilitiesIncluded: { type: UtilitiesIncludedSchema },
    availableFrom: { type: Date },
    leaseDuration: { type: String, enum: ['short', 'long', 'flexible'] },
    occupancy: { type: Number },
    totalRooms: { type: Number },
    roomType: { type: String, enum: ['single', 'shared', 'dorm', 'apartment'] },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    postcode: { type: String },
    district: { type: String },
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date }
  },
  { timestamps: true }
);

// Index for geospatial queries
PostSchema.index({ location: '2dsphere' });

export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
