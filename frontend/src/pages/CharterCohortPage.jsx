import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { hairline, pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { cohortApplyUrl } from '../config/externalLinks';

const seatHref = cohortApplyUrl || 'mailto:organizations@alignmentos.com?subject=Charter%20cohort';
const seatExternal = /^https?:/i.test(seatHref) || seatHref.startsWith('mailto:');

const weeks = [
  {
    when: 'Weeks 1–2',
    title: 'Clarity',
    body: 'See the life you are actually living. Name the gap, and what the days are for.',
  },
  {
    when: 'Week 3',
    title: 'Reset',
    body: 'Clear what collected without your consent. The week of subtraction.',
  },
  {
    when: 'Weeks 4–5',
    title: 'Daily',
    body: 'Build the rule, small on purpose. Live it inside the group, where it holds.',
  },
  {
    when: 'Week 6',
    title: 'The sending',
    body: 'Consolidate the rule you have lived. Name what carries forward.',
  },
];

function SeatButton() {
  const label = 'Take a charter seat';
  if (seatExternal) {
    return (
      <a
        href={seatHref}
        className={pillPrimary}
        target={seatHref.startsWith('http') ? '_blank' : undefined}
        rel={seatHref.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    );
  }
  return (
    <Link to={seatHref} className={pillPrimary}>
      {label}
    </Link>
  );
}

export default function CharterCohortPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'The Charter Cohort — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className={type.page}>
      <a href="#cohort-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="cohort-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-16 sm:pt-24 pb-16 sm:pb-20`}>
            <div className="max-w-xl">
              <p className={type.kicker}>The charter cohort</p>
              <h1 className={`mt-6 ${type.h1}`}>A life is formed by what is repeated.</h1>
              <p className={`mt-7 ${type.body}`}>
                The first cohort opens once. Twelve people, six weeks, led personally. You leave with a rule of life you
                have already lived.
              </p>
              <div className="mt-9">
                <SeatButton />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-16 sm:pb-24`}>
            <div className="max-w-2xl">
              <p className={type.quote}>
                Most attempts at a better life add effort to a life whose shape was never examined.
              </p>
              <p className={`mt-6 ${type.body} max-w-lg`}>
                The result is a busier version of the same disorder.
                <br />
                This begins earlier — with what your life is for.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-16 sm:pb-24`}>
            <p className={type.kicker}>The six weeks</p>
            <div className={`mt-6 border-t ${hairline}`}>
              {weeks.map((week) => (
                <div
                  key={week.when}
                  className={`grid gap-2 sm:grid-cols-[8.5rem_8rem_1fr] sm:gap-x-8 py-8 border-b ${hairline}`}
                >
                  <p className="font-display italic text-[1.15rem] leading-snug text-alignment-primary">{week.when}</p>
                  <p className="font-medium text-alignment-accent">{week.title}</p>
                  <p className={type.body}>{week.body}</p>
                </div>
              ))}
            </div>
            <p className={`mt-12 sm:mt-16 ${type.quote} max-w-3xl`}>
              You leave with a rule of life you have already lived, and eleven others who know what you are building.
            </p>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-16 sm:pb-20`}>
            <div className="max-w-xl">
              <p className={type.kicker}>Honest terms</p>
              <p className={`mt-6 ${type.body}`}>
                Twelve seats. They close when full, or on the date — whichever comes first. The program returns later at
                its own price. The charter terms return with no one.
              </p>
              <p className={`mt-5 ${type.body}`}>
                Not the right season?{' '}
                <Link to="/assessment" className="underline underline-offset-2 hover:text-alignment-accent">
                  Begin with the free diagnostic.
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-20 sm:pb-28`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>
                The first Journey
                <br />
                opens once.
              </h2>
              <div className="mt-9">
                <SeatButton />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
