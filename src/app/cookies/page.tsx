import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - BoardingFor.me Student Housing Sri Lanka",
  description: "Read our Cookie Policy to understand how BoardingFor.me uses cookies to improve your housing search experience across Sri Lanka.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-32">
      <div className="container mx-auto px-6 max-w-4xl bg-white p-12 rounded-[32px] shadow-sm border border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-relaxed">
          <p className="text-lg font-medium">Effective Date: January 1, 2026</p>
          
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are simple text files stored on your device that help our website remember you and your preferences. At BoardingFor.me, we use cookies to provide a seamless search experience when you're looking for university boarding places in Sri Lanka.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            We use cookies for several reasons, including:
          </p>
          <ul>
            <li><strong>Authentication:</strong> Keeping you securely logged into your BoardingFor.me account.</li>
            <li><strong>Preferences:</strong> Remembering your searches, university filters, and location preferences (e.g., Colombo, Katubedda, Kelaniya).</li>
            <li><strong>Performance & Analytics:</strong> Understanding how our platform is used so we can improve loading speeds and housing options for students.</li>
          </ul>

          <h2>3. Managing Your Cookies</h2>
          <p>
            You have the right to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline them if you prefer. Please note that disabling cookies may affect your ability to use certain features on BoardingFor.me, such as staying logged in or saving housing favorites.
          </p>
        </div>
      </div>
    </div>
  );
}