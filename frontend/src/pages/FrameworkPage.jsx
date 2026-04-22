import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import DomainPillarIcon from '../components/DomainPillarIcon';
import { SiteSecondaryFooterNav } from '../components/SiteFooterNav';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2';

const labelClass =
  'text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.24em] text-alignment-accent/45';

const sectionClass = 'max-w-3xl lg:max-w-4xl mx-auto px-6 sm:px-8 lg:px-10';

const mutedSurface = 'bg-apple-surface-muted';

/** Clockwise from top: Identity → Purpose → Execution → Habits → Environment → Mindset */
const HEX_DOMAINS = [
  { key: 'Identity', sub: 'Who you are', angle: -90 },
  { key: 'Purpose', sub: 'What you are for', angle: -30 },
  { key: 'Execution', sub: 'How you follow through', angle: 30 },
  { key: 'Habits', sub: 'What you do daily', angle: 90 },
  { key: 'Environment', sub: 'What surrounds you', angle: 150 },
  { key: 'Mindset', sub: 'How you think', angle: 210 },
];

const CARD_DOMAINS = [
  {
    pillar: 'IDENTITY',
    iconClass: 'text-alignment-primary',
    title: 'Identity',
    body: 'Who you are — values, moral framework, the person you are becoming.',
  },
  {
    pillar: 'PURPOSE',
    iconClass: 'text-alignment-primary/70',
    title: 'Purpose',
    body: 'What you are for — mission clarity, direction, vocation this season.',
  },
  {
    pillar: 'MINDSET',
    iconClass: 'text-alignment-primary/50',
    title: 'Mindset',
    body: 'How you think — beliefs shaping perception, confidence, decisions.',
  },
  {
    pillar: 'HABITS',
    iconClass: 'text-alignment-primary/35',
    title: 'Habits',
    body: 'What you do daily — practices reinforcing identity and purpose.',
  },
  {
    pillar: 'ENVIRONMENT',
    iconClass: 'text-alignment-primary/25',
    title: 'Environment',
    body: 'What surrounds you — relationships, inputs, spaces shaping behaviour.',
  },
  {
    pillar: 'EXECUTION',
    iconClass: 'text-alignment-primary/15',
    title: 'Execution',
    body: 'How you follow through — discipline, planning, completing what matters.',
  },
];

const FORMATION_AXIS = [
  { strong: 'Identity', rest: ' → grounds Purpose. Who you are determines what you are for.' },
  { strong: 'Purpose', rest: ' → orients Execution. Direction determines where effort goes.' },
  { strong: 'Execution', rest: ' → reinforces Habits. Follow-through becomes your daily structure.' },
  { strong: 'Habits', rest: ' → deepen Identity. What you do daily shapes who you become.' },
  { strong: 'Mindset', rest: ' → influences every domain. Belief shapes perception, which shapes action.' },
  { strong: 'Environment', rest: ' → influences every domain. What surrounds you shapes what is possible.' },
];

