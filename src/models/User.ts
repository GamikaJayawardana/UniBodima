import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
  university?: string;
  yearOfStudy?: 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5';
  studyField?: string;
  bio?: string;
  district?: string;
  postcode?: string;
  rating?: number;
  reviewCount?: number;
  savedPosts?: mongoose.Types.ObjectId[];
  role?: 'user' | 'admin' | 'super-admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    image: { type: String },
    university: { type: String },
    yearOfStudy: { type: String, enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'] },
    studyField: { type: String },
    bio: { type: String },
    district: { type: String },
    postcode: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    savedPosts: [{ type: Schema.Types.ObjectId }],
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' }
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
