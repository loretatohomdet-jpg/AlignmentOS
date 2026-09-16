import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { type } from '../config/siteType';
import { SitePageFooter } from '../components/HomeMarketingChrome';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/practice';

  return (
    <div className={`${type.page} overflow-x-hidden antialiased`}>
      <SiteMarketingHeader />
      <main className="flex-1 w-full flex flex-col items-center justify-center px-6 py-16 font-sans text-alignment-accent">
        <div className="w-full max-w-[400px] animate-fade-in">
          <LoginForm returnTo={returnTo} />
        </div>
      </main>
      <SitePageFooter />
    </div>
  );
}
