import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2';

const sectionClass = 'max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10';

export default function InstitutionPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Institutions — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col">
      <a href="#institution-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="institution-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero */}
        <section className={`${sectionClass} pt-12 sm:pt-16 pb-16 sm:pb-20`}>
          <p className="text-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/45">
            Institutions · Mission groups · Formation programmes
          </p>
          <h1 className="mt-8 sm:mt-10 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.15] tracking-tight text-center text-balance">
            <span className="italic font-normal text-alignment-accent/90">Formation</span> that holds{' '}
            <span className="italic font-normal text-alignment-accent/90">after the programme ends.</span>
          </h1>
          <p className="mt-8 text-base sm:text-lg text-alignment-accent/70 leading-relaxed text-center max-w-2xl mx-auto font-sans">
            Most formation programmes inspire people deeply. Few give them the structure to sustain what was awakened.
            Alignment OS is the continuation layer — the daily architecture that allows formation to compound.
          </p>
          <blockquote className="mt-12 sm:mt-14 pl-5 sm:pl-6 border-l-[3px] border-alignment-accent/20 max-w-2xl mx-auto">
            <p className="font-display text-lg sm:text-xl md:text-[1.35rem] text-alignment-accent/90 italic leading-snug">
              Formation awakens a calling. Alignment builds the life required to live it.
            </p>
          </blockquote>
          <div className="mt-12 space-y-6 text-sm sm:text-base text-alignment-accent/70 leading-relaxed font-sans max-w-2xl mx-auto">
            <p>
              Every formation programme has an ending. What follows is a transition — and in that transition, most people
              struggle. Not because the formation failed. But because inspiration fades when structure does not follow. The
              interior depth built during the programme has no daily architecture to live from.
            </p>
            <p>
              Alignment OS addresses that gap directly. It does not replace formation. It provides the structure that allows
              formation to hold — the daily habits, quarterly rhythms, and interior clarity that keep a formed person coherent
              over time.
            </p>
          </div>
        </section>

        {/* Process strip */}
        <section className="border-t border-alignment-accent/[0.08] bg-apple-surface-muted py-12 sm:py-16">
          <div className={`${sectionClass} flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-2`}>
            <div className="flex-1 rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-4 py-5 text-center shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/45">Your programme</p>
              <p className="mt-2 font-display text-lg sm:text-xl text-alignment-accent">Awakens calling</p>
            </div>
            <span className="hidden sm:inline text-alignment-accent/25 text-xl shrink-0" aria-hidden>
              →
            </span>
            <div className="flex-1 rounded-xl border-2 border-alignment-accent/20 bg-alignment-surface px-4 py-5 text-center shadow-apple">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/55">Alignment OS</p>
              <p className="mt-2 font-display text-lg sm:text-xl text-alignment-accent">Builds the life</p>
            </div>
            <span className="hidden sm:inline text-alignment-accent/25 text-xl shrink-0" aria-hidden>
              →
            </span>
            <div className="flex-1 rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-4 py-5 text-center shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/45">Your community</p>
              <p className="mt-2 font-display text-lg sm:text-xl text-alignment-accent">Mission sustained</p>
            </div>
          </div>
        </section>

        {/* Who this is built for */}
        <section className={`${sectionClass} py-16 sm:py-20`}>
          <h2 className="font-display text-2xl sm:text-3xl md:text-[2rem] font-medium text-alignment-accent text-center tracking-tight">
            Who this is built for
          </h2>
          <p className="mt-4 text-base text-alignment-accent/60 text-center max-w-2xl mx-auto leading-relaxed">
            Alignment OS was designed for communities that form people seriously — and want to support what comes after.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 gap-5 sm:gap-6">
            {[
              {
                title: 'Missionary organisations',
                body:
                  'Missionaries return from intense formation and service seasons to ordinary life. Alignment OS helps them rebuild identity, direction, and daily structure without losing their sense of mission.',
              },
              {
                title: 'Leadership training programmes',
                body:
                  'Leadership graduates leave with vision but often lack the personal architecture to execute from it consistently. The platform provides the structure that makes leadership formation last.',
              },
              {
                title: 'Catholic universities',
                body:
                  'Students finishing formation programmes — theological, philosophical, or vocational — need a bridge from formation to life. Alignment OS is that bridge, especially in the senior year and post-graduation transition.',
              },
              {
                title: 'Professional networks',
                body:
                  'Mission-driven professionals need tools that integrate faith, career, and daily life without fragmenting them. A shared diagnostic language and habit architecture creates a common formation vocabulary across a network.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-alignment-accent/[0.08] bg-apple-surface-muted px-6 py-6 sm:px-7 sm:py-7"
              >
                <h3 className="font-semibold text-alignment-accent text-base">{title}</h3>
                <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The full offering */}
        <section className={`${sectionClass} py-16 sm:py-20 border-t border-alignment-accent/[0.08]`}>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-alignment-accent text-center">The full offering</h2>
          <p className="mt-4 text-base text-alignment-accent/60 text-center max-w-2xl mx-auto leading-relaxed">
            Every member in an institutional partnership receives the complete Alignment OS system. There are no partial access
            tiers — the value of the platform is its integration.
          </p>
          <ul className="mt-14 space-y-0">
            {[
              {
                n: '01',
                h: 'Alignment Diagnostic',
                p:
                  '24 questions across six domains — Identity, Purpose, Mindset, Habits, Environment, Execution. Every member receives a score out of 100, an Alignment Type, and a named Primary Strain: the domain where habit installation begins. This becomes the shared formation language of the group.',
              },
              {
                n: '02',
                h: 'Habit Engine',
                p:
                  "Three habits prescribed from the member's Primary Strain domain — specific, sequenced, and designed to compound. Not generic habit tracking. A targeted prescription matched to the diagnostic result, recalibrated every 90 days as scores change.",
              },
              {
                n: '03',
                h: 'Weekly Review',
                p:
                  'A ten-minute structured reflection each week: which habits held, which drifted and why, what moved the member toward coherence, and the intention for the week ahead. The weekly rhythm is what sustains formation between the big moments.',
              },
              {
                n: '04',
                h: 'Quarterly Reset',
                p:
                  'Every 90 days, the full diagnostic reruns. Scores are recalculated, habits recalibrated to the new gap, and the formation cycle restarts with updated clarity. Members see their score change over time — formation measured and visible.',
              },
              {
                n: '05',
                h: 'Alignment Map',
                p:
                  'Full score history across all quarters. Members see their formation trajectory — how Identity, Purpose, Habits, and Execution have changed — as a visual map of interior growth. A record of becoming, not just performance.',
              },
              {
                n: '06',
                h: 'Alignment Cohorts',
                p:
                  'Institutional partners can run Alignment Cohorts — 12-week guided experiences where members move through the framework together. Cohorts create accountability, shared reflection, and community around the formation process.',
                cohortLink: true,
              },
            ].map(({ n, h, p, cohortLink }, i) => (
              <li
                key={n}
                id={n === '06' ? 'cohorts' : undefined}
                className={`grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-10 ${i > 0 ? 'border-t border-alignment-accent/10' : ''}`}
              >
                <span className="font-display text-4xl sm:text-5xl text-alignment-accent/15 tabular-nums leading-none pt-1">{n}</span>
                <div>
                  <h3 className="font-semibold text-alignment-accent text-lg">{h}</h3>
                  <p className="mt-3 text-sm sm:text-base text-alignment-accent/65 leading-relaxed">
                    {p}
                    {cohortLink && (
                      <>
                        {' '}
                        <Link
                          to="/pricing#journey-tier"
                          className="font-medium text-alignment-accent underline underline-offset-2 hover:text-alignment-accent/80"
                        >
                          Learn about cohorts →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* What formation leaders see */}
        <section className={`${sectionClass} py-16 sm:py-20 border-t border-alignment-accent/[0.08] bg-apple-surface-muted`}>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-alignment-accent text-center">
            What formation leaders see
          </h2>
          <p className="mt-4 text-base text-alignment-accent/60 text-center max-w-2xl mx-auto">
            Institutional access includes a leader view — aggregate insight across your community without exposing individual
            member data.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.93l6-3.75z" />
                  </svg>
                ),
                title: 'Community alignment overview',
                body:
                  'Average scores across all six domains for your cohort or community. See where formation is holding and where structure is most needed.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                    <path strokeLinecap="round" strokeWidth={1.5} d="M12 7v5l3 2" />
                  </svg>
                ),
                title: 'Engagement rhythm',
                body:
                  'Weekly review completion rates and quarterly reset participation — the leading indicators of whether formation is compounding or fading.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                ),
                title: 'Quarterly progress',
                body:
                  'Score movement across quarters for your entire community. Formation made visible — not as surveillance but as a shared measure of growth.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface px-5 py-6 shadow-sm">
                <div className="text-alignment-accent">{icon}</div>
                <h4 className="mt-4 font-semibold text-alignment-accent text-sm sm:text-base">{title}</h4>
                <p className="mt-2 text-sm text-alignment-accent/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Onboarding */}
        <section className={`${sectionClass} py-16 sm:py-20 border-t border-alignment-accent/[0.08]`}>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-alignment-accent text-center">How onboarding works</h2>
          <p className="mt-4 text-base text-alignment-accent/60 text-center max-w-2xl mx-auto">
            We work directly with your organisation to ensure the platform integrates naturally into your existing formation
            structure — without adding administrative burden.
          </p>
          <div className="mt-12 max-w-2xl mx-auto relative pl-8 sm:pl-10 border-l border-alignment-accent/15">
            {[
              {
                n: '1',
                h: 'Discovery conversation',
                p:
                  'We begin with a direct conversation with your formation leadership. We want to understand your programme, the community it serves, and the transition moment where structure is most needed. Pricing and structure are discussed here — not online.',
                bullets: [
                  'One conversation with your leadership team',
                  'No pitch deck — a real discussion about your community',
                  'Pricing and scope proposed based on your context',
                ],
              },
              {
                n: '2',
                h: 'Platform walkthrough',
                p:
                  'We walk your team through the full platform — diagnostic, dashboard, habit engine, weekly review, and cohort structure — so leaders understand exactly what members will experience before it is offered.',
                bullets: [
                  'Live walkthrough with your leadership team',
                  'Full access to try the diagnostic and dashboard',
                  'Questions answered directly — no documentation maze',
                ],
              },
              {
                n: '3',
                h: 'Member launch',
                p:
                  'We provide everything needed to introduce the platform to your members — a launch brief, a simple onboarding sequence, and guidance on how to frame the diagnostic within your existing formation language.',
                bullets: [
                  "Launch brief tailored to your community's language",
                  'Member onboarding sequence — how to begin, what to expect',
                  'Suggested integration points with your existing programme calendar',
                ],
              },
            ].map((step) => (
              <div key={step.n} className="relative pb-12 last:pb-0">
                <span className="absolute -left-8 sm:-left-10 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-alignment-accent/25 bg-alignment-surface text-sm font-semibold text-alignment-accent">
                  {step.n}
                </span>
                <h3 className="font-semibold text-alignment-accent text-lg">{step.h}</h3>
                <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed">{step.p}</p>
                <ul className="mt-4 space-y-2 text-sm text-alignment-accent/70">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-alignment-accent/40 shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto relative pl-8 sm:pl-10 border-l border-alignment-accent/15">
            {[
              {
                n: '4',
                h: 'First cohort (if included)',
                p:
                  'If your partnership includes an Alignment Cohort, we support the launch of the first 12-week cycle — including the cohort framing, week-by-week path, and the shared reflection structure. Leaders facilitate; the platform provides the structure.',
                bullets: [
                  'Cohort launch guide for your facilitator',
                  'Week-by-week facilitation notes',
                  'Member progress shared with cohort leader each week',
                ],
              },
              {
                n: '5',
                h: 'Ongoing support',
                p:
                  'We remain available. Quarterly check-ins with your formation leadership to review community progress, address any questions, and plan the next formation cycle.',
                bullets: [
                  'Quarterly review with your leadership team',
                  'Access to us directly — not a support ticket system',
                  'Platform updates included across the partnership',
                ],
              },
            ].map((step) => (
              <div key={step.n} className="relative pb-12 last:pb-0">
                <span className="absolute -left-8 sm:-left-10 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-alignment-accent/25 bg-alignment-surface text-sm font-semibold text-alignment-accent">
                  {step.n}
                </span>
                <h3 className="font-semibold text-alignment-accent text-lg">{step.h}</h3>
                <p className="mt-3 text-sm text-alignment-accent/65 leading-relaxed">{step.p}</p>
                <ul className="mt-4 space-y-2 text-sm text-alignment-accent/70">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-alignment-accent/40 shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-apple-surface-muted border border-alignment-accent/[0.08] px-6 sm:px-8 py-8 sm:py-10 max-w-2xl mx-auto">
            <h3 className="font-display text-xl sm:text-2xl font-medium text-alignment-accent">A partnership, not a subscription</h3>
            <p className="mt-4 text-sm sm:text-base text-alignment-accent/65 leading-relaxed">
              Institutional access to Alignment OS is structured as a partnership — an annual agreement built around your
              community&apos;s formation model. Pricing is discussed directly, based on community size, cohort structure, and
              the depth of support your programme requires. It is not a per-seat software product.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full bg-alignment-primary text-white py-16 sm:py-24 px-6 sm:px-8" aria-labelledby="institution-cta-heading">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="institution-cta-heading"
              className="font-display text-2xl sm:text-3xl md:text-[2rem] font-medium text-white leading-tight"
            >
              Bring this to your community
            </h2>
            <p className="mt-5 text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
              We work directly with formation leaders to structure the right access model. The conversation begins with a
              single email.
            </p>

            <div className="mt-10 max-w-md mx-auto text-left">
              <label htmlFor="institution-contact-display" className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Contact email
              </label>
              <a
                id="institution-contact-display"
                href="mailto:organizations@alignmentos.com"
                className="mt-2 flex w-full items-center justify-center rounded-lg border border-white/30 bg-alignment-surface/[0.07] px-4 py-3.5 text-center font-display text-base sm:text-lg text-white/95 italic underline underline-offset-[6px] decoration-white/50 hover:bg-alignment-surface/10 hover:decoration-white transition-colors"
              >
                organizations@alignmentos.com
              </a>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
              <a
                href="mailto:organizations@alignmentos.com?subject=Institutional%20partnership"
                className="inline-flex min-h-[48px] flex-1 sm:flex-none items-center justify-center rounded-sm bg-alignment-surface px-6 py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-alignment-accent hover:bg-alignment-surface/90 transition-colors sm:min-w-[220px]"
              >
                Begin the conversation →
              </a>
              <Link
                to="/pricing#journey-tier"
                className="inline-flex min-h-[48px] flex-1 sm:flex-none items-center justify-center rounded-sm border border-white/45 bg-transparent px-6 py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-alignment-surface/10 transition-colors sm:min-w-[200px]"
              >
                The cohort model
              </Link>
              <Link
                to="/assessment"
                className="inline-flex min-h-[48px] flex-1 sm:flex-none items-center justify-center rounded-sm border border-white/45 bg-transparent px-6 py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-alignment-surface/10 transition-colors sm:min-w-[200px]"
              >
                Try the diagnostic free
              </Link>
            </div>
          </div>
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
