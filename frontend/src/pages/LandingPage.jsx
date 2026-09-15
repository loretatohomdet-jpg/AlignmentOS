import { Link } from 'react-router-dom';
import {
  HomeFooter,
  HomeHeader,
  copper,
  focusRing,
  hairline,
  pageWidth,
  pillGhost,
  pillPrimary,
} from '../components/HomeMarketingChrome';
import { bookingUrl, formationExploreUrl } from '../config/externalLinks';

const shopUrl = formationExploreUrl();
const conversationUrl = bookingUrl || 'mailto:organizations@alignmentos.com';

const offerings = [
  {
    title: 'The Alignment Score',
    price: 'Free',
    accent: true,
    body: 'Twelve minutes. Names where you cohere, and where you strain.',
    action: 'Begin free',
    to: '/assessment',
  },
  {
    title: 'The three tools',
    price: '$27–48',
    body: 'Clarity, Reset, Daily. Digital or paper. Close the named gap.',
    action: 'See the tools',
    href: shopUrl,
  },
  {
    title: 'The digital system',
    price: '$49',
    body: 'All three tools, together. The complete practice, today.',
    action: 'See the system',
    to: '/pricing',
  },
  {
    title: 'The Charter Cohort',
    price: '$997',
    body: 'Six weeks, twelve people, led personally. The whole system, lived.',
    action: 'Learn about the cohort',
    to: '/cohort',
    id: 'cohort',
  },
];

const domains = [
  { title: 'Identity', line: 'who you are' },
  { title: 'Purpose', line: 'what you’re for' },
  { title: 'Mindset', line: 'how you think' },
  { title: 'Habits', line: 'what you repeat' },
  { title: 'Environment', line: 'what surrounds you' },
  { title: 'Execution', line: 'how you follow through' },
];

function OfferRow({ item }) {
  const inner = (
    <>
      <div className="min-w-0 sm:pr-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display italic text-[1.55rem] sm:text-[1.75rem] text-alignment-accent leading-tight group-hover:text-alignment-primary transition-colors">
            {item.title}
          </h3>
          <p className={`sm:hidden font-display italic text-lg ${item.accent ? copper : 'text-alignment-accent/45'}`}>
            {item.price}
          </p>
        </div>
        <p className="mt-2.5 text-[15px] sm:text-base text-alignment-accent/60 leading-relaxed max-w-2xl">{item.body}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-alignment-primary">
          {item.action}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
      <p className={`hidden sm:block shrink-0 font-display italic text-xl ${item.accent ? copper : 'text-alignment-accent/40'}`}>
        {item.price}
      </p>
    </>
  );

  const rowClass = `group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-2xl px-4 sm:px-5 py-7 sm:py-8 -mx-4 sm:-mx-5 scroll-mt-28 transition-colors hover:bg-alignment-surfaceSoft ${focusRing}`;

  if (item.to) {
    return (
      <Link to={item.to} id={item.id} className={rowClass}>
        {inner}
      </Link>
    );
  }
  const external = item.href && !item.href.startsWith('#');
  return (
    <a
      href={item.href}
      id={item.id}
      className={rowClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-alignment-foundation text-alignment-accent flex flex-col">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <HomeHeader />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-16 sm:pt-24 pb-20 sm:pb-28 text-center`}>
            <h1 className="font-display italic font-normal text-[2.25rem] sm:text-[3.15rem] md:text-[3.45rem] leading-[1.18] tracking-tight text-balance">
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
        </section>

        <section className="pb-10 sm:pb-14">
          <div className={pageWidth}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-alignment-primary/80">Where to begin</p>
            <p className="mt-3 text-[15px] text-alignment-accent/55 leading-relaxed">
              Start with the score. Everything after that is a choice.
            </p>
            <div className={`mt-6 border-t ${hairline} divide-y divide-alignment-accent/[0.10]`}>
              {offerings.map((item) => (
                <OfferRow key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-alignment-surfaceSoft/80">
          <div className={pageWidth}>
            <h2 className="font-display italic font-normal text-[1.75rem] sm:text-[2.35rem] md:text-[2.6rem] leading-[1.3] tracking-tight text-balance max-w-4xl">
              The diagnostic measures the repetition. The tools build it. The cohort keeps it.
            </h2>
            <p className="mt-6 text-base sm:text-[17px] text-alignment-accent/60 leading-relaxed max-w-2xl">
              One idea, at every level. That is why it holds together.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={pageWidth}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-alignment-primary/80">What it measures</p>
            <p className="mt-3 text-[15px] text-alignment-accent/55 leading-relaxed">Six domains. One picture of where you hold.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domains.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-foundationBright px-5 py-6 sm:px-6 sm:py-7"
                >
                  <h3 className="font-display italic text-[1.45rem] sm:text-[1.6rem] leading-tight">{d.title}</h3>
                  <p className="mt-1.5 text-[15px] text-alignment-accent/50">{d.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="leaders" className="scroll-mt-28 py-6 sm:py-8">
          <div className={`${pageWidth}`}>
            <div className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surfaceSoft/90 px-6 py-10 sm:px-10 sm:py-12">
              <h2 className="font-display italic text-[1.55rem] sm:text-[1.75rem] leading-tight">Alignment OS for Leaders</h2>
              <p className="mt-4 text-base text-alignment-accent/60 leading-relaxed max-w-2xl">
                Formation for teams — helping leaders become who the mission requires them to be.
              </p>
              <a
                href={conversationUrl}
                className={`mt-6 inline-flex min-h-11 items-center text-[15px] font-medium ${copper} hover:opacity-80`}
                {...(conversationUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                By conversation →
              </a>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className={pageWidth}>
            <a
              href={shopUrl}
              className={`rounded-2xl border border-alignment-accent/[0.08] bg-alignment-foundationBright px-6 py-10 sm:px-10 sm:py-12 block group hover:border-alignment-primary/25 transition-colors ${focusRing}`}
              {...(shopUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <h2 className="font-display italic text-[1.55rem] sm:text-[1.75rem] leading-tight group-hover:text-alignment-primary transition-colors">
                The original edition
              </h2>
              <p className="mt-4 text-base text-alignment-accent/60 leading-relaxed max-w-2xl">
                Alignment OS began as the Life of Purpose Planner. The last of the original, while it lasts.
              </p>
              <p className="mt-5 text-[15px] text-alignment-accent/45">$42, or boxed in leather $168.</p>
            </a>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className={pageWidth}>
            <div className="rounded-3xl bg-alignment-primary px-6 py-12 sm:px-12 sm:py-16 text-white">
              <h2 className="font-display italic font-normal text-[1.85rem] sm:text-[2.5rem] leading-[1.22] tracking-tight text-balance max-w-3xl">
                See where your life holds — in twelve minutes.
              </h2>
              <Link
                to="/assessment"
                className={`mt-8 inline-flex items-center justify-center rounded-full bg-white text-alignment-accent text-[15px] font-medium px-8 py-3.5 min-h-12 hover:bg-alignment-foundationBright transition-colors ${focusRing}`}
              >
                Begin free
              </Link>
              <p className="mt-5 text-[15px] text-white/70">No account. No card.</p>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
