import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - BoardingFor.me Sri Lanka",
  description:
    "Privacy policy for BoardingFor.me. Discover how we protect the data and privacy of university students searching for boarding places in Sri Lanka.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-32">
      <div className="container mx-auto px-6 max-w-4xl bg-white p-12 rounded-[32px] shadow-sm border border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none text-slate-600 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-relaxed">
          <p className="text-lg font-medium">Effective Date: January 1, 2026</p>

          <h2>1. Information We Collect</h2>
          <p>
            At BoardingFor.me, we are committed to protecting the privacy and
            security of the university students and landlords in Sri Lanka who
            use our platform to find or list student housing. We collect
            personal information such as your name, university affiliation,
            email address, phone number, and identity verification documents.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is primarily used to connect students with verified
            landlords and to ensure a safe boarding environment. We use your
            data to:
          </p>
          <ul>
            <li>
              Verify your identity as a legitimate student or property owner in
              Sri Lanka.
            </li>
            <li>Maintain trust and safety across all housing listings.</li>
            <li>
              Improve our platform's user experience and search algorithms.
            </li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>
            We do not sell your personal data to third parties. Limited contact
            information may be shared between verified students and landlords
            only when a direct housing inquiry or booking is initiated.
          </p>
        </div>
      </div>
    </div>
  );
}
