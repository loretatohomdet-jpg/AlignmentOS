import { Link } from 'react-router-dom';
import { type } from '../config/siteType';
import { pillGhost, pillPrimary } from '../components/HomeMarketingChrome';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className={type.kicker}>404</p>
      <h1 className={`mt-4 ${type.h1}`}>Page not found</h1>
      <p className={`mt-4 ${type.body} max-w-md`}>
        That path doesn&apos;t exist or may have moved. Try home, the diagnostic, or sign in.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link to="/" className={pillPrimary}>
          Home
        </Link>
        <Link to="/diagnostic" className={pillGhost}>
          Diagnostic
        </Link>
        <Link to="/login" className="text-sm text-alignment-accent/90 hover:text-alignment-accent underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
