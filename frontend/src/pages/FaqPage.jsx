import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillPrimary, SitePageFooter, CmsCta } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { usePageTitle } from '../hooks/usePageTitle';
import { pageCopy, useSitePage } from '../hooks/useSiteContent';

const faqs = [
  {
    q: 'Is Alignment OS a productivity app?',
    a: 'No. It can help with priorities, habits, planning, and follow-through, but the goal is not to help you squeeze more into your day. The goal is to help you see what matters and make it easier to live.',
  },
  {
    q: 'Is the Alignment Assessment free?',
    a: 'Yes. The Alignment Assessment is free and takes about 12 minutes.',
  },
  {
    q: 'What happens after the assessment?',
    a: 'You receive a clearer picture of how the six parts of your life are working together and where attention may be useful. From there, Alignment OS helps you turn that insight into a personal plan and practical next steps.',
  },
  {
    q: 'Do I need to have every part of my life figured out?',
    a: 'No. Start with where you are and what matters now.',
  },
  {
    q: 'Is there a perfect Alignment Score?',
    a: 'No. The assessment is not a measure of your value or how successful you are at life. It is a snapshot designed to help you see your current pattern more clearly.',
  },
  {
    q: 'Is Alignment OS only for Catholics?',
    a: 'No. Alignment OS is built around a human-first view of life: purpose, responsibility, habits, relationships, limits, meaningful work, and the belief that a person is more than productivity. You do not need to be Catholic or religious to use it.',
  },
  {
    q: 'Will Alignment OS tell me what my priorities should be?',
    a: 'No. It helps you see your life more clearly so you can make better decisions about what deserves your attention.',
  },
  {
    q: 'Do I need to use the app every day?',
    a: 'No. Use it when it is useful. Then return to your life.',
  },
];

export default function FaqPage() {
  usePageTitle('FAQ — Alignment OS');
  const copy = pageCopy(useSitePage('/faq'), {
    eyebrow: 'FAQ',
    headline: 'A few practical questions.',
    subhead: 'Know what matters. Know what to do next.',
    body: 'Start with a clearer picture of where you are today.',
    ctaLabel: 'Take the free Alignment Assessment',
    ctaHref: '/assessment',
  });

  return (
    <div className={type.page}>
      <a href="#faq-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="faq-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>{copy.eyebrow}</p>
              <h1 className={`mt-6 ${type.h1}`}>{copy.headline}</h1>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-10 sm:pb-14`}>
            <dl className="max-w-xl space-y-10 sm:space-y-12">
              {faqs.map((item) => (
                <div key={item.q}>
                  <dt className={type.h3}>{item.q}</dt>
                  <dd className={`mt-3 ${type.body}`}>{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="max-w-xl">
              <p className={`font-display text-xl sm:text-2xl font-medium text-alignment-accent leading-snug`}>
                {copy.subhead}
              </p>
              <p className={`mt-4 ${type.body}`}>{copy.body}</p>
              <CmsCta href={copy.ctaHref} className={`${pillPrimary} mt-10`}>
                {copy.ctaLabel} <span aria-hidden className="ml-1">
                  →
                </span>
              </CmsCta>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
