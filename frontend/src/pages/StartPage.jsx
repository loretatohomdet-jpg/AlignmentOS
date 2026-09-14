import { Link } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import EmailCaptureForm from '../components/EmailCaptureForm';

export default function StartPage() {
  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col">
      <SiteMarketingHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">
            Get your free Alignment OS
          </h1>
          <p className="mt-4 text-lg text-alignment-accent/70">
            One number across six domains. Takes about 12 minutes.
          </p>
          <div className="mt-8 text-left">
            <EmailCaptureForm
              source="start_lander"
              redirectTo="/assessment"
              buttonText="Get my free score"
              placeholder="Your email"
              helperText="Assessment link + updates. Unsubscribe any time."
            />
          </div>
          <p className="mt-8">
            <Link to="/assessment" className="text-sm text-alignment-accent hover:underline">
              Skip — take the diagnostic →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
