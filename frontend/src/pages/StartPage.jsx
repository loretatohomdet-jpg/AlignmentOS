import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

export default function StartPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/lead`, {
        email: email.trim(),
        source: 'start_lander',
      });
      navigate('/assessment', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col">
      <SiteMarketingHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">
            Get your free Alignment OS
          </h1>
          <p className="mt-4 text-lg text-alignment-accent/70">
            One number that shows how closely your work matches what matters to you. Takes 5–7 minutes.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl bg-alignment-surface border border-alignment-accent/15 px-4 py-2 text-sm text-alignment-accent">
                {error}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full rounded-full border border-alignment-accent/10 bg-alignment-surface px-5 py-3.5 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-base font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Get my free AQ score'}
            </button>
          </form>
          <p className="mt-4 text-xs text-alignment-accent/70">
            We’ll send your results and email for the assessment link and tips. Create an account after the assessment to save your AQ score.
          </p>
          <p className="mt-8">
            <Link to="/assessment" className="text-sm text-alignment-accent hover:underline">
              I’ll just take the assessment →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
