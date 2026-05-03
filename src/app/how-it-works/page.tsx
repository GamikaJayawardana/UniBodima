import { Search, CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "1. Search or Request",
      description: "Browse verified listings around your university or post exactly what you're looking for so owners can find you."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "2. Connect Safely",
      description: "Use our platform to securely find contact details and communicate with property owners or potential roommates."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: "3. Move In",
      description: "Finalize your arrangements, pack your bags, and move into your new university home with confidence."
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen pt-32 pb-16 bg-[#FCFCFD]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How UniBodimHub Works
          </h1>
          <p className="text-lg md:text-xl text-slate-500">
            We've simplified the process of finding student accommodation. Whether you have a space to offer or you're looking for one, our platform bridges the gap safely.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm relative hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 max-w-5xl mx-auto text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your next space?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join the fastest-growing network of university students and property owners in Sri Lanka today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Create an Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/offers" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors backdrop-blur-sm">
                Browse Offers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
