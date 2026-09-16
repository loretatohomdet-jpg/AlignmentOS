import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';

export default function ResetGuidePage() {
  return (
    <div className={type.page}>
      <SiteMarketingHeader />
      <main className="flex-1 w-full">
        <section className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
          <p className={type.kicker}>The Alignment Reset</p>
          <h1 className={`mt-6 ${type.h1}`}>A short guide for when effort is high and life still drifts.</h1>
          <p className={`mt-6 ${type.body}`}>
            A life is formed by what is repeated. This is not more motivation. It is a way to see the structure underneath the week — and to begin again without starting over.
          </p>

          <h2 className={`mt-14 ${type.h2}`}>Six domains</h2>
          <p className={`mt-4 ${type.body}`}>
            Identity. Purpose. Mindset. Habits. Environment. Execution. Where one is thin, the others compensate. The diagnostic names the thin place.
          </p>

          <h2 className={`mt-14 ${type.h2}`}>The reset</h2>
          <ol className={`mt-4 space-y-4 ${type.body}`}>
            <li><span className="font-medium text-alignment-accent">See.</span> Take the free diagnostic. Twelve minutes. Six domains. One score, one primary strain.</li>
            <li><span className="font-medium text-alignment-accent">Hold the day.</span> Three rooms: morning before the phone, a midday pause, a close. Not a new personality. A repetition.</li>
            <li><span className="font-medium text-alignment-accent">Review.</span> Once a week, look at what was repeated — not what was intended.</li>
          </ol>

          <Link to="/assessment" className={`${pillPrimary} mt-12`}>
            Begin the free diagnostic →
          </Link>
        </section>
      </main>
      <SitePageFooter />
    </div>
  );
}
