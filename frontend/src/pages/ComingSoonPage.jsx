import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { comingSoonVariants } from '../config/comingSoonContent';
import { SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2';

export default function ComingSoonPage({ variant }) {
  const c = comingSoonVariants[variant];

  useEffect(() => {
    if (!c) return;
    const prev = document.title;
    document.title = `${c.kicker} — Alignment OS`;
    return () => {
      document.title = prev;
    };
  }, [c, variant]);

  if (!c) return null;

  return (
    <div className={type.page}>
      <a href="#coming-soon-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="coming-soon-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <p className={`text-center ${type.kicker}`}>
            {c.kicker}
          </p>
          <h1 className={`mt-6 ${type.h1} text-balance text-center`}>
            {c.title}
          </h1>
          <p className={`mt-6 ${type.body} text-center`}>{c.body}</p>

          <ul className="mt-12 space-y-4">
            {c.links.map(({ to, label, note }) => (
              <li key={to + label}>
                <Link
                  to={to}
                  className={`block rounded-xl border border-alignment-accent/[0.08] bg-apple-surface-muted px-5 py-4 transition-colors hover:border-alignment-accent/15 hover:bg-alignment-surface ${focusRing}`}
                >
                  <span className="font-medium text-alignment-accent">{label}</span>
                  {note && <span className="mt-1 block text-xs text-alignment-accent/75">{note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
