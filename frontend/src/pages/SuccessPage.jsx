import { Link, useSearchParams } from 'react-router-dom';

/** Generic success screen — link from signup, checkout, or lead capture with ?from= */
export default function SuccessPage() {
  const [params] = useSearchParams();
  const from = params.get('from') || '';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
      <p className="text-[10px] uppercase tracking-[0.24em] text-alignment-accent/45">Success</p>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-alignment-accent">You&apos;re set</h1>
      <p className="mt-4 text-sm text-alignment-accent/65 leading-relaxed">
        {from === 'signup'
          ? 'Your account is ready. Continue to the app or take the diagnostic.'
          : 'Next step: sign in to save progress, or take the diagnostic if you haven’t yet.'}
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-primary/90"
        >
          Open app
        </Link>
        <Link
          to="/assessment"
          className="inline-flex items-center justify-center rounded-sm border border-alignment-accent/15 text-alignment-accent text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-accent/[0.03]"
        >
          Diagnostic
        </Link>
      </div>
      <p className="mt-8 text-xs text-alignment-accent/45">
        <Link to="/" className="underline underline-offset-2 hover:text-alignment-accent">
          Home
        </Link>
      </p>
    </div>
  );
}