function FrameworkHexDiagram() {
  const cx = 210;
  const cy = 210;
  const rHex = 118;
  const rNode = 132;
  const rLine = 108;

  const rad = (deg) => (deg * Math.PI) / 180;
  const pt = (deg, radius) => ({
    x: cx + radius * Math.cos(rad(deg)),
    y: cy + radius * Math.sin(rad(deg)),
  });

  const hexPoints = HEX_DOMAINS.map((_, i) => {
    const p = pt(-90 + i * 60, rHex);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 420 420"
        className="w-full h-auto text-alignment-accent"
        role="img"
        aria-label="Six domains arranged around Alignment OS: Identity, Purpose, Execution, Habits, Environment, Mindset, connected in a cycle with lines to the centre."
      >
        <defs>
          <marker id="framework-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 z" className="fill-alignment-accent/35" />
          </marker>
        </defs>

        <polygon
          points={hexPoints}
          className="fill-alignment-accent/[0.04] stroke-alignment-accent/[0.12]"
          strokeWidth="1"
        />

        {HEX_DOMAINS.map((d, i) => {
          const p = pt(d.angle, rLine);
          return (
            <line
              key={`spoke-${d.key}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              className="stroke-alignment-accent/15"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}

        {HEX_DOMAINS.map((_, i) => {
          const a = -90 + i * 60;
          const b = -90 + ((i + 1) % 6) * 60;
          const p1 = pt(a, rNode - 18);
          const p2 = pt(b, rNode - 18);
          return (
            <line
              key={`arc-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className="stroke-alignment-accent/30"
              strokeWidth="1.25"
              markerEnd="url(#framework-arrow)"
            />
          );
        })}

        <circle cx={cx} cy={cy} r="52" className="fill-white stroke-alignment-accent/[0.12]" strokeWidth="1" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-alignment-accent font-display text-[15px] italic"
          style={{ fontFamily: 'Georgia, ui-serif, serif' }}
        >
          Alignment
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          className="fill-alignment-accent font-sans text-[13px] font-semibold tracking-wide"
        >
          OS
        </text>

        {HEX_DOMAINS.map((d) => {
          const outer = pt(d.angle, rNode);
          return (
            <g key={d.key}>
              <circle cx={outer.x} cy={outer.y} r="16" className="fill-white stroke-alignment-accent/20" strokeWidth="1" />
              <circle cx={outer.x} cy={outer.y} r="5" className="fill-alignment-accent/45" />
            </g>
          );
        })}

        {HEX_DOMAINS.map((d) => {
          const labelPos = pt(d.angle, rNode + 52);
          return (
            <foreignObject key={`fo-${d.key}`} x={labelPos.x - 58} y={labelPos.y - 28} width="116" height="56">
              <div className="text-center leading-tight">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-alignment-accent">{d.key}</p>
                <p className="mt-0.5 text-[8px] text-alignment-accent/55">{d.sub}</p>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

export default function FrameworkPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Framework — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className={`min-h-screen w-full ${mutedSurface} flex flex-col`}>
      <a href="#framework-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="framework-main" className="flex-1 w-full scroll-mt-16" tabIndex={-1}>
        <section className={`${sectionClass} pt-12 sm:pt-16 pb-12 sm:pb-16 text-center`}>
          <p className={labelClass}>The framework</p>
          <h1 className="mt-6 font-display text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] font-medium text-alignment-accent leading-[1.12] tracking-tight text-balance max-w-2xl mx-auto">
            The Human Alignment{' '}
            <span className="italic font-normal text-alignment-accent/80">Framework.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-alignment-accent/65 leading-relaxed max-w-xl mx-auto font-sans">
            Six domains. Every one matters. Neglect any one — the others cannot hold.
          </p>
        </section>

        <section className={`border-t border-alignment-accent/[0.08] bg-alignment-surface ${sectionClass} py-12 sm:py-16`}>
          <FrameworkHexDiagram />
        </section>

        <section className={`border-t border-alignment-accent/[0.08] bg-alignment-surface ${sectionClass} py-14 sm:py-18 pb-16`}>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARD_DOMAINS.map(({ pillar, iconClass, title, body }) => (
              <li
                key={pillar}
                className="rounded-xl border border-alignment-accent/[0.08] bg-alignment-surface px-5 py-5 sm:px-6 sm:py-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <DomainPillarIcon pillar={pillar} className={`mt-0.5 h-6 w-6 shrink-0 ${iconClass}`} />
                  <div>
                    <h2 className="font-semibold text-alignment-accent text-base">{title}</h2>
                    <p className="mt-2 text-sm text-alignment-accent/65 leading-relaxed">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`border-t border-alignment-accent/[0.08] ${mutedSurface} ${sectionClass} py-14 sm:py-16`}>
          <p className={labelClass}>The primary formation axis</p>
          <div className="mt-8 rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface px-5 py-2 sm:px-8 sm:py-3 max-w-3xl mx-auto">
            <ul className="divide-y divide-alignment-accent/[0.08]">
              {FORMATION_AXIS.map((row) => (
                <li key={row.strong} className="py-4 sm:py-5 text-sm sm:text-base text-alignment-accent/70 leading-relaxed">
                  <span className="font-semibold text-alignment-accent">{row.strong}</span>
                  {row.rest}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`border-t border-alignment-accent/[0.08] bg-alignment-surface ${sectionClass} py-16 sm:py-20 text-center`}>
          <Link
            to="/assessment"
            className={`inline-flex min-h-[48px] items-center justify-center rounded-sm bg-alignment-primary px-8 py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-alignment-primary/90 ${focusRing}`}
          >
            Take the free diagnostic <span aria-hidden className="ml-1">→</span>
          </Link>
          <p className="mt-5 text-sm text-alignment-accent/50 max-w-md mx-auto">
            Find your score across all six domains. 12 minutes. Free.
          </p>
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
