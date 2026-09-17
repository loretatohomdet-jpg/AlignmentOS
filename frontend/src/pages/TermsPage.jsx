import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

export default function TermsPage() {
  return (
    <div className={type.page}>
      <SiteMarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <h1 className={type.h1}>
          Terms & Conditions
        </h1>
        <p className={`mt-2 ${type.muted}`}>Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-10 space-y-6 text-alignment-accent leading-relaxed">
          <section>
            <h2 className={`${type.h3} mt-8`}>1. Acceptance</h2>
            <p className="mt-2 text-alignment-accent/90">
              By using Alignment OS (“the Service”), you agree to these Terms. If you do not agree, do not use the Service. We may update these Terms from time to time; continued use after changes constitutes acceptance.
            </p>
          </section>
          <section>
            <h2 className={`${type.h3} mt-8`}>2. Use of the Service</h2>
            <p className="mt-2 text-alignment-accent/90">
              You must use the Service in compliance with applicable laws and our policies. You are responsible for keeping your account credentials secure. The Alignment OS and related content are for personal reflection and self-improvement; they are not professional advice (e.g. medical, legal, or financial).
            </p>
          </section>
          <section>
            <h2 className={`${type.h3} mt-8`}>3. Subscriptions & payment</h2>
            <p className="mt-2 text-alignment-accent/90">
              Paid plans are billed according to the pricing in effect at the time of sign-up. You may cancel at any time. Refunds are handled according to our refund policy. We may change pricing with reasonable notice.
            </p>
          </section>
          <section>
            <h2 className={`${type.h3} mt-8`}>4. Limitation of liability</h2>
            <p className="mt-2 text-alignment-accent/90">
              The Service is provided “as is.” To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid us in the twelve months before the claim.
            </p>
          </section>
          <section>
            <h2 className={`${type.h3} mt-8`}>5. Contact</h2>
            <p className="mt-2 text-alignment-accent/90">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@alignmentindex.com" className="text-alignment-accent hover:underline">legal@alignmentindex.com</a>.
            </p>
          </section>
        </div>
        <p className="mt-12">
          <Link to="/" className="text-sm text-alignment-accent/90 hover:text-alignment-accent underline underline-offset-4">
            ← Back to home
          </Link>
        </p>
      </main>
      <SitePageFooter />
    </div>
  );
}
