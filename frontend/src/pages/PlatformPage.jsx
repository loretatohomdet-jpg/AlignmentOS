import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { pillGhost, pillOnOlive, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2';

const labelClass = type.kicker;

const sectionClass = 'max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10';

const mutedSurface = 'bg-alignment-page bg-fixed';

const btnPrimary = pillPrimary;
const btnSecondary = pillGhost;

const foundations = [
  {
    n: '01',
    title: 'Philosophical Anthropology',
    body: 'Aristotle, Aquinas, classical virtue ethics. What a human person is and how character forms.',
  },
  {
    n: '02',
    title: 'Behavioural Psychology',
    body: 'Habit loops, environmental triggers. The cue → behaviour → reward structure of lasting change.',
  },
  {
    n: '03',
    title: 'Cognitive Science',
    body: "Decision fatigue, cognitive load. Identity Anchors answer 'what should I do?' before you ask.",
  },
  {
    n: '04',
    title: 'Systems Thinking',
    body: 'Identity shapes habits. Habits shape execution. Execution reinforces identity. The whole exceeds its parts.',
  },
  {
    n: '05',
    title: 'Developmental Psychology',
    body: 'Adults move through seasons. The Quarterly Reset adapts to life stages rather than fixed personality.',
  },
];

const domains = [
  { pillar: 'IDENTITY', iconClass: 'text-alignment-primary', title: 'Identity', body: 'Values, moral framework, the person you are becoming.' },
  { pillar: 'PURPOSE', iconClass: 'text-alignment-primary/70', title: 'Purpose', body: 'Mission clarity, direction, vocation this season.' },
  { pillar: 'MINDSET', iconClass: 'text-alignment-primary/50', title: 'Mindset', body: 'Beliefs shaping perception, confidence, decisions.' },
  { pillar: 'HABITS', iconClass: 'text-alignment-primary/35', title: 'Habits', body: 'Practices reinforcing identity and purpose daily.' },
  { pillar: 'ENVIRONMENT', iconClass: 'text-alignment-primary/25', title: 'Environment', body: 'Relationships, inputs, spaces shaping behaviour.' },
  { pillar: 'EXECUTION', iconClass: 'text-alignment-primary/15', title: 'Execution', body: 'Discipline, planning, completing what matters.' },
];

export default function PlatformPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Platform — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className={type.page}>
      <a href="#platform-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="platform-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        {/* Hero */}
        <section className={`${sectionClass} pt-12 sm:pt-16 pb-16 sm:pb-20`}>
          <p className={labelClass}>The platform</p>
          <h1 className={`mt-6 ${type.h1} text-balance max-w-xl`}>
            Human Alignment Software.
          </h1>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            A diagnostic and formation system for the whole person. Not a habit tracker. Built on five disciplines, six
            domains, and the conviction that structure is the beginning of integration.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link to="/ethics" className={`${btnPrimary} sm:min-w-[220px]`}>
              What is wholeness? <span aria-hidden className="ml-1">→</span>
            </Link>
            <Link to="/framework" className={`${btnSecondary} sm:min-w-[200px]`}>
              The framework <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        </section>

        {/* Five foundations */}
        <section className={`border-t border-alignment-accent/[0.08] bg-alignment-surface ${sectionClass} py-16 sm:py-20`}>
          <p className={labelClass}>Five foundations</p>
          <h2 className={`mt-4 ${type.h2} max-w-xl`}>
            Built on disciplines, not trends.
          </h2>
          <p className={`mt-5 ${type.body} max-w-2xl`}>
            Most platforms rest on one discipline. This one integrates five. Users may not recognise the theory — they feel
            the coherence.
          </p>
          <ul className="mt-12">
            {foundations.map(({ n, title, body }, i) => (
              <li
                key={n}
                className={`grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-10 ${i > 0 ? 'border-t border-alignment-accent/10' : ''}`}
              >
                <span className="font-display text-4xl sm:text-5xl text-alignment-accent/15 tabular-nums leading-none pt-1">{n}</span>
                <div>
                  <h3 className="font-semibold text-alignment-accent text-lg">{title}</h3>
                  <p className={`mt-3 ${type.body}`}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Six domains */}
        <section className={`border-t border-alignment-accent/[0.08] ${mutedSurface} ${sectionClass} py-16 sm:py-20`}>
          <p className={labelClass}>Six domains</p>
          <h2 className={`mt-4 ${type.h2} max-w-xl italic`}>
            All six. Always.
          </h2>
          <p className={`mt-5 ${type.body} max-w-2xl`}>
            Every domain that determines whether a life is coherent or scattered. The system is complete only when all six
            are in motion.
          </p>
          <ul className="mt-12">
            {domains.map(({ pillar, iconClass, title, body }, i) => (
              <li
                key={pillar}
                className={`flex gap-4 sm:gap-6 py-6 sm:py-7 ${i > 0 ? 'border-t border-alignment-accent/10' : ''}`}
              >
                <DomainPillarIcon pillar={pillar} className={`mt-0.5 h-7 w-7 shrink-0 ${iconClass}`} />
                <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-x-8 sm:gap-y-0">
                  <h3 className="font-semibold text-alignment-accent">{title}</h3>
                  <p className="text-sm sm:text-base text-alignment-accent/65 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
            <Link
              to="/framework"
              className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/60 underline underline-offset-4 decoration-alignment-accent/25 hover:text-alignment-accent hover:decoration-alignment-accent/50 ${focusRing} rounded-sm`}
            >
              Full framework diagram →
            </Link>
            <Link
              to="/ethics"
              className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-alignment-accent/60 underline underline-offset-4 decoration-alignment-accent/25 hover:text-alignment-accent hover:decoration-alignment-accent/50 ${focusRing} rounded-sm`}
            >
              Why integration matters →
            </Link>
          </div>
        </section>

        {/* The goal */}
        <section className={`border-t border-alignment-accent/[0.08] bg-alignment-surface ${sectionClass} py-16 sm:py-20`}>
          <p className={labelClass}>The goal</p>
          <h2 className={`mt-4 ${type.h2} max-w-xl`}>
            Not productivity.
            <br />
            <span className="italic font-normal text-alignment-accent/90">Wholeness.</span>
          </h2>
          <p className={`mt-6 ${type.body} max-w-xl`}>
            When all six domains are present and reinforcing each other, interior and exterior unify. Action flows from
            identity. A person at home in themselves.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link to="/ethics" className={`${btnPrimary} sm:min-w-[220px]`}>
              The whole person <span aria-hidden className="ml-1">→</span>
            </Link>
            <Link to="/alignment-map" className={`${btnSecondary} sm:min-w-[200px]`}>
              Alignment map <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        </section>

        {/* Diagnostic CTA */}
        <section
          className="w-full border-t border-alignment-accent/[0.08] bg-alignment-primary text-white py-16 sm:py-24 px-6 sm:px-8"
          aria-labelledby="platform-diagnostic-heading"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="platform-diagnostic-heading"
              className="font-display text-2xl sm:text-3xl font-medium text-white leading-tight"
            >
              Begin with <span className="italic font-normal text-white/95">the diagnostic.</span>
            </h2>
            <Link to="/assessment" className={`${pillOnOlive} mt-10`}>
              Begin free <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
