import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import {
  pillGhost,
  pillOnOlive,
  pillOutline,
  pillPrimary,
  SitePageFooter,
} from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

const foundationFree = [
  '24-question diagnostic',
  'Score + alignment type',
  'Three practices + daily check-in',
];

const foundationHabit = [
  'Daily rooms — morning, midday, close',
  'Practice library',
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
        <li key={f} className="flex gap-2.5 text-sm text-alignment-accent/90 font-sans leading-relaxed">
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
        className={`relative px-5 sm:px-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent/75 ${bgClass}`}
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
  const [needAccount, setNeedAccount] = useState(false);

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
      setNeedAccount(true);
      requestAnimationFrame(() => {
        document.getElementById('account-to-upgrade')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
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
  const toggleIdle = 'text-alignment-accent/75 hover:text-alignment-accent/80';

  return (
    <div className={type.page}>
      <a href="#pricing-main" className="skip-to-main">
        Skip to main content
      </a>

      <SiteMarketingHeader />

      <main id="pricing-main" className="flex-1 w-full scroll-mt-16 font-sans" tabIndex={-1}>
        {/* Hero */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32 text-center">
            <p className={type.kicker}>Pricing</p>
            <h1 className={`mt-6 ${type.h1} text-center text-balance`}>
              Begin free.
              <br />
              Go deeper when ready.
            </h1>
            <p className={`mt-6 ${type.body} max-w-lg mx-auto`}>
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
            <p className={`text-center ${type.kicker}`}>Habit Engine billing</p>

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
                <span className="text-[10px] uppercase tracking-[0.16em] text-alignment-accent/65 sm:hidden">Save 17%</span>
              )}
            </div>

            <SectionRule>Steps 1 – 3 · The foundation</SectionRule>

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-alignment-accent/[0.1] bg-alignment-surface divide-y lg:divide-y-0 lg:divide-x divide-alignment-accent/[0.1] shadow-sm">
              {/* Step 1 */}
              <div className="flex flex-col p-6 sm:p-8 lg:min-h-[26rem]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-primary">Step 1</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/80">Free · forever</span>
                </div>
                <h2 className={`mt-6 ${type.h3}`}>Alignment Diagnostic</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$0</p>
                <p className="mt-1 text-xs text-alignment-accent/75">No card required</p>
                <CheckList items={foundationFree} />
                <div className="flex-1" />
                <Link to="/assessment" className={`${pillGhost} mt-10 w-full`}>
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
                <h2 className={`mt-6 ${type.h3}`}>Habit Engine</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">
                  {billing === 'yearly' ? `$${habitYearly}` : `$${habitMonthly}`}
                </p>
                <p className="mt-1 text-xs text-alignment-accent/75">
                  {billing === 'yearly' ? 'per year · save 17%' : 'per month · cancel any time'}
                </p>
                <CheckList items={foundationHabit} />
                <div className="flex-1" />
                <button
                  type="button"
                  disabled={!!checkoutLoading}
                  onClick={() => startCheckout(billing === 'yearly' ? 'habit_yearly' : 'habit_monthly')}
                  className={`${pillOutline} mt-10 w-full disabled:opacity-60`}
                >
                  {checkoutLoading?.startsWith('habit') ? 'Redirecting…' : 'Activate'}{' '}
                  <span aria-hidden className="ml-2">→</span>
                </button>
                <p className="mt-3 text-center text-[11px] text-alignment-accent/65">
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
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/80">Course · one-time</span>
                </div>
                <h2 className={`mt-6 ${type.h3}`}>Journey to Purpose</h2>
                <p className="mt-5 font-display text-4xl sm:text-[2.75rem] font-medium text-alignment-accent tabular-nums">$297</p>
                <p className="mt-1 text-xs text-alignment-accent/75">Self-guided · lifetime access</p>
                <CheckList items={foundationJourney} />
                <div className="flex-1" />
                <button
                  type="button"
                  disabled={!!checkoutLoading}
                  onClick={() => startCheckout('journey')}
                  className={`${pillPrimary} mt-10 w-full disabled:opacity-60`}
                >
                  {checkoutLoading === 'journey' ? 'Redirecting…' : 'Begin journey'}{' '}
                  <span aria-hidden className="ml-2">→</span>
                </button>
              </div>
            </div>
          </div>
          {needAccount && (
            <div
              id="account-to-upgrade"
              className="max-w-xl mx-auto px-6 sm:px-8 pb-16 text-center"
            >
              <p className={type.kicker}>To continue</p>
              <p className={`mt-4 ${type.h3}`}>Create an account or sign in</p>
              <p className="mt-3 text-sm text-alignment-accent/90 leading-relaxed">
                Then you’ll return here to complete checkout.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup?returnTo=/pricing" className={pillPrimary}>
                  Create an account
                </Link>
                <Link to="/login?returnTo=/pricing" className={pillGhost}>
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Optional add-ons */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <h2 className={`text-center ${type.h2}`}>Optional add-ons</h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-medium text-alignment-accent">Formation resources</h3>
                <p className="mt-2 font-display text-2xl font-medium text-alignment-accent tabular-nums">$19 – $97</p>
                <p className="mt-1 text-xs text-alignment-accent/75">Planners, workbooks, short courses</p>
                <div className="flex-1" />
                <a
                  href={resourcesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillOutline} mt-6 w-full sm:w-auto`}
                >
                  Browse <span aria-hidden className="ml-2">→</span>
                </a>
              </div>

              <div className="flex flex-col border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-medium text-alignment-accent">Formation consultation</h3>
                <p className="mt-2 font-display text-2xl font-medium text-alignment-accent tabular-nums">$127</p>
                <p className="mt-1 text-xs text-alignment-accent/75">60 minutes · one session</p>
                <CheckList items={consultationFeatures} />
                <div className="flex-1" />
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${pillOutline} mt-6 w-full sm:w-auto`}
                  >
                    Book <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/business"
                    className={`${pillOutline} mt-6 w-full sm:w-auto`}
                  >
                    Book <span aria-hidden className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-6 border border-alignment-accent/[0.1] bg-alignment-surface p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-medium text-alignment-accent">Guided cohort</h3>
                <p className="mt-1 text-xs text-alignment-accent/75">Six weeks · small group · limited places</p>
              </div>
              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <p className="font-display text-2xl font-medium text-alignment-accent tabular-nums">$997</p>
                {cohortApplyUrl ? (
                  <a
                    href={cohortApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pillPrimary}
                  >
                    Apply <span aria-hidden className="ml-2">→</span>
                  </a>
                ) : (
                  <Link
                    to="/business"
                    className={pillPrimary}
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
            <h2 className={type.h2}>For teams & institutions</h2>
            <p className={`mt-3 ${type.body} max-w-xl`}>
              Custom programmes for leaders, organizations, and schools.
            </p>
            <Link
              to="/business"
              className={`mt-6 inline-flex text-[10px] font-medium uppercase tracking-[0.18em] text-alignment-primary border-b border-alignment-primary/30 pb-0.5 hover:border-alignment-primary/60 transition-colors ${focusRing} rounded-sm`}
            >
              Learn more <span aria-hidden>→</span>
            </Link>
            <p className="mt-6 text-sm text-alignment-accent/75">
              <a
                href="mailto:organizations@alignmentos.com"
                className="text-alignment-accent/90 underline underline-offset-2 hover:text-alignment-accent"
              >
                organizations@alignmentos.com
              </a>
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="w-full border-t border-white/15 bg-alignment-primary">
          <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-white leading-snug text-balance">
              The diagnostic <span className="italic font-normal text-white/90">costs nothing.</span>
            </h2>
            <Link
              to="/assessment"
              className={`${pillOnOlive} mt-10`}
            >
              Begin free <span aria-hidden className="ml-2">→</span>
            </Link>
            <p className="mt-8 text-xs sm:text-sm text-white/80">Free · ~12 min · No card</p>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
