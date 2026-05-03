"use server";

import connectToDatabase from "@/lib/mongodb";
import { Post, IPost } from "@/models/Post";
import { OfferPost } from "@/models/OfferPost";
import { RequestPost } from "@/models/RequestPost";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function createPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      throw new Error("You must be logged in to create a post");
    }

    await connectToDatabase();

    const type = formData.get("type") as "offer" | "request";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const address = (formData.get("address") as string) || "";
    const targetUniversity = formData.get("targetUniversity") as string;
    const genderPreference = formData.get("genderPreference") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const roomType = formData.get("roomType") as string;
    const occupancy = formData.get("occupancy") ? Number(formData.get("occupancy")) : undefined;
    const district = (formData.get("district") as string) || undefined;
    const postcode = (formData.get("postcode") as string) || undefined;
    const leaseDuration = formData.get("leaseDuration") as string;
    const availableFrom = formData.get("availableFrom") as string;

    let price, budgetMin, budgetMax;
    if (type === "offer") {
      price = Number(formData.get("price"));
    } else {
      budgetMin = Number(formData.get("budgetMin"));
      budgetMax = Number(formData.get("budgetMax"));
    }

    // Room Facilities (offer only)
    const roomFacilities = {
      hasAC: formData.get("hasAC") === "on",
      hasWiFi: formData.get("hasWiFi") === "on",
      hasHotWater: formData.get("hasHotWater") === "on",
      isFurnished: formData.get("isFurnished") === "on",
      hasPrivateBathroom: formData.get("hasPrivateBathroom") === "on",
      hasWardrobe: formData.get("hasWardrobe") === "on",
      hasDeskStudyArea: formData.get("hasDeskStudyArea") === "on",
    };

    // Building Amenities (offer only)
    const buildingAmenities = {
      hasParking: formData.get("hasParking") === "on",
      has24HourSecurity: formData.get("has24HourSecurity") === "on",
      hasGarden: formData.get("hasGarden") === "on",
      hasGym: formData.get("hasGym") === "on",
      hasCommonRoom: formData.get("hasCommonRoom") === "on",
      hasLaundry: formData.get("hasLaundry") === "on",
      hasGenerator: formData.get("hasGenerator") === "on",
      hasCCTV: formData.get("hasCCTV") === "on",
    };

    // Meal Plan (offer only)
    const mealPlan = {
      included: formData.get("mealIncluded") === "on",
      breakfast: formData.get("breakfast") === "on",
      lunch: formData.get("lunch") === "on",
      dinner: formData.get("dinner") === "on",
      packingAllowed: formData.get("packingAllowed") === "on",
    };

    // Utilities (offer only)
    const utilitiesIncluded = {
      electricity: formData.get("electricity") === "on",
      water: formData.get("water") === "on",
      internet: formData.get("internet") === "on",
      gas: formData.get("gas") === "on",
      garbage: formData.get("garbage") === "on",
    };

    // Handle Image Upload (offer only)
    const images: string[] = [];
    if (type === "offer") {
      const imageFiles = formData.getAll("images") as File[];

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);

          const uploadResult = (await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "unibodimhub" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                },
              )
              .end(buffer);
          })) as any;

          images.push(uploadResult.secure_url);
        }
      }
    }

    const commonData = {
      author: (session.user as any).id,
      title,
      description,
      targetUniversity,
      genderPreference: genderPreference as any,
      contactNumber,
      roomType: roomType ? (roomType as any) : undefined,
      occupancy: occupancy || undefined,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
    };

    const newPost =
      type === "offer"
        ? await OfferPost.create({
            ...commonData,
            type: "offer",
            address,
            price,
            images,
            district,
            postcode,
            leaseDuration: leaseDuration ? (leaseDuration as any) : undefined,
            roomFacilities,
            buildingAmenities,
            mealPlan,
            utilitiesIncluded,
          })
        : await RequestPost.create({
            ...commonData,
            type: "request",
            budgetRange: { min: budgetMin!, max: budgetMax! },
          });
    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/requests");
    revalidatePath("/my-offers");
    revalidatePath("/my-requests");
    
    return { success: true, post: newPost.toJSON() };

  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: error.message };
  }
}

