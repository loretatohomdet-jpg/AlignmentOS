import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

export default function AboutPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'About — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className={type.page}>
      <a href="#about-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="about-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-16 sm:pt-24 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>Why this exists</p>
              <h1 className={`mt-6 ${type.h1}`}>
                Most people are productive.
                <br />
                Few are coherent.
              </h1>
              <div className={`mt-10 sm:mt-12 space-y-6 ${type.body}`}>
                <p>
                  Modern life pulls people in a hundred directions. The fix is not more effort. It is structure
                  beneath the effort — a few things, repeated, until a life holds together.
                </p>
                <p>
                  Alignment OS is built on one conviction, drawn from a long tradition: a life is formed by what is
                  repeated. The diagnostic measures the repetition. The tools build it. The cohort keeps it.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="max-w-xl">
              <blockquote>
                <p className={type.quote}>
                  Peace is the <em className="italic text-alignment-accent/90">tranquility of order.</em>
                </p>
                <footer className={`mt-6 ${type.body}`}>
                  — Augustine. The order is the work; the peace is what it makes room for.
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-20 sm:pb-28`}>
            <div className="max-w-xl">
              <h2 className={type.h2}>See where your life holds.</h2>
              <Link to="/assessment" className={`${pillPrimary} mt-8`}>
                Begin free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
