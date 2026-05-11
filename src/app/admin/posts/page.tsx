"use client";

import { useEffect, useState } from "react";
import { getAllPosts, deletePostAsAdmin } from "@/app/actions/adminActions";
import { FileText, Trash2, Loader2, ExternalLink, Building2, MapPin } from "lucide-react";
import Link from "next/link";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const result = await getAllPosts();
    if (result.success) {
      setPosts(result.posts);
    }
    setLoading(false);
  }

  async function handleDelete(postId: string) {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) return;
    
    setDeletingId(postId);
    const result = await deletePostAsAdmin(postId);
    setDeletingId(null);

    if (result.success) {
      setPosts(posts.filter(p => p._id !== postId));
    } else {
      alert("Failed to delete post: " + result.error);
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center gap-4">
            <FileText className="w-10 h-10 text-sky-600" />
            Content Moderation
          </h1>
          <p className="text-slate-500 font-medium">Review and moderate all housing listings and requests.</p>
        </div>
        <div className="px-6 py-3 bg-white rounded-full border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          Total Posts: <span className="text-sky-600">{posts.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-sky-600" />
            <p className="font-bold tracking-widest uppercase text-xs">Loading Content...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-slate-500 font-medium">No posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Post Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Author</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        {post.images?.[0] ? (
                          <img src={post.images[0]} alt="Post" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <Building2 className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                            <MapPin className="w-3 h-3" /> {post.district || "Location N/A"}
                          </div>
                          <p className="text-xs font-black text-slate-900 mt-1">
                            {post.type === 'offer' 
                              ? `LKR ${post.price?.toLocaleString()}` 
                              : `LKR ${post.budgetRange?.min?.toLocaleString()} - ${post.budgetRange?.max?.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border inline-block ${
                        post.type === 'offer'
                          ? 'bg-sky-50 text-sky-600 border-sky-100'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {post.author.image ? (
                          <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-bold text-slate-700">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/posts/${post._id}`}
                          target="_blank"
                          className="p-3 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                          title="View Post"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30"
                          title="Delete Post"
                        >
                          {deletingId === post._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
