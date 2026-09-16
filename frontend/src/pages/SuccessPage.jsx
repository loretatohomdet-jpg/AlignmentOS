import { Link, useSearchParams } from 'react-router-dom';
import { type } from '../config/siteType';
import { pillGhost, pillPrimary } from '../components/HomeMarketingChrome';

/** Generic success screen — link from signup, checkout, or lead capture with ?from= */
export default function SuccessPage() {
  const [params] = useSearchParams();
  const from = params.get('from') || '';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
      <p className={type.kicker}>Success</p>
      <h1 className={`mt-4 ${type.h1}`}>You&apos;re set</h1>
      <p className={`mt-4 ${type.body}`}>
        {from === 'checkout'
          ? 'Payment received. Your Habit Engine is active. Open Today and begin the next room.'
          : from === 'signup'
            ? 'Your account is ready. Continue to the app or take the diagnostic.'
            : 'Next step: sign in to save progress, or take the diagnostic if you haven’t yet.'}
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link to={from === 'checkout' ? '/practice' : '/dashboard'} className={pillPrimary}>
          {from === 'checkout' ? 'Open Today' : 'Open app'}
        </Link>
        <Link to="/assessment" className={pillGhost}>
          Diagnostic
        </Link>
      </div>
      <p className={`mt-8 ${type.muted}`}>
        <Link to="/" className="underline underline-offset-2 hover:text-alignment-accent">
          Home
        </Link>
      </p>
    </div>
  );
}
