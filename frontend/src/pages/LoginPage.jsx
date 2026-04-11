import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SiteMarketingHeader from '../components/SiteMarketingHeader';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  return (
    <div className="min-h-screen w-full bg-alignment-surface flex flex-col overflow-x-hidden antialiased">
      <SiteMarketingHeader />
      <main className="flex-1 w-full flex flex-col items-center justify-center px-6 py-16 font-sans text-alignment-accent">
        <div className="w-full max-w-[400px] animate-fade-in">
          <LoginForm returnTo={returnTo} />
        </div>
      </main>
    </div>
  );
}
