import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-[10px] uppercase tracking-[0.24em] text-alignment-accent/45">404</p>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-alignment-accent">Page not found</h1>
      <p className="mt-4 text-sm text-alignment-accent/60 max-w-md leading-relaxed">
        That path doesn&apos;t exist or may have moved. Try home, the diagnostic, or sign in.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-sm bg-alignment-primary text-white text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-primary/90"
        >
          Home
        </Link>
        <Link
          to="/diagnostic"
          className="inline-flex items-center justify-center rounded-sm border border-alignment-accent/15 text-alignment-accent text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-accent/[0.03]"
        >
          Diagnostic
        </Link>
        <Link to="/login" className="text-sm text-alignment-accent/70 hover:text-alignment-accent underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
