import { getPostById } from "@/app/actions/postActions";
import CreatePostForm from "@/components/CreatePostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const result = await getPostById(id);
  
  if (!result.success || !result.post) {
    notFound();
  }

  const post = result.post;

  // Allow the author, or any admin / super-admin, to edit the listing.
  const role = (session.user as any).role;
  const isAdmin = role === "admin" || role === "super-admin";
  if (post.author._id.toString() !== (session.user as any).id && !isAdmin) {
    redirect("/");
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <CreatePostForm initialData={post} isEditing={true} />
    </div>
  );
}
