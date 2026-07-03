import { getPlatformStats } from "@/app/actions/adminActions";
import { Users, FileText, LayoutList, Activity } from "lucide-react";

function StatCard({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-300">
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <p className="text-5xl font-black text-slate-900 group-hover:scale-105 origin-left transition-transform duration-300">{value}</p>
      </div>
      <div className={`p-5 rounded-2xl ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const statsResult = await getPlatformStats();
  
  // Provide defaults if stats fetch fails (e.g. if we are not admin but rendering server side)
  // Our layout protects against this client side, but server side needs fallback
  const stats = statsResult.success ? statsResult.stats : { users: 0, offers: 0, requests: 0, totalPosts: 0 };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
            System <span className="text-sky-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium">Real-time metrics for the BoardingFor.me platform.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 font-bold text-sm">
           <Activity className="w-4 h-4 animate-pulse" />
           System Healthy
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.users || 0} 
          icon={Users} 
          colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Total Active Posts" 
          value={stats?.totalPosts || 0} 
          icon={LayoutList} 
          colorClass="bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Housing Offers" 
          value={stats?.offers || 0} 
          icon={FileText} 
          colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Housing Requests" 
          value={stats?.requests || 0} 
          icon={FileText} 
          colorClass="bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors" 
        />
      </div>

      <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Quick Actions</h2>
        <p className="text-slate-500 mb-8 max-w-2xl leading-relaxed">
          Welcome to the BoardingFor.me administration console. Use the sidebar to navigate between user management and post moderation.
          Any deletions made here are permanent and directly affect the live database.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500"/> User Management</h3>
              <p className="text-sm text-slate-500">View user details, verify accounts, or remove bad actors from the platform.</p>
           </div>
           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-sky-500"/> Content Moderation</h3>
              <p className="text-sm text-slate-500">Review all housing offers and requests. Delete inappropriate or spam listings instantly.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
