"use server";

import connectToDatabase from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function getUserProfile(userId: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findById(userId)
      .select('-password')
      .lean();
      
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        ...user,
        _id: (user as any)._id.toString(),
        createdAt: (user as any).createdAt.toISOString(),
        updatedAt: (user as any).updatedAt.toISOString(),
      }
    };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function getCurrentUserProfile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email })
      .select('-password')
      .populate('savedPosts', 'title price budgetRange targetUniversity images')
      .lean();
      
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        ...user,
        _id: (user as any)._id.toString(),
        createdAt: (user as any).createdAt.toISOString(),
        updatedAt: (user as any).updatedAt.toISOString(),
      }
    };
  } catch (error: any) {
    console.error("Error fetching current user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      throw new Error("You must be logged in to update profile");
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const university = formData.get("university") as string;
    const yearOfStudy = formData.get("yearOfStudy") as string;
    const studyField = formData.get("studyField") as string;
    const bio = formData.get("bio") as string;
    const district = formData.get("district") as string;
    const postcode = formData.get("postcode") as string;

    const updateData: Partial<IUser> = {
      name: name || undefined,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      university: university || undefined,
      yearOfStudy: yearOfStudy as any || undefined,
      studyField: studyField || undefined,
      bio: bio || undefined,
      district: district || undefined,
      postcode: postcode || undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof IUser] === undefined) {
        delete updateData[key as keyof IUser];
      }
    });

    // Handle Profile Picture Upload
    const imageFile = formData.get("profileImage") as File;
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "unibodimhub/profiles" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      }) as any;
      
      updateData.image = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    
    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true, user: user?.toJSON() };

  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
}

export async function getSavedPosts() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      return { success: true, posts: [] };
    }

    const { OfferPost } = await import("@/models/OfferPost");
    const { RequestPost } = await import("@/models/RequestPost");

    const savedOfferPosts = await OfferPost.find({ _id: { $in: user.savedPosts } })
      .populate('author', 'name image university')
      .lean();

    const savedRequestPosts = await RequestPost.find({ _id: { $in: user.savedPosts } })
      .populate('author', 'name image university')
      .lean();

    const allSavedPosts = [...savedOfferPosts, ...savedRequestPosts];

    const transformedPosts = allSavedPosts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author ? {
        _id: p.author._id.toString(),
        name: p.author.name,
        image: p.author.image,
        university: p.author.university,
      } : { name: "Unknown" },
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    // Sort by most recently saved (we'll just sort by createdAt for now)
    transformedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      posts: transformedPosts
    };
  } catch (error: any) {
    console.error("Error fetching saved posts:", error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function changePassword(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long" };
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const bcrypt = await import("bcryptjs");

    // Check if user has a password (they might have registered via OAuth)
    if (!user.password) {
      return { success: false, error: "Your account is linked to an external provider (e.g., Google). Password change is not applicable." };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Incorrect current password" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return { success: false, error: error.message };
  }
}
