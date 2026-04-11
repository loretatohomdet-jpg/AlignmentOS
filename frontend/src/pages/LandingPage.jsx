import { useState, useEffect, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import AgentFloatingButton from '../components/AgentFloatingButton';
import BrandLogo from '../components/BrandLogo';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteMarketingFooterNav } from '../components/SiteFooterNav';

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
      <p className="font-display text-[2rem] sm:text-4xl md:text-[2.75rem] font-medium text-white leading-none tracking-tight tabular-nums">
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
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [n24, setN24] = useState(0);
  const [n6, setN6] = useState(0);
  const [n12, setN12] = useState(0);
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
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion) {
      setN24(24);
      setN6(6);
      setN12(12);
      return;
    }
    let rafId = 0;
    const duration = 2000;
    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) ** 3;
      setN24(Math.round(24 * eased));
      setN6(Math.round(6 * eased));
      setN12(Math.round(12 * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
      else {
        setN24(24);
        setN6(6);
        setN12(12);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, prefersReducedMotion]);

  return (
    <section
      className="w-full bg-alignment-foundation border-t border-alignment-neutral/25"
      aria-labelledby="final-cta-heading"
    >
      <div ref={ref} className="max-w-2xl mx-auto px-6 py-20 sm:py-28 lg:py-32 text-center">
        <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-primary/70">
          Begin today
        </p>
        <h2
          id="final-cta-heading"
          className="mt-6 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight"
        >
          Your score is waiting.
        </h2>
        <p className="mt-8 text-sm sm:text-base text-alignment-accent/75 leading-relaxed">
          <span className="font-semibold text-alignment-accent tabular-nums">{n24}</span> questions
          <span className="mx-2 sm:mx-2.5 text-alignment-primary/40" aria-hidden>
            ·
          </span>
          <span className="font-semibold text-alignment-accent tabular-nums">{n6}</span> domains
          <span className="mx-2 sm:mx-2.5 text-alignment-primary/40" aria-hidden>
            ·
          </span>
          <span className="font-semibold text-alignment-accent tabular-nums">{n12}</span> minutes.
        </p>
        <p className="mt-3 text-sm text-alignment-accent/55">Free forever. No card required.</p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <Link
            to="/assessment"
            className={`inline-flex items-center gap-2 rounded-sm bg-alignment-primary text-white px-8 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 ease-out hover:bg-alignment-primary/90 focus-visible:ring-offset-alignment-foundation ${focusRingBtn}`}
          >
            Begin free diagnostic
            <span className="translate-y-px" aria-hidden>
              →
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="text-[11px] sm:text-xs text-alignment-accent/50 transition-colors duration-200 hover:text-alignment-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alignment-primary/30 rounded-sm px-0.5"
          >
            Already have an account? Open Dashboard <span aria-hidden>→</span>
          </Link>
        </div>
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
    {
      n: 1,
      title: 'Diagnostic',
      body: '24 questions. Six domains scored. Alignment Type named. Primary strain identified. Free.',
    },
    {
      n: 2,
      title: 'Identity anchors',
      body: 'Three statements about who you are becoming. Every habit is rooted here.',
    },
    {
      n: 3,
      title: 'Habit engine',
      body: 'Three habits from your primary gap. Tracked daily. Recalibrated every 90 days.',
    },
    {
      n: 4,
      title: 'Weekly review',
      body: '10 minutes every Sunday. What held. What drifted. Intention for the week ahead.',
    },
  ];

  const sixDomains = [
    { dot: 'bg-alignment-primary', title: 'Identity', body: 'Who you are — values, moral framework, the person you are becoming.' },
    { dot: 'bg-alignment-primary/70', title: 'Purpose', body: 'What you are for — mission clarity, direction, vocation this season.' },
    { dot: 'bg-alignment-primary/50', title: 'Mindset', body: 'How you think — beliefs shaping perception, confidence, decisions.' },
    { dot: 'bg-alignment-primary/40', title: 'Habits', body: 'What you do daily — practices reinforcing identity and purpose.' },
    { dot: 'bg-alignment-primary/60', title: 'Environment', body: 'What surrounds you — relationships, inputs, spaces shaping behaviour.' },
    { dot: 'bg-alignment-primary/35', title: 'Execution', body: 'How you follow through — discipline, planning, completing what matters.' },
  ];

  const alignmentTypes = [
    {
      title: 'The Integrated Person',
      tagline: 'Coherence across all six domains.',
      status: 'All domains strong',
    },
    {
      title: 'The Capable Builder',
      tagline: 'Building much. Rooted in less.',
      status: 'High execution, low identity',
    },
    {
      title: 'The Thoughtful Seeker',
      tagline: 'Interior life present. Direction forming.',
      status: 'High identity, low purpose',
    },
    {
      title: 'The Ordered Life',
      tagline: 'Structure real. Alignment still forming.',
      status: 'High habits, low anchor',
    },
    {
      title: 'The Person Under Pressure',
      tagline: 'Formation in a demanding season.',
      status: 'Low environment + execution',
    },
    {
      title: 'The Developing Person',
      tagline: 'Multiple domains in active formation.',
      status: 'Beginning honestly',
    },
  ];

  const proofStats = [
    { target: 24, label: 'Questions' },
    { target: 6, label: 'Life domains' },
    { target: 90, label: 'Day cycles' },
    { target: 0, prefix: '$', label: 'To begin' },
  ];

  const earlyUserQuotes = [
    {
      quote:
        'I had been productive for years and still felt something was missing. The diagnostic named it in 12 minutes…',
      name: 'Marcus T.',
      meta: 'Product lead, 34',
    },
    {
      quote:
        'The weekly review alone changed how I end every week. Five questions, ten minutes, and I know where I stand…',
      name: 'Claire D.',
      meta: 'Founder, 29',
    },
    {
      quote:
        'I retook the diagnostic at 90 days. Score moved from 58 to 74. Not because I worked harder — because for the first time I was working on the right things…',
      name: 'James O.',
      meta: 'Engineer, 41',
    },
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
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col overflow-x-hidden">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="main-content" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* First fold — 3D “card” on Apple grey (floating white panel + soft shadow) */}
        <section className="w-full bg-apple-surface-muted px-3 pt-4 pb-6 sm:px-5 sm:pt-5 sm:pb-8 md:px-8 md:pb-10 lg:px-10">
          <div
            className="relative mx-auto flex max-w-[min(100%,1400px)] min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.25rem] border border-alignment-accent/[0.07] bg-alignment-surface shadow-[0_32px_64px_-12px_rgba(44,46,38,0.14),0_12px_24px_-8px_rgba(44,46,38,0.08),0_0_0_1px_rgba(44,46,38,0.05)]"
          >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 75% 55% at 50% 36%, #ffffff 0%, #f7f5f0 45%, #e7e4dc 100%)',
            }}
          />
          <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 pt-12 pb-8 sm:pt-16 sm:pb-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[11px] sm:text-xs font-normal uppercase tracking-[0.28em] text-alignment-accent/50 mb-8 sm:mb-10">
                Human alignment software
              </p>
              <h1 className="font-display text-[2.75rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-medium text-alignment-accent leading-[1.12] tracking-tight text-balance">
                A system for becoming{' '}
                <span className="text-alignment-accent/70 italic font-normal">whole.</span>
              </h1>
              <p className="mt-10 sm:mt-12 text-sm sm:text-base text-alignment-accent/70 leading-relaxed max-w-xl mx-auto font-sans">
                Most people are productive. Few are coherent. Alignment OS measures the six domains that determine whether a life holds together — and builds the structure to close the gap.
              </p>
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/assessment"
                  className={`inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-xs sm:text-sm font-medium uppercase tracking-[0.12em] px-8 sm:px-10 py-4 transition-colors duration-200 hover:bg-alignment-primary/90 focus-visible:ring-offset-alignment-foundation ${focusRingBtn}`}
                >
                  Begin free diagnostic <span aria-hidden className="ml-2">→</span>
                </Link>
                <Link
                  to="/about"
                  className={`inline-flex items-center justify-center rounded-sm bg-alignment-surface text-alignment-accent text-xs sm:text-sm font-medium uppercase tracking-[0.12em] px-8 sm:px-10 py-4 border border-alignment-accent/15 transition-colors duration-200 hover:bg-alignment-accent/[0.03] ${focusRingBtn}`}
                >
                  Why this exists
                </Link>
              </div>
              <p className="mt-6 text-[11px] sm:text-xs text-alignment-accent/45 tracking-wide">
                12 minutes · Free forever · No card required
              </p>
              <p className="mt-10 text-sm text-alignment-accent/50">
                Already have an account?{' '}
                <Link to="/login" className="text-alignment-accent underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div
            className="relative w-full rounded-b-[1.25rem] sm:rounded-b-[1.75rem] md:rounded-b-[2rem] bg-alignment-primary text-white overflow-hidden"
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
          </div>
        </section>

        {/* Second section — quote */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
            <blockquote className="font-display text-[1.35rem] sm:text-2xl md:text-[1.75rem] font-normal text-alignment-accent leading-[1.45] tracking-tight text-balance">
              <p>You are not failing for lack of effort.</p>
              <p className="mt-6 sm:mt-8">
                You are failing for lack of{' '}
                <em className="italic text-alignment-accent/70">structure beneath</em>{' '}
                the effort.
              </p>
              <p className="mt-6 sm:mt-8 text-alignment-accent/70">
                Alignment OS builds that structure.
              </p>
            </blockquote>
          </div>
        </section>

        {/* The compounding loop — four steps */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
              The compounding loop
            </p>
            <h2 className="mt-4 sm:mt-6 font-display text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-xl text-balance">
              Four steps.
              <br />
              <span className="italic font-normal text-alignment-accent/80">One system that holds.</span>
            </h2>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-alignment-accent/70 leading-relaxed max-w-2xl font-sans">
              Each step builds on the last. The diagnostic names the gap. The anchors root the identity. The habits close the gap. The reviews compound the gains.
            </p>

            <div className="mt-14 sm:mt-16 lg:mt-20">
              {/** Mobile: stacked + down chevrons */}
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
                      <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed">{step.body}</p>
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
                      <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed">{step.body}</p>
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

            <div className="mt-12 sm:mt-14 lg:mt-16 max-w-xl">
              <Link
                to="/assessment"
                className={`inline-block rounded-sm text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-alignment-accent border-b border-alignment-accent/25 pb-1 transition-colors duration-200 hover:border-alignment-accent focus-visible:border-alignment-accent ${focusRingBtn}`}
              >
                Start with the diagnostic — free forever <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Six domains — 2×3 grid */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
              Six domains
            </p>
            <h2 className="mt-4 sm:mt-6 font-display text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-3xl text-balance">
              Every domain that determines whether a life{' '}
              <span className="italic font-normal text-alignment-accent/80">coheres.</span>
            </h2>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-alignment-accent/70 leading-relaxed max-w-2xl font-sans">
              Neglect any one — the others cannot hold. Alignment OS measures all six, names the gap, and installs the habits to close it.
            </p>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-px border border-alignment-primary/15 bg-alignment-primary/15 sm:grid-cols-2 lg:grid-cols-3">
              {sixDomains.map((domain) => (
                <div
                  key={domain.title}
                  className="bg-alignment-surface p-6 sm:p-8 text-left transition-colors duration-200 motion-reduce:transition-none hover:bg-alignment-accent/[0.02] sm:min-h-[11rem]"
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${domain.dot}`} aria-hidden />
                  <h3 className="mt-4 text-base font-semibold text-alignment-accent tracking-tight">{domain.title}</h3>
                  <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed">{domain.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alignment Types — diagnostic profiles */}
        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surface">
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
              Alignment types
            </p>
            <h2 className="mt-4 sm:mt-6 font-display text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-3xl text-balance">
              Which one are{' '}
              <span className="italic font-normal text-alignment-accent/80">you?</span>
            </h2>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-alignment-accent/70 leading-relaxed max-w-2xl font-sans">
              The diagnostic assigns one of six structural profiles. Each comes with its own habits, formation path, and 90-day projection.
            </p>

            <div className="mt-12 sm:mt-16 border-y border-alignment-accent/[0.12] divide-y divide-alignment-accent/[0.12]">
              {alignmentTypes.map((row) => (
                <div
                  key={row.title}
                  className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10 py-6 sm:py-7 sm:px-4 sm:-mx-4 sm:rounded-lg transition-colors duration-200 motion-reduce:transition-none hover:bg-alignment-accent/[0.02]"
                >
                  <div className="min-w-0 max-w-2xl">
                    <p className="font-display text-lg sm:text-xl font-semibold text-alignment-accent tracking-tight">{row.title}</p>
                    <p className="mt-1.5 font-display text-base sm:text-[1.05rem] italic text-alignment-accent/75 leading-snug">
                      {row.tagline}
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.18em] text-alignment-accent/45 sm:max-w-[13rem] sm:text-right leading-relaxed">
                    {row.status}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12">
              <Link
                to="/assessment"
                className={`inline-flex items-center gap-2 rounded-sm bg-alignment-primary text-white px-6 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-alignment-primary/90 ${focusRingBtn}`}
              >
                Find your type — free
                <span className="translate-y-px" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Proof stats + early users */}
        <section className="w-full border-t border-alignment-accent/[0.06]" aria-labelledby="early-users-heading">
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

          <div className="w-full bg-apple-surface-muted">
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
              <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">
                Early users
              </p>
              <h2
                id="early-users-heading"
                className="mt-4 sm:mt-6 font-display text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight max-w-3xl text-balance"
              >
                What changes when the structure{' '}
                <span className="italic font-normal text-alignment-accent/80">holds.</span>
              </h2>

              <div className="mt-12 sm:mt-14 grid gap-5 sm:gap-6 md:grid-cols-3">
                {earlyUserQuotes.map((t) => (
                  <figure
                    key={t.name}
                    className="flex flex-col bg-alignment-surface border border-alignment-accent/[0.08] rounded-xl p-6 sm:p-8 text-left shadow-sm transition-shadow duration-300 ease-out motion-reduce:transition-none hover:shadow-md hover:border-alignment-accent/12"
                  >
                    <blockquote className="font-display text-base sm:text-[1.05rem] italic text-alignment-accent/85 leading-relaxed flex-1">
                      <p>&ldquo;{t.quote}&rdquo;</p>
                    </blockquote>
                    <figcaption className="mt-8 pt-6 border-t border-alignment-accent/[0.08]">
                      <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-alignment-accent/55">
                        {t.name}
                      </p>
                      <p className="mt-1.5 text-xs text-alignment-accent/45">{t.meta}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA — closing */}
        <FinalCtaClosing />

        {/* Footer — white bar */}
        <footer className="w-full border-t border-alignment-accent/[0.08] bg-alignment-surface pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-xs">
                <BrandLogo iconHeightPx={44} />
                <p className="mt-4 text-xs text-alignment-accent/45 leading-relaxed">
                  Human alignment software — measure six domains, close the gap, compound the gains.
                </p>
              </div>
              <SiteMarketingFooterNav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3 text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.14em] lg:flex-1" />
            </div>
          </div>
        </footer>
        <AgentFloatingButton />
      </main>
    </div>
  );
}
