import { Search, CheckCircle, MessageCircle, ArrowRight, Sparkles, ShieldCheck, Zap, Globe, LayoutGrid, Heart, SlidersHorizontal, Compass } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-10 h-10 text-sky-600" />,
      title: "Discovery Phase",
      description: "Advanced search filters tailored for student needs. Find listings by university proximity, budget, and roommate preferences.",
      badge: "Step 01"
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-sky-600" />,
      title: "Identity Verified Connection",
      description: "Direct, secure communication channels with property owners and peers. Every member undergoes a strict identity verification protocol.",
      badge: "Step 02"
    },
    {
      icon: <Zap className="w-10 h-10 text-sky-600" />,
      title: "Seamless Transition",
      description: "Finalize your arrangements through our platform with confidence. Secure your new home and focus on your academic journey.",
      badge: "Step 03"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-sky-500/5 border border-sky-100 mb-10">
             <Globe className="w-4 h-4" />
             <span>Operational Protocols</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-12">
             Modern Housing <br />
             <span className="text-sky-600 italic">Redefined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
             We've engineered a sophisticated ecosystem that prioritizes student safety and transparency across Sri Lanka's academic hubs.
          </p>
        </div>

        {/* Steps Grid - Arctic Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-sky-500/30 transition-all group hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-8 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">{step.badge}</div>
              <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center mb-12 group-hover:bg-sky-50 group-hover:scale-110 transition-all">
                {step.icon}
              </div>
              <div className="space-y-6">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{step.title}</h3>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed">
                   {step.description}
                 </p>
              </div>
            </div>
          ))}
        </div>

        {/* Arctic Light CTA Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[64px] p-16 md:p-32 text-center shadow-3xl relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523240715181-014b9f514d02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:opacity-10 transition-opacity">
             <ShieldCheck className="w-96 h-96 -rotate-12" />
          </div>
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Ready to find <br />
              your <span className="text-sky-400 italic">Space?</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Join the most elite network of university students and verified property owners in Sri Lanka today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="w-full sm:w-auto px-14 py-6 bg-sky-600 text-white rounded-[28px] font-black text-xl hover:bg-sky-500 transition-all shadow-2xl shadow-sky-600/20 flex items-center justify-center gap-4 group">
                Create Account <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/offers" className="w-full sm:w-auto px-14 py-6 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-[28px] font-black text-xl hover:bg-white/20 transition-all">
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-32 pt-10 border-t border-slate-100 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">
              Operational Handshake: Verified · Session Protocol: Arctic v5.2
           </p>
        </div>
      </div>
    </div>
  );
}
