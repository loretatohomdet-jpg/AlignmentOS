import { useState, useEffect, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import AgentFloatingButton from '../components/AgentFloatingButton';
import EmailCaptureForm from '../components/EmailCaptureForm';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pillGhost, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Shared focus ring for primary actions (matches global focus-visible outline) */
const focusRingBtn =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

function AnimatedProofStat({ target, prefix = '', suffix = '', label }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    let rafId = 0;
    const duration = 2000;
    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
      else setValue(target);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, prefersReducedMotion]);

  return (
    <div ref={ref} className="bg-alignment-primary px-4 py-8 sm:py-10 md:py-12 text-center">
      <p className="font-display text-[clamp(1.35rem,7vw,2.75rem)] sm:text-4xl md:text-[2.75rem] font-medium text-white leading-none tracking-tight tabular-nums px-1">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="mt-3 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] text-white/55">
        {label}
      </p>
    </div>
  );
}

function FinalCtaClosing() {
  return (
    <section
      className="w-full bg-alignment-foundation border-t border-alignment-neutral/25"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28 lg:py-32 text-center">
        <p className={type.kicker}>The Alignment Reset</p>
        <h2 id="final-cta-heading" className={`mt-6 ${type.h2}`}>
          Get the guide.
        </h2>
        <p className="mt-6 text-sm sm:text-base text-alignment-accent/75 leading-relaxed">
          A short letter on where life holds, where it strains, and how to begin. We’ll send it to your inbox.
        </p>

        <div className="mt-8 w-full max-w-sm mx-auto text-left">
          <EmailCaptureForm
            source="home-reset-guide"
            redirectTo={null}
            layout="stacked"
            buttonText="Get the Alignment Reset guide"
            helperText="No spam. Unsubscribe any time."
            successText="The Alignment Reset guide is on its way to your inbox."
          />
        </div>
        <p className="mt-5 text-center">
          <Link
            to="/assessment"
            className="text-[11px] sm:text-xs text-alignment-accent/50 transition-colors duration-200 hover:text-alignment-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alignment-primary/30 rounded-sm px-0.5"
          >
            Prefer the diagnostic? Begin free <span aria-hidden>→</span>
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link
            to="/dashboard"
            className="text-[11px] sm:text-xs text-alignment-accent/50 transition-colors duration-200 hover:text-alignment-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alignment-primary/30 rounded-sm px-0.5"
          >
            Already have an account? Dashboard <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LandingPage() {
  /** Six domains — olive bar marquee (white / grey dots only). */
  const heroDomains = [
    { label: 'Identity', dot: 'bg-alignment-surface' },
    { label: 'Purpose', dot: 'bg-alignment-surface/70' },
    { label: 'Mindset', dot: 'bg-alignment-surface' },
    { label: 'Habits', dot: 'bg-alignment-surface/70' },
    { label: 'Environment', dot: 'bg-alignment-surface' },
    { label: 'Execution', dot: 'bg-alignment-surface/70' },
  ];

  const compoundingSteps = [
    { n: 1, title: 'Diagnostic' },
    { n: 2, title: 'Identity anchors' },
    { n: 3, title: 'Habit engine' },
    { n: 4, title: 'Weekly review' },
  ];

  const sixDomains = [
    { pillar: 'IDENTITY', title: 'Identity' },
    { pillar: 'PURPOSE', title: 'Purpose' },
    { pillar: 'MINDSET', title: 'Mindset' },
    { pillar: 'HABITS', title: 'Habits' },
    { pillar: 'ENVIRONMENT', title: 'Environment' },
    { pillar: 'EXECUTION', title: 'Execution' },
  ];

  const proofStats = [
    { target: 24, label: 'Questions' },
    { target: 6, label: 'Life domains' },
    { target: 90, label: 'Day cycles' },
    { target: 0, prefix: '$', label: 'To begin' },
  ];

  const domainRow = (
    <ul className="flex shrink-0 items-center gap-x-10 sm:gap-x-14 md:gap-x-16 pr-10 sm:pr-14">
      {heroDomains.map(({ label, dot }) => (
        <li key={label} className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] whitespace-nowrap">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`${type.page} overflow-x-hidden`}>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="main-content" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* First fold — full-bleed hero (no inset card / frame) */}
        <section className="flex w-full flex-col bg-alignment-foundation min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-6rem)]">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="relative flex flex-1 flex-col justify-center px-6 sm:px-8 lg:px-12 pt-12 pb-8 sm:pt-16 sm:pb-10">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className={type.h1Hero}>
                A life is formed
                <br />
                by what is repeated.
              </h1>
              <p className="mt-7 sm:mt-9 text-base sm:text-lg text-alignment-accent/60 leading-relaxed max-w-xl mx-auto">
                See where your life holds. Close the gap.
                <br />
                Keep it.
              </p>
              <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link to="/assessment" className={pillPrimary}>
                  Begin free diagnostic
                </Link>
                <Link to="/cohort" className={pillGhost}>
                  The cohort
                </Link>
              </div>
              <p className="mt-5 text-sm text-alignment-accent/45">Twelve minutes. No account. No card.</p>
            </div>
            </div>
          </div>

          <div
            className="relative w-full shrink-0 bg-alignment-primary text-white overflow-hidden"
            role="region"
            aria-label="Six alignment domains"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-alignment-primary to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-alignment-primary to-transparent" aria-hidden />
            <div className="flex w-max motion-safe:animate-marquee-domains motion-reduce:animate-none py-3 sm:py-3.5 will-change-transform">
              {domainRow}
              <ul className="flex shrink-0 items-center gap-x-10 sm:gap-x-14 md:gap-x-16 pr-10 sm:pr-14" aria-hidden>
                {heroDomains.map(({ label, dot }) => (
                  <li key={`dup-${label}`} className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] whitespace-nowrap">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Second section — quote */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className="max-w-xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
            <blockquote className={type.quote}>
              <p>
                You need <em className="italic text-alignment-accent/70">structure beneath</em> the effort — not more effort.
              </p>
            </blockquote>
          </div>
        </section>

        {/* The compounding loop — four steps */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <h2 className={`${type.h2} max-w-xl text-balance`}>
              Four steps. <span className="italic font-normal text-alignment-accent/80">One system.</span>
            </h2>
            <div className="mt-10 sm:mt-12">
              <ol className="flex flex-col gap-0 lg:hidden">
                {compoundingSteps.map((step, idx) => (
                  <li key={step.n} className="list-none">
                    <div className="flex flex-col">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-alignment-accent/20 text-sm font-medium text-alignment-accent/70"
                        aria-hidden
                      >
                        {step.n}
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-alignment-accent tracking-tight">{step.title}</h3>
                    </div>
                    {idx < 3 && (
                      <div className="flex justify-start pl-3 py-5" aria-hidden="true">
                        <svg className="h-5 w-5 text-alignment-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </li>
                ))}
              </ol>

              {/** Desktop: 7-col grid — equal step columns + fixed arrow gutters so chevrons align with badge row */}
              <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)] lg:items-start">
                {compoundingSteps.map((step, idx) => (
                  <Fragment key={`desktop-${step.n}`}>
                    <div className="min-w-0 flex flex-col">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-alignment-accent/20 text-sm font-medium text-alignment-accent/70"
                        aria-hidden
                      >
                        {step.n}
                      </span>
                      <h3 className="mt-6 text-base font-semibold text-alignment-accent tracking-tight">{step.title}</h3>
                    </div>
                    {idx < 3 && (
                      <div
                        className="flex h-11 w-full shrink-0 items-center justify-center text-alignment-accent/30"
                        aria-hidden="true"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="mt-10 max-w-xl">
              <Link
                to="/assessment"
                className={`inline-block rounded-sm text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 transition-colors duration-200 hover:border-alignment-accent focus-visible:border-alignment-accent ${focusRingBtn}`}
              >
                Start free <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Six domains */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <h2 className={type.h2}>
              Six domains
            </h2>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {sixDomains.map((domain) => (
                <div
                  key={domain.pillar}
                  className="group flex items-center gap-3 rounded-xl border border-alignment-accent/10 bg-alignment-foundationBright/95 px-4 py-3 transition-colors duration-200 hover:border-alignment-primary hover:bg-alignment-primary"
                >
                  <DomainPillarIcon
                    pillar={domain.pillar}
                    className="h-6 w-6 shrink-0 text-alignment-primary transition-colors duration-200 group-hover:text-white"
                  />
                  <h3 className="text-sm font-semibold text-alignment-accent transition-colors duration-200 group-hover:text-white">
                    {domain.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof stats */}
        <section className="w-full border-t border-alignment-accent/[0.06]">
          <div className="w-full bg-alignment-primary">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/25">
              {proofStats.map((s) => (
                <AnimatedProofStat
                  key={s.label}
                  target={s.target}
                  prefix={s.prefix ?? ''}
                  suffix={s.suffix ?? ''}
                  label={s.label}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — closing */}
        <FinalCtaClosing />

        <SitePageFooter />
        <AgentFloatingButton />
      </main>
    </div>
  );
}
