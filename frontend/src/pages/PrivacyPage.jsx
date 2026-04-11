import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col">
      <SiteMarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-alignment-accent/70">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-10 space-y-6 text-alignment-accent leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-alignment-accent mt-8">1. Information we collect</h2>
            <p className="mt-2 text-alignment-accent/70">
              We collect information you provide when you create an account (email, name), when you take the assessment (your responses and derived AQ score), and when you use the service (e.g. device and usage data). We use this to provide the service, improve it, and communicate with you.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-alignment-accent mt-8">2. How we use it</h2>
            <p className="mt-2 text-alignment-accent/70">
              Your data is used to calculate and display your AQ score, to personalize your experience, and to send you important service updates. We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-alignment-accent mt-8">3. Data retention & security</h2>
            <p className="mt-2 text-alignment-accent/70">
              We retain your account and assessment data for as long as your account is active. We use industry-standard measures to protect your data. You can request deletion of your account and data at any time by contacting us.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-alignment-accent mt-8">4. Contact</h2>
            <p className="mt-2 text-alignment-accent/70">
              For privacy-related questions or requests, contact us at{' '}
              <a href="mailto:privacy@alignmentindex.com" className="text-alignment-accent hover:underline">privacy@alignmentindex.com</a>.
            </p>
          </section>
        </div>
        <p className="mt-12">
          <Link to="/" className="text-alignment-accent font-medium hover:underline">← Back to home</Link>
        </p>
      </main>
    </div>
  );
}
