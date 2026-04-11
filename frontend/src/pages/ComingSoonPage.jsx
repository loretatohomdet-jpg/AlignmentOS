import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';
import { comingSoonVariants } from '../config/comingSoonContent';

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
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col">
      <a href="#coming-soon-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="coming-soon-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <p className="text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/45">
            {c.kicker}
          </p>
          <h1 className="mt-6 font-display text-[1.85rem] sm:text-[2.25rem] font-medium text-alignment-accent leading-tight text-balance text-center">
            {c.title}
          </h1>
          <p className="mt-6 text-sm sm:text-base text-alignment-accent/65 leading-relaxed text-center">{c.body}</p>

          <ul className="mt-12 space-y-4">
            {c.links.map(({ to, label, note }) => (
              <li key={to + label}>
                <Link
                  to={to}
                  className={`block rounded-xl border border-alignment-accent/[0.08] bg-apple-surface-muted px-5 py-4 transition-colors hover:border-alignment-accent/15 hover:bg-alignment-surface ${focusRing}`}
                >
                  <span className="font-medium text-alignment-accent">{label}</span>
                  {note && <span className="mt-1 block text-xs text-alignment-accent/50">{note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="w-full border-t border-alignment-accent/[0.08] bg-alignment-surface mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <BrandLogo iconHeightPx={44} />
            <Link to="/" className={`text-sm text-alignment-accent/70 hover:text-alignment-accent ${focusRing} rounded-sm sm:text-right`}>
              ← Back to home
            </Link>
          </div>
          <SiteSecondaryFooterNav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end" />
        </div>
      </footer>
    </div>
  );
}
