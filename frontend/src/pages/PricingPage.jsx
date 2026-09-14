import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrandLogo from '../components/BrandLogo';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import {
  bookingUrl,
  checkoutHabitUrl,
  checkoutJourneyUrl,
  cohortApplyUrl,
  courseLibraryUrl,
  formationExploreUrl,
} from '../config/externalLinks';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

const foundationFree = ['24-question diagnostic', 'Score + alignment type', 'Three habits previewed'];

const foundationHabit = [
  'Full dashboard',
  'Daily habit tracking',
  'Weekly + quarterly reviews',
  'Score history',
];

const foundationJourney = [
  '6-week formation course',
  'Life architecture + rule of life',
  'Lifetime Habit Engine access',
];

const consultationFeatures = ['60-min session', 'Score review', 'Written follow-up'];

function CheckList({ items, checkClass = 'text-alignment-primary' }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((f) => (
        <li key={f} className="flex gap-2.5 text-sm text-alignment-accent/80 font-sans leading-relaxed">
          <span className={`${checkClass} shrink-0`} aria-hidden>
            ✓
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

function SectionRule({ children, bgClass = 'bg-alignment-surface' }) {
  return (
    <div className="relative flex items-center justify-center py-8 sm:py-10">
      <div className="absolute inset-x-0 top-1/2 h-px bg-alignment-accent/[0.1]" aria-hidden />
      <span
        className={`relative px-5 sm:px-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/50 ${bgClass}`}
      >
        {children}
      </span>
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [billingReady, setBillingReady] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/billing/status`)
      .then(({ data }) => {
        if (!cancelled) setBillingReady(Boolean(data?.configured));
      })
      .catch(() => {
        if (!cancelled) setBillingReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startCheckout = async (priceKey) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate(`/login?returnTo=${encodeURIComponent('/pricing')}`);
      return;
    }
    setCheckoutError(null);
    setCheckoutLoading(priceKey);
    try {
      const { data } = await axios.post(
        `${API_BASE}/billing/checkout`,
        { priceKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError('Checkout link was not returned.');
    } catch (err) {
      const fallback =
        priceKey === 'journey' ? checkoutJourneyUrl : checkoutHabitUrl;
      if (err.response?.status === 503 && fallback) {
        window.location.href = fallback;
        return;
      }
      setCheckoutError(
        err.response?.data?.message ||
          (err.code === 'ERR_NETWORK' ? networkErrorUserMessage() : 'Checkout unavailable.')
      );
    } finally {
      setCheckoutLoading(null);
    }
  };

  useEffect(() => {
    const prev = document.title;
    document.title = 'Pricing — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#journey-tier') return;
    const el = document.getElementById('journey-tier');
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  const habitMonthly = 12;
  const habitYearly = 120;
  const resourcesHref = courseLibraryUrl || formationExploreUrl();

  const toggleActive = 'bg-alignment-primary text-white shadow-sm';
  const toggleIdle = 'text-alignment-accent/50 hover:text-alignment-accent/80';

  return (
    <div className="min-h-screen w-full bg-alignment-surface text-alignment-accent flex flex-col overflow-x-hidden">
      <a href="#pricing-main" className="skip-to-main">
        Skip to main content
      </a>

      <SiteMarketingHeader />

      <main id="pricing-main" className="flex-1 w-full scroll-mt-16 font-sans" tabIndex={-1}>
        {/* Hero */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32 text-center">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Pricing</p>
            <h1 className="mt-6 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.85rem] font-medium text-alignment-accent leading-[1.15] tracking-tight text-balance">
              <em className="italic font-medium">Begin</em> free.
              <br />
              <span className="text-alignment-primary">Go deeper when ready.</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-alignment-accent/65 max-w-lg mx-auto leading-relaxed">
              Start free. Upgrade when you are ready.
            </p>
            {checkoutError && (
              <p className="mt-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3 max-w-md mx-auto" role="alert">
                {checkoutError}
              </p>
            )}
          </div>
        </section>

        {/* Habit Engine billing + Steps 1–3 */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
            <p className="text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-alignment-accent/45">
              Habit Engine billing
            </p>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div
                className="inline-flex items-center gap-1 rounded-full border border-alignment-accent/10 bg-alignment-accent/[0.02] p-1"
                role="group"
                aria-label="Billing period"
              >
                <button
                  type="button"
                  onClick={() => setBilling('monthly')}
                  className={`rounded-full px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'monthly' ? toggleActive : toggleIdle
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('yearly')}
                  className={`rounded-full px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    billing === 'yearly' ? toggleActive : toggleIdle
                  }`}
                >
                  Yearly
                  <span className="hidden sm:inline"> · save 17%</span>
                </button>
              </div>
              {billing === 'yearly' && (
                <span className="text-[10px] uppercase tracking-[0.16em] text-alignment-accent/45 sm:hidden">Save 17%</span>
              )}
            </div>

            <SectionRule>Steps 1 – 3 · The foundation</SectionRule>

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-alignment-accent/[0.1] bg-alignment-surface divide-y lg:divide-y-0 lg:divide-x divide-alignment-accent/[0.1] shadow-sm">
              {/* Step 1 */}
              <div className="flex flex-col p-6 sm:p-8 lg:min-h-[26rem]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 1</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55">Free · forever</span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Alignment Diagnostic</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$0</p>
                <p className="mt-1 text-xs text-alignment-accent/50">No card required</p>
                <CheckList items={foundationFree} />
                <div className="flex-1" />
                <Link
                  to="/assessment"
                  className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-accent/20 bg-alignment-surface px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-accent transition-colors hover:bg-alignment-accent/[0.03] ${focusRing}`}
                >
                  Begin free <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col p-6 sm:p-8 lg:min-h-[26rem]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 2</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary/90">
                    {billing === 'yearly' ? 'Yearly subscription' : 'Monthly subscription'}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Habit Engine</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">
                  {billing === 'yearly' ? `$${habitYearly}` : `$${habitMonthly}`}
                </p>
                <p className="mt-1 text-xs text-alignment-accent/50">
                  {billing === 'yearly' ? 'per year · save 17%' : 'per month · cancel any time'}
                </p>
                <CheckList items={foundationHabit} />
                <div className="flex-1" />
                {checkoutHabitUrl && !localStorage.getItem('accessToken') ? (
                  <a
                    href={checkoutHabitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 bg-transparent px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Activate <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled={!!checkoutLoading}
                    onClick={() => startCheckout(billing === 'yearly' ? 'habit_yearly' : 'habit_monthly')}
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 bg-transparent px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] disabled:opacity-60 ${focusRing}`}
                  >
                    {checkoutLoading?.startsWith('habit') ? 'Redirecting…' : 'Activate'}{' '}
                    <span aria-hidden className="ml-2">→</span>
                  </button>
                )}
                <p className="mt-3 text-center text-[11px] text-alignment-accent/45">
                  {billingReady === false
                    ? 'Stripe checkout is being connected. You can still begin free.'
                    : 'Secure checkout · Stripe'}
                </p>
              </div>

              {/* Step 3 */}
              <div
                id="journey-tier"
                className="flex flex-col scroll-mt-28 p-6 sm:p-8 lg:min-h-[26rem] bg-alignment-primary/[0.03] border-t-2 border-t-alignment-primary/25 lg:border-t-0 lg:border-l-2 lg:border-l-alignment-primary/20"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 3</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55">Course · one-time</span>
                </div>
                <h2 className="mt-6 font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">Journey to Purpose</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$297</p>
                <p className="mt-1 text-xs text-alignment-accent/50">Self-guided · lifetime access</p>
                <CheckList items={foundationJourney} />
                <div className="flex-1" />
                {checkoutJourneyUrl && !localStorage.getItem('accessToken') ? (
                  <a
                    href={checkoutJourneyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Begin journey <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled={!!checkoutLoading}
                    onClick={() => startCheckout('journey')}
                    className={`mt-10 w-full inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-4 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 disabled:opacity-60 ${focusRing}`}
                  >
                    {checkoutLoading === 'journey' ? 'Redirecting…' : 'Begin journey'}{' '}
                    <span aria-hidden className="ml-2">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Optional add-ons */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <h2 className="text-center font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">
              Optional add-ons
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-medium text-alignment-accent">Formation resources</h3>
                <p className="mt-2 font-display text-2xl font-medium text-alignment-accent tabular-nums">$19 – $97</p>
                <p className="mt-1 text-xs text-alignment-accent/50">Planners, workbooks, short courses</p>
                <div className="flex-1" />
                <a
                  href={resourcesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                >
                  Browse <span aria-hidden className="ml-2">→</span>
                </a>
              </div>

              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-medium text-alignment-accent">Formation consultation</h3>
                <p className="mt-2 font-display text-2xl font-medium text-alignment-accent tabular-nums">$127</p>
                <p className="mt-1 text-xs text-alignment-accent/50">60 minutes · one session</p>
                <CheckList items={consultationFeatures} />
                <div className="flex-1" />
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Book <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/business"
                    className={`mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-alignment-primary/40 px-6 py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-alignment-primary transition-colors hover:bg-alignment-primary/[0.06] ${focusRing}`}
                  >
                    Book <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-6 border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-medium text-alignment-accent">Guided cohort</h3>
                <p className="mt-1 text-xs text-alignment-accent/50">Six weeks · small group · limited places</p>
              </div>
              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <p className="font-display text-2xl font-medium text-alignment-accent tabular-nums">$997</p>
                {cohortApplyUrl ? (
                  <a
                    href={cohortApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-6 py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Apply <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/business"
                    className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white px-6 py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
                  >
                    Apply <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/assessment"
                className={`inline-flex items-center justify-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-alignment-primary border-b border-alignment-primary/30 pb-0.5 hover:border-alignment-primary/60 transition-colors ${focusRing} rounded-sm`}
              >
                Start with the diagnostic — free <span aria-hidden className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Institutions */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <h2 className="font-display text-xl sm:text-2xl font-medium text-alignment-accent tracking-tight">
              For teams & institutions
            </h2>
            <p className="mt-3 text-sm text-alignment-accent/65 max-w-xl">
              Custom programmes for leaders, organizations, and schools.
            </p>
            <Link
              to="/business"
              className={`mt-6 inline-flex text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-primary border-b border-alignment-primary/30 pb-0.5 hover:border-alignment-primary/60 transition-colors ${focusRing} rounded-sm`}
            >
              Learn more <span aria-hidden>→</span>
            </Link>
            <p className="mt-6 text-sm text-alignment-accent/50">
              <a
                href="mailto:organizations@alignmentos.com"
                className="text-alignment-accent/70 underline underline-offset-2 hover:text-alignment-accent"
              >
                organizations@alignmentos.com
              </a>
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="w-full border-t border-white/15 bg-alignment-primary">
          <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
            <h2 className="font-display text-[1.75rem] sm:text-2xl md:text-[2.25rem] font-medium text-white leading-snug text-balance">
              The diagnostic <span className="italic font-normal text-white/90">costs nothing.</span>
            </h2>
            <Link
              to="/assessment"
              className="mt-10 inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 transition-colors hover:bg-alignment-foundation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-primary"
            >
              Begin free <span aria-hidden className="ml-2">→</span>
            </Link>
            <p className="mt-8 text-xs sm:text-sm text-white/45">Free · ~12 min · No card</p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-alignment-accent/[0.08] bg-alignment-surface mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <BrandLogo iconHeightPx={44} />
            <Link to="/" className={`text-sm text-alignment-accent/70 hover:text-alignment-accent ${focusRing} rounded-sm sm:text-right`}>
              ← Home
            </Link>
          </div>
          <SiteSecondaryFooterNav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end" />
        </div>
      </footer>
    </div>
  );
}
