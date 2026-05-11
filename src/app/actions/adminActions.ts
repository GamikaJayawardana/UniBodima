"use server";

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { OfferPost } from "@/models/OfferPost";
import { RequestPost } from "@/models/RequestPost";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Utility to verify admin or super-admin role
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized: Not logged in.");
  }
  const role = (session.user as any).role;
  if (role !== 'admin' && role !== 'super-admin') {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

// Utility to verify strict super-admin role
async function verifySuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== 'super-admin') {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  return session;
}

export async function getPlatformStats() {
  try {
    await verifyAdmin();
    await connectToDatabase();

    const userCount = await User.countDocuments();
    const offerCount = await OfferPost.countDocuments();
    const requestCount = await RequestPost.countDocuments();

    return {
      success: true,
      stats: {
        users: userCount,
        offers: offerCount,
        requests: requestCount,
        totalPosts: offerCount + requestCount,
      }
    };
  } catch (error: any) {
    console.error("Error fetching platform stats:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllUsers() {
  try {
    await verifyAdmin();
    await connectToDatabase();

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const transformedUsers = users.map((u: any) => ({
      ...u,
      _id: u._id.toString(),
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString(),
      savedPosts: undefined // Omit to save payload size
    }));

    return { success: true, users: JSON.parse(JSON.stringify(transformedUsers)) };
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    return { success: false, error: error.message, users: [] };
  }
}

export async function getAllPosts() {
  try {
    await verifyAdmin();
    await connectToDatabase();

    const [offers, requests] = await Promise.all([
      OfferPost.find({}).populate('author', 'name email image').lean(),
      RequestPost.find({}).populate('author', 'name email image').lean()
    ]);

    const allPosts = [...offers, ...requests].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const transformedPosts = allPosts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author ? {
        _id: p.author._id?.toString() || "unknown",
        name: p.author.name || "Unknown",
        email: p.author.email || "",
        image: p.author.image || "",
      } : { name: "Unknown" },
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, posts: JSON.parse(JSON.stringify(transformedPosts)) };
  } catch (error: any) {
    console.error("Error fetching all posts:", error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function deleteUserAsAdmin(userId: string) {
  try {
    await verifyAdmin();
    await connectToDatabase();

    // Prevent deleting self
    const session = await getServerSession(authOptions);
    if ((session?.user as any).id === userId) {
      return { success: false, error: "Cannot delete your own admin account." };
    }

    await User.findByIdAndDelete(userId);
    // Note: In a production app, we would also delete their posts or orphan them.
    // For now, we will just delete the user to keep it simple.
    
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePostAsAdmin(postId: string) {
  try {
    await verifyAdmin();
    await connectToDatabase();

    let post = await OfferPost.findByIdAndDelete(postId);
    if (!post) {
      post = await RequestPost.findByIdAndDelete(postId);
    }

    if (!post) {
      return { success: false, error: "Post not found." };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/");
    return { success: true, message: "Post deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRoleAsSuperAdmin(userId: string, newRole: string) {
  try {
    await verifySuperAdmin();
    await connectToDatabase();

    if (newRole !== 'user' && newRole !== 'admin') {
      return { success: false, error: "Invalid role specified." };
    }

    // Prevent changing own role
    const session = await getServerSession(authOptions);
    if ((session?.user as any).id === userId) {
      return { success: false, error: "Cannot change your own role." };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    
    if (!updatedUser) {
      return { success: false, error: "User not found." };
    }

    revalidatePath("/admin/users");
    return { success: true, message: `User role successfully changed to ${newRole}.` };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllReports() {
  try {
    await verifyAdmin();
    await connectToDatabase();
    
    const { Report } = await import("@/models/Report");
    
    // Fetch reports and populate reportedBy user. We can't easily populate polymorphic postId via mongoose without refs, but we can manually fetch the post title/details if needed.
    const reports = await Report.find({ status: 'pending' })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();
      
    // Manually fetch post details
    const enrichedReports = await Promise.all(reports.map(async (r: any) => {
      let postTitle = "Unknown Post";
      let authorId = null;
      
      if (r.postType === 'offer') {
        const p = await OfferPost.findById(r.postId).select('title author').lean();
        if (p) {
          postTitle = p.title;
          authorId = p.author;
        }
      } else {
        const p = await RequestPost.findById(r.postId).select('title author').lean();
        if (p) {
          postTitle = p.title;
          authorId = p.author;
        }
      }
      
      return {
        ...r,
        _id: r._id.toString(),
        postId: r.postId.toString(),
        reportedBy: r.reportedBy ? {
          _id: r.reportedBy._id.toString(),
          name: r.reportedBy.name,
          email: r.reportedBy.email,
        } : { name: "Unknown" },
        postTitle,
        postAuthorId: authorId?.toString() || null,
        createdAt: new Date(r.createdAt).toISOString(),
        updatedAt: new Date(r.updatedAt).toISOString(),
      };
    }));
    
    return { success: true, reports: JSON.parse(JSON.stringify(enrichedReports)) };
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return { success: false, error: error.message, reports: [] };
  }
}

export async function dismissReport(reportId: string) {
  try {
    await verifyAdmin();
    await connectToDatabase();
    const { Report } = await import("@/models/Report");
    
    await Report.findByIdAndUpdate(reportId, { status: 'resolved' });
    revalidatePath("/admin/reports");
    return { success: true, message: "Report dismissed." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReportedPost(reportId: string, postId: string) {
  try {
    await verifyAdmin();
    await connectToDatabase();
    const { Report } = await import("@/models/Report");
    
    // Delete the post
    const delResult = await deletePostAsAdmin(postId);
    if (!delResult.success) {
      return delResult;
    }
    
    // Resolve the report
    await Report.findByIdAndUpdate(reportId, { status: 'resolved' });
    
    // Also resolve any other reports for this same post
    await Report.updateMany({ postId }, { status: 'resolved' });
    
    revalidatePath("/admin/reports");
    return { success: true, message: "Post deleted and report resolved." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
