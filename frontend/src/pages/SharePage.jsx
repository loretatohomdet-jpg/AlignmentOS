import { Link } from 'react-router-dom';

/** Placeholder for “share score card” — deep-link authenticated users to results */
export default function SharePage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 sm:py-20">
      <h1 className="font-display text-2xl font-medium text-alignment-accent">Share your alignment</h1>
      <p className="mt-4 text-sm text-alignment-accent/70 leading-relaxed">
        Your shareable score card lives with your latest results. Sign in to copy or share when that feature is enabled in
        the app.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          to="/results"
          className="inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-primary/90"
        >
          View results
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-sm border border-alignment-accent/15 text-alignment-accent text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-accent/[0.03]"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
