import { Link } from 'react-router-dom';
import { formationTeachableUrl } from '../config/externalLinks';
import { type } from '../config/siteType';
import { pillPrimary, pillGhost } from '../components/HomeMarketingChrome';
import { usePageTitle } from '../hooks/usePageTitle';

export default function FormationPage() {
  usePageTitle('Formation — Alignment OS');
  const href = formationTeachableUrl();

  return (
    <div className="mx-auto w-full max-w-lg px-6 pb-20 pt-10 sm:pt-14">
      <p className={type.kicker}>Formation</p>
      <h1 className={`mt-4 ${type.h1}`}>Go deeper when you are ready.</h1>
      <p className={`mt-4 ${type.body}`}>
        Formation lives on Teachable — tracks for Identity, Purpose, Attention, Habits, Environment, and Stewardship.
        Lessons, reflection, practice, and resources are there. Alignment OS keeps the assessment, My Plan, and the day.
      </p>
      <p className={`mt-4 ${type.body}`}>
        When your plan names a thin place, open Formation and start the matching track.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={pillPrimary}
        >
          Open Formation on Teachable →
        </a>
        <Link to="/plan" className={pillGhost}>
          Back to My Plan
        </Link>
      </div>
    </div>
  );
}
