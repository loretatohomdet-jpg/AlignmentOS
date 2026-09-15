import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeFooter, HomeHeader, pageWidth, pillPrimary } from '../components/HomeMarketingChrome';

export default function AboutPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'About — Alignment OS';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-alignment-foundation text-alignment-accent flex flex-col">
      <a href="#about-main" className="skip-to-main">
        Skip to main content
      </a>
      <HomeHeader />

      <main id="about-main" className="flex-1" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-16 sm:pt-24 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-alignment-accent/40">Why this exists</p>
              <h1 className="mt-6 font-display italic font-normal text-[2.15rem] sm:text-[2.65rem] md:text-[2.85rem] leading-[1.18] tracking-tight">
                Most people are productive.
                <br />
                Few are coherent.
              </h1>
              <div className="mt-10 sm:mt-12 space-y-6 text-[15px] sm:text-base text-alignment-accent/60 leading-relaxed">
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
                <p className="font-display italic font-normal text-[1.85rem] sm:text-[2.35rem] md:text-[2.55rem] leading-[1.2] tracking-tight">
                  Peace is the tranquility of order.
                </p>
                <footer className="mt-6 text-[15px] sm:text-base text-alignment-accent/55 leading-relaxed">
                  — Augustine. The order is the work; the peace is what it makes room for.
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section>
          <div className={`${pageWidth} pb-20 sm:pb-28`}>
            <div className="max-w-xl">
              <h2 className="font-display italic font-normal text-[1.85rem] sm:text-[2.35rem] md:text-[2.55rem] leading-[1.2] tracking-tight">
                See where your life holds.
              </h2>
              <Link to="/assessment" className={`${pillPrimary} mt-8`}>
                Begin free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
