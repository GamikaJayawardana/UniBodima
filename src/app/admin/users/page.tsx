"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUserAsAdmin, updateUserRoleAsSuperAdmin } from "@/app/actions/adminActions";
import { Users, Trash2, ShieldCheck, Mail, Calendar, Loader2, AlertTriangle, Shield, ShieldOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const isSuperAdmin = (session?.user as any)?.role === "super-admin";

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.users);
    }
    setLoading(false);
  }

  async function handleDelete(userId: string) {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    
    setDeletingId(userId);
    const result = await deleteUserAsAdmin(userId);
    setDeletingId(null);

    if (result.success) {
      setUsers(users.filter(u => u._id !== userId));
    } else {
      alert("Failed to delete user: " + result.error);
    }
  }

  async function handleRoleChange(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    
    setUpdatingRoleId(userId);
    const result = await updateUserRoleAsSuperAdmin(userId, newRole);
    setUpdatingRoleId(null);

    if (result.success) {
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } else {
      alert("Failed to update user role: " + result.error);
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center gap-4">
            <Users className="w-10 h-10 text-indigo-600" />
            User Management
          </h1>
          <p className="text-slate-500 font-medium">View and manage all registered accounts on BoardingFor.me.</p>
        </div>
        <div className="px-6 py-3 bg-white rounded-full border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          Total Users: <span className="text-indigo-600">{users.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
            <p className="font-bold tracking-widest uppercase text-xs">Loading Directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-slate-500 font-medium">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2 items-start">
                        {user.role === 'admin' ? (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> Admin
                          </span>
                        ) : user.role === 'super-admin' ? (
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1.5">
                            <Shield className="w-3 h-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                            User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && user.role !== 'super-admin' && (
                          <button 
                            onClick={() => handleRoleChange(user._id, user.role || 'user')}
                            disabled={updatingRoleId === user._id || (session?.user as any)?.id === user._id}
                            className={`p-3 rounded-xl transition-all disabled:opacity-30 flex items-center gap-2 ${
                              user.role === 'admin' 
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                            title={user.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                          >
                            {updatingRoleId === user._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : user.role === 'admin' ? (
                              <ShieldOff className="w-5 h-5" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id || (session?.user as any)?.id === user._id || user.role === 'super-admin'}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                          title={user.role === 'super-admin' ? "Cannot delete super admin" : (session?.user as any)?.id === user._id ? "Cannot delete yourself" : "Delete User"}
                        >
                          {deletingId === user._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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
