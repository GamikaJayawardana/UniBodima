"use client";

import { useEffect, useState } from "react";
import { getAllReports, dismissReport, deleteReportedPost } from "@/app/actions/adminActions";
import { Flag, Trash2, CheckCircle, Loader2, AlertOctagon, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    const result = await getAllReports();
    if (result.success) {
      setReports(result.reports);
    }
    setLoading(false);
  }

  async function handleDismiss(reportId: string) {
    if (!window.confirm("Are you sure you want to dismiss this report? The post will not be deleted.")) return;
    
    setActionLoadingId(reportId);
    const result = await dismissReport(reportId);
    setActionLoadingId(null);

    if (result.success) {
      setReports(reports.filter(r => r._id !== reportId));
    } else {
      alert("Failed to dismiss report: " + result.error);
    }
  }

  async function handleDelete(reportId: string, postId: string) {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this post? This action cannot be undone.")) return;
    
    setActionLoadingId(reportId);
    const result = await deleteReportedPost(reportId, postId);
    setActionLoadingId(null);

    if (result.success) {
      // Remove all reports associated with this post from the local state
      setReports(reports.filter(r => r.postId !== postId));
    } else {
      alert("Failed to delete post: " + result.error);
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center gap-4">
            <Flag className="w-10 h-10 text-rose-500" />
            User Reports
          </h1>
          <p className="text-slate-500 font-medium">Review and moderate content flagged by the community.</p>
        </div>
        <div className="px-6 py-3 bg-white rounded-full border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          Pending Reports: <span className="text-rose-500">{reports.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-500" />
            <p className="font-bold tracking-widest uppercase text-xs">Loading Reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">All Caught Up!</h3>
            <p className="text-slate-500 font-medium">There are no pending reports to review at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Post & Reporter</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <AlertOctagon className="w-3 h-3" /> Reported {report.postType}
                          </p>
                          <Link href={`/posts/${report.postId}`} target="_blank" className="font-bold text-slate-900 hover:text-sky-600 transition-colors flex items-center gap-2">
                            {report.postTitle} <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                        </div>
                        <div className="pt-2 border-t border-slate-100/50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reported By</p>
                          <p className="text-xs font-bold text-slate-700">{report.reportedBy.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100/50">
                        "{report.reason}"
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-500 font-medium">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleDismiss(report._id)}
                          disabled={actionLoadingId === report._id}
                          className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                        <button 
                          onClick={() => handleDelete(report._id, report.postId)}
                          disabled={actionLoadingId === report._id}
                          className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-black text-sm transition-all disabled:opacity-50 flex items-center gap-2 border border-rose-100 hover:border-transparent shadow-sm"
                        >
                          {actionLoadingId === report._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          Delete Post
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
