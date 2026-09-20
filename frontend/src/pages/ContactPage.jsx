import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, SitePageFooter } from '../components/HomeMarketingChrome';
import { siteContactEmail } from '../config/footerNav';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

export default function ContactPage() {
  usePageTitle('Contact — Alignment OS');
  const copy = pageCopy(useSitePage('/contact'), {
    eyebrow: 'Contact',
    headline: 'Write to us.',
    body: 'Questions about Alignment OS, the assessment, or your account can be sent here.',
    ctaHref: `mailto:${siteContactEmail}`,
    ctaLabel: siteContactEmail,
  });

  return (
    <div className={type.page}>
      <a href="#contact-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="contact-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-20 sm:pb-28`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1}`}>{copy.headline}</h1>
              <p className={`mt-6 ${type.body}`}>{copy.body}</p>
              <p className={`mt-8 ${type.body}`}>
                <a href={copy.ctaHref} className="underline underline-offset-4 hover:text-alignment-accent">
                  {copy.ctaLabel}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