export async function getPosts(type?: "offer" | "request", limit: number = 8) {
  try {
    await connectToDatabase();
    
    const query = type ? { type } : {};
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name image university')
      .lean();
      
    // Transform ObjectId and dates to strings for client components
    return posts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: {
        _id: p.author._id.toString(),
        name: p.author.name,
        image: p.author.image,
        university: p.author.university,
      },
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostById(postId: string) {
  try {
    await connectToDatabase();

    await Post.findByIdAndUpdate(postId, {
      $inc: { viewCount: 1 },
      $set: { lastViewedAt: new Date() },
    });

    const post = await Post.findById(postId)
      .populate('author', 'name image email phoneNumber university district bio rating reviewCount')
      .lean();
      
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    return {
      success: true,
      post: {
        ...post,
        _id: (post as any)._id.toString(),
        author: {
          ...(post as any).author,
          _id: (post as any).author._id.toString(),
        },
        createdAt: (post as any).createdAt.toISOString(),
        updatedAt: (post as any).updatedAt.toISOString(),
      }
    };
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return { success: false, error: error.message };
  }
}

export async function searchAndFilterPosts(filters: {
  type?: 'offer' | 'request';
  university?: string;
  priceMin?: number;
  priceMax?: number;
  genderPreference?: string;
  roomType?: string;
  district?: string;
  hasWiFi?: boolean;
  hasAC?: boolean;
  hasFurnished?: boolean;
  hasParking?: boolean;
  mealIncluded?: boolean;
  rating?: number;
  distanceMax?: number;
  q?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    
    const {
      type,
      university,
      priceMin,
      priceMax,
      genderPreference,
      roomType,
      district,
      hasWiFi,
      hasAC,
      hasFurnished,
      hasParking,
      mealIncluded,
      rating,
      distanceMax,
      q,
      page = 1,
      limit = 10
    } = filters;

    const query: any = {};

    if (type) query.type = type;
    if (university) query.targetUniversity = university;
    if (genderPreference) query.genderPreference = { $in: [genderPreference, 'Any'] };
    if (roomType) query.roomType = roomType;
    if (district) query.district = district;
    if (rating) query.rating = { $gte: rating };
    if (distanceMax) query.distanceToUni = { $lte: distanceMax };

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { targetUniversity: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Price filter
    if (priceMin || priceMax) {
      const priceQuery: any = {};
      if (priceMin) priceQuery.$gte = priceMin;
      if (priceMax) priceQuery.$lte = priceMax;

      if (type === 'offer') {
        query.price = priceQuery;
      } else if (type === 'request') {
        if (priceMin) query['budgetRange.max'] = { $gte: priceMin };
        if (priceMax) query['budgetRange.min'] = { $lte: priceMax };
      } else {
        // If type is not specified, check both
        query.$or = query.$or || [];
        query.$or.push(
          { price: priceQuery },
          { 
            $and: [
              { 'budgetRange.max': { $gte: priceMin || 0 } },
              { 'budgetRange.min': { $lte: priceMax || 9999999 } }
            ]
          }
        );
      }
    }

    // Facilities filter
    if (hasWiFi) query['roomFacilities.hasWiFi'] = true;
    if (hasAC) query['roomFacilities.hasAC'] = true;
    if (hasFurnished) query['roomFacilities.isFurnished'] = true;
    if (hasParking) query['buildingAmenities.hasParking'] = true;
    if (mealIncluded) query['mealPlan.included'] = true;

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name image university')
      .lean();

    const total = await Post.countDocuments(query);

    const transformedPosts = posts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: {
        _id: p.author._id.toString(),
        name: p.author.name,
        image: p.author.image,
        university: p.author.university,
      },
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return {
      success: true,
      posts: transformedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    };
  } catch (error: any) {
    console.error("Error searching posts:", error);
    return { success: false, error: error.message, posts: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
  }
}

export async function getUserPosts(userId: string, type?: 'offer' | 'request') {
  try {
    await connectToDatabase();

    const query: any = { author: userId };
    if (type) query.type = type;

    let posts: any[] = [];
    if (type === "offer") {
      posts = await OfferPost.find(query)
        .sort({ createdAt: -1 })
        .populate("author", "name image university")
        .lean();
    } else if (type === "request") {
      posts = await RequestPost.find(query)
        .sort({ createdAt: -1 })
        .populate("author", "name image university")
        .lean();
    } else {
      posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .populate("author", "name image university")
        .lean();
    }

    return {
      success: true,
      posts: posts.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        viewCount: p.viewCount || 0,
        saveCount: Array.isArray(p.savedBy) ? p.savedBy.length : 0,
        author: {
          _id: p.author._id.toString(),
          name: p.author.name,
          image: p.author.image,
          university: p.author.university,
        },
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    };
  } catch (error: any) {
    console.error("Error fetching user posts:", error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function getMyPosts(type: 'offer' | 'request') {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return { success: false, error: "Not authenticated", posts: [] };
    }

    return await getUserPosts((session.user as any).id, type);
  } catch (error: any) {
    console.error("Error fetching my posts:", error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      throw new Error("You must be logged in to delete a post");
    }

    await connectToDatabase();
    
    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.author.toString() !== (session.user as any).id) {
      return { success: false, error: "Unauthorized" };
    }

    if (post.type === "offer") {
      await OfferPost.findByIdAndDelete(postId);
    } else if (post.type === "request") {
      await RequestPost.findByIdAndDelete(postId);
    } else {
      await Post.findByIdAndDelete(postId);
    }
    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/requests");
    revalidatePath("/my-offers");
    revalidatePath("/my-requests");

    return { success: true, message: "Post deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      throw new Error("You must be logged in to update a post");
    }

    await connectToDatabase();

    const postId = formData.get("postId") as string;
    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.author.toString() !== (session.user as any).id) {
      return { success: false, error: "Unauthorized" };
    }

    const type = post.type as "offer" | "request";
    const updateData: any = {
      title: (formData.get("title") as string) || post.title,
      description: (formData.get("description") as string) || post.description,
      targetUniversity:
        (formData.get("targetUniversity") as string) || post.targetUniversity,
      genderPreference:
        (formData.get("genderPreference") as string) || post.genderPreference,
      contactNumber: (formData.get("contactNumber") as string) || post.contactNumber,
      roomType: ((formData.get("roomType") as string) || post.roomType || undefined),
      occupancy: formData.get("occupancy")
        ? Number(formData.get("occupancy"))
        : post.occupancy,
      availableFrom: formData.get("availableFrom")
        ? new Date(formData.get("availableFrom") as string)
        : post.availableFrom,
    };

    // Handle New Images for Offers
    if (type === "offer") {
      const newImages: string[] = [];
      const imageFiles = formData.getAll("images") as File[];

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);

          const uploadResult = (await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "unibodimhub" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                },
              )
              .end(buffer);
          })) as any;

          newImages.push(uploadResult.secure_url);
        }
      }

      // Append new images to existing ones, limit to 5 total
      updateData.images = [...(post.images || []), ...newImages].slice(0, 5);
    }

    if (type === "offer") {
      updateData.address = (formData.get("address") as string) || post.address;
      updateData.district = (formData.get("district") as string) || post.district;
      updateData.postcode = (formData.get("postcode") as string) || post.postcode;
      updateData.price = formData.get("price")
        ? Number(formData.get("price"))
        : post.price;
      
      // Update Nested Objects for Offers
      updateData.roomFacilities = {
        hasAC: formData.get("hasAC") === "on",
        hasWiFi: formData.get("hasWiFi") === "on",
        hasHotWater: formData.get("hasHotWater") === "on",
        isFurnished: formData.get("isFurnished") === "on",
        hasPrivateBathroom: formData.get("hasPrivateBathroom") === "on",
        hasWardrobe: formData.get("hasWardrobe") === "on",
        hasDeskStudyArea: formData.get("hasDeskStudyArea") === "on",
      };

      updateData.buildingAmenities = {
        hasParking: formData.get("hasParking") === "on",
        has24HourSecurity: formData.get("has24HourSecurity") === "on",
        hasGarden: formData.get("hasGarden") === "on",
        hasGym: formData.get("hasGym") === "on",
        hasCommonRoom: formData.get("hasCommonRoom") === "on",
        hasLaundry: formData.get("hasLaundry") === "on",
        hasGenerator: formData.get("hasGenerator") === "on",
        hasCCTV: formData.get("hasCCTV") === "on",
      };

      updateData.mealPlan = {
        included: formData.get("mealIncluded") === "on",
        breakfast: formData.get("breakfast") === "on",
        lunch: formData.get("lunch") === "on",
        dinner: formData.get("dinner") === "on",
        packingAllowed: formData.get("packingAllowed") === "on",
      };

      updateData.utilitiesIncluded = {
        electricity: formData.get("electricity") === "on",
        water: formData.get("water") === "on",
        internet: formData.get("internet") === "on",
        gas: formData.get("gas") === "on",
        garbage: formData.get("garbage") === "on",
      };
    } else {
      updateData.budgetRange = {
        min: formData.get("budgetMin")
          ? Number(formData.get("budgetMin"))
          : post.budgetRange?.min,
        max: formData.get("budgetMax")
          ? Number(formData.get("budgetMax"))
          : post.budgetRange?.max,
      };
    }

    const updated =
      type === "offer"
        ? await OfferPost.findByIdAndUpdate(postId, updateData, { new: true })
        : await RequestPost.findByIdAndUpdate(postId, updateData, { new: true });

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/requests");
    revalidatePath("/my-offers");
    revalidatePath("/my-requests");
    revalidatePath("/dashboard");
    revalidatePath(`/posts/${postId}`);

    return { success: true, post: updated?.toJSON() };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleSavePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      throw new Error("You must be logged in to save posts");
    }

    await connectToDatabase();
    
    const { User } = await import("@/models/User");
    const { default: mongoose } = await import("mongoose");
    const userId = (session.user as any).id;

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const postIdObj = new mongoose.Types.ObjectId(postId);
    const isSaved = user.savedPosts?.some((id: any) => id.toString() === postId);
    
    if (isSaved) {
      // Remove from user
      user.savedPosts = user.savedPosts?.filter((id: any) => id.toString() !== postId);
      // Remove from post
      await Post.findByIdAndUpdate(postId, { $pull: { savedBy: userId } });
    } else {
      // Add to user
      if (!user.savedPosts) user.savedPosts = [];
      user.savedPosts.push(postIdObj);
      // Add to post
      await Post.findByIdAndUpdate(postId, { $addToSet: { savedBy: userId } });
    }

    await user.save();
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/posts/${postId}`);

    return { success: true, saved: !isSaved };
  } catch (error: any) {
    console.error("Error toggling save:", error);
    return { success: false, error: error.message };
  }
}
