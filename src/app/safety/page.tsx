import { Metadata } from "next";
import { ShieldCheck, UserCheck, Key, HomeIcon, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety First - UniBoarding.com Student Housing Sri Lanka",
  description: "Learn how UniBoarding.com keeps Sri Lankan university students safe while searching for boarding places, apartments, and annexes near universities.",
};

export default function SafetyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-[0.2em] bg-emerald-50 px-4 py-2 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
            Our Priority
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Trust & Safety <br />for Students.</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mt-6">
            We've built the most secure ecosystem for student housing in Sri Lanka. Here is how we protect our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: UserCheck,
              title: "Verified Students Only",
              description: "Every user must verify their university email (.ac.lk) or student ID to access exact property locations and interact with landlords.",
              color: "text-sky-600",
              bg: "bg-sky-50"
            },
            {
              icon: HomeIcon,
              title: "Audited Listings",
              description: "To prevent scams, our moderation team reviews boarding places, annexes, and apartments before they go live on our platform.",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            },
            {
              icon: Key,
              title: "Secure Communication",
              description: "Chat securely within UniBoarding.com without exposing your personal phone number until you are ready to visit the property.",
              color: "text-indigo-600",
              bg: "bg-indigo-50"
            },
            {
              icon: Sparkles,
              title: "Review & Report System",
              description: "Students can review properties they have stayed in. We immediately suspend landlords who violate safety and habitability standards.",
              color: "text-rose-600",
              bg: "bg-rose-50"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500">
              <div className={`w-16 h-16 ${feature.bg} ${feature.color} flex items-center justify-center rounded-2xl mb-8`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}