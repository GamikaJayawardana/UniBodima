import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - UniBoarding.com Student Housing",
  description:
    "Terms and conditions for using UniBoarding.com, the leading marketplace for university boarding places and student accommodations in Sri Lanka.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-32">
      <div className="container mx-auto px-6 max-w-4xl bg-white p-12 rounded-[32px] shadow-sm border border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-slate max-w-none text-slate-600 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-relaxed">
          <p className="text-lg font-medium">Effective Date: January 1, 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using UniBoarding.com, you accept and agree to be bound
            by these Terms of Service. If you do not agree to these terms, you
            must not use our platform to search for or list boarding places in
            Sri Lanka.
          </p>

          <h2>2. User Conduct</h2>
          <p>
            Our platform is exclusively intended for university students and
            verified property owners. You agree to:
          </p>
          <ul>
            <li>
              Provide accurate information during registration and identity
              verification.
            </li>
            <li>
              Not post fraudulent, misleading, or deceptive housing listings.
            </li>
            <li>
              Respect the community and maintain professional communication.
            </li>
          </ul>

          <h2>3. Listing Rules</h2>
          <p>
            Landlords must ensure their properties meet basic safety and
            habitability standards. UniBoarding.com reserves the right to remove any
            listing that violates our Safety First guidelines or receives
            multiple credible complaints from students.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            UniBoarding.com acts as a connection platform. While we enforce strict
            verification, we are not liable for disputes arising directly
            between students and landlords regarding lease agreements or
            property conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
