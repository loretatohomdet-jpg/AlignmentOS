import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2';

export default function AboutPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'About — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col overflow-x-hidden">
      <a href="#about-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="about-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <article className="w-full border-t border-alignment-accent/[0.06] bg-apple-surface-muted">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24 lg:py-28 text-center">
            <p className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Why this exists</p>
            <h1 className="mt-6 font-display text-[2.25rem] sm:text-[2.75rem] md:text-[3rem] font-medium text-alignment-accent leading-[1.12] tracking-tight text-balance">
              Built for a world{' '}
              <span className="italic font-normal text-alignment-accent/80">that fragments.</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base font-medium text-alignment-accent/70 tracking-wide">
              A mission. A framework. A platform.
            </p>
          </div>
        </article>

        <div className="w-full bg-alignment-surface border-t border-alignment-accent/[0.06]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-16 lg:py-20 space-y-10 sm:space-y-12">
            <div className="space-y-6">
              <p className="text-sm sm:text-base text-alignment-accent font-medium">This work began with a simple question.</p>
              <p className="font-display text-lg sm:text-xl text-alignment-accent leading-snug">
                Why do so many people feel busy and productive, yet quietly disconnected from meaning?
              </p>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-alignment-accent/75 leading-relaxed font-sans">
              <p>
                The answer, it turned out, was not a lack of effort. It was not a lack of tools. Most people already have
                more structure than they can use.
              </p>
              <p>The problem was something earlier. Something structural.</p>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-alignment-accent/75 leading-relaxed font-sans">
              <p>
                Modern life pulls people in many directions at once — work, family, digital noise, endless urgency. When
                those forces pull against each other, even good tools stop working. A planner can organise time. It cannot
                heal fragmentation.
              </p>
              <p className="text-alignment-accent font-medium">The real question is not how to do more.</p>
            </div>

            <div className="border-l-2 border-alignment-accent/15 pl-6 sm:pl-8 py-2">
              <p className="font-display text-xl sm:text-2xl text-alignment-accent leading-snug">
                What happens
                <br />
                <span className="italic font-normal text-alignment-accent/80">before productivity?</span>
              </p>
              <p className="mt-6 text-sm sm:text-base text-alignment-accent font-semibold font-sans">The answer is alignment.</p>
            </div>

            <div className="text-sm sm:text-base text-alignment-accent/75 leading-relaxed font-sans space-y-6">
              <p>
                When identity, purpose, mindset, habits, environment, and execution are moving in different directions,
                life becomes exhausting regardless of how hard a person works. But when those six domains begin to move
                together — something shifts. Structure becomes powerful. Action flows from identity. A person stops reacting
                and starts living from what is essential.
              </p>
            </div>

            <div className="pt-8 border-t border-alignment-accent/[0.08]">
              <h2 className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50">Founder</h2>
              <div className="mt-8 text-sm sm:text-base text-alignment-accent/75 leading-relaxed font-sans xl:columns-2 xl:gap-x-12 [&_p]:mb-6 xl:[&_p]:break-inside-avoid">
                <p>
                  That insight was not theoretical. I discovered it by building a planner — the Life of Purpose Planner —
                  and watching what happened when it met the world.
                </p>
                <p>
                  People appreciated the idea. Many struggled to use it. Not because they lacked discipline. Because the
                  deeper structure wasn&apos;t yet in place. The visible tool was ready. The interior foundation was not.
                </p>
                <p>
                  That gap became my focus. Not how to build better tools — but what needs to be true in a person&apos;s
                  life before any tool can compound.
                </p>
                <p className="font-display text-lg sm:text-xl text-alignment-accent leading-snug">
                  How do we build meaningful, coherent lives in a fragmented world?
                </p>
                <p>
                  That is the question at the centre of everything I build. Through frameworks, diagnostics, and formation
                  systems, I explore how alignment, rhythm, and interior orientation shape the architecture of a life.
                </p>
                <p>
                  Not productivity. Not optimisation. A person fully themselves — interior and exterior unified, working
                  from clarity rather than pressure.
                </p>
                <p>
                  And at the personal centre of this work remains Christ — the interior compass that allows work, faith,
                  and daily rhythm to move in the same direction rather than against each other.
                </p>
                <p>
                  What began as a simple planner became something larger. Alignment OS is the structure made available — a
                  diagnostic and formation system for anyone ready to stop reacting and begin building from the inside out.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform CTA — Apple grey band (same system as landing) */}
        <section
          className="w-full border-t border-alignment-accent/[0.12] bg-apple-surface-muted"
          aria-labelledby="about-platform-cta-heading"
        >
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-16 lg:py-20 text-left">
            <p
              id="about-platform-cta-heading"
              className="text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/50"
            >
              The platform
            </p>
            <p className="mt-8 font-display text-base sm:text-lg text-alignment-accent/85 leading-relaxed">
              Six domains. One diagnostic. A habit engine that compounds over 90-day cycles. Built not as a productivity
              tool but as a system for the whole person — the structure that makes every other tool work.
            </p>
            <p className="mt-8 text-sm sm:text-base text-alignment-accent/70 leading-relaxed font-sans">
              For those ready to pursue the deeper question,{' '}
              <Link
                to="/start"
                className="text-alignment-accent underline decoration-alignment-accent/30 underline-offset-4 transition-colors hover:decoration-alignment-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-apple-surface-muted rounded-sm"
              >
                Becoming
              </Link>{' '}
              carries the thread further.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl">
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center rounded-none bg-alignment-primary text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] px-6 py-4 transition-colors duration-200 hover:bg-alignment-primary/90 sm:min-h-[3.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-apple-surface-muted"
              >
                Begin the diagnostic <span aria-hidden className="ml-2">→</span>
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-none border border-alignment-accent/20 bg-transparent text-alignment-accent/80 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] px-6 py-4 transition-colors duration-200 hover:border-alignment-accent/35 hover:bg-alignment-accent/[0.03] sm:min-h-[3.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-apple-surface-muted"
              >
                The platform
              </Link>
              <Link
                to="/ethics"
                className="inline-flex items-center justify-center rounded-none border border-alignment-accent/20 bg-transparent text-alignment-accent/80 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] px-6 py-4 transition-colors duration-200 hover:border-alignment-accent/35 hover:bg-alignment-accent/[0.03] sm:col-span-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-apple-surface-muted"
              >
                What is wholeness?
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
