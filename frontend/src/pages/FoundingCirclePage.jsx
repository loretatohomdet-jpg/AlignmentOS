import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { pageWidth, pillPrimary, SitePageFooter } from '../components/HomeMarketingChrome';
import { type } from '../config/siteType';
import { API_BASE } from '../config/apiBase';
import { usePageTitle } from '../hooks/usePageTitle';

const benefits = [
  { title: 'Early access', body: 'Live inside Alignment OS while it is still being shaped with you.' },
  { title: 'Eight weeks together', body: 'Assessment, plan, daily practice, and review — held in a small circle.' },
  { title: 'Share your experience', body: 'Your feedback helps form the product for the women who come after.' },
];

const seasons = [
  'A season of growth and opportunity',
  'A busy season with many responsibilities',
  'A season of transition or change',
  'A season that feels overwhelming',
  'Not sure',
];

export default function FoundingCirclePage() {
  usePageTitle('Founding Circle — Alignment OS');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [season, setSeason] = useState('');
  const [why, setWhy] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/lead`, {
        email: email.trim(),
        source: 'founding-circle',
        name: name.trim() || undefined,
        season: season || undefined,
        note: why.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={type.page}>
      <a href="#founding-main" className="skip-to-main">
        Skip to main content
      </a>
      <SiteMarketingHeader />

      <main id="founding-main" className="flex-1 scroll-mt-16" tabIndex={-1}>
        <section>
          <div className={`${pageWidth} pt-12 sm:pt-16 pb-10 sm:pb-14`}>
            <div className="max-w-xl">
              <p className={type.kicker}>Founding Circle</p>
              <h1 className={`mt-6 ${type.h1} text-balance`}>
                A small group of women building a more aligned life together.
              </h1>
              <p className={`mt-6 ${type.body}`}>
                Not to be the busiest, but to be the most aligned. Early access, eight weeks with the system, and a
                place to share what you learn.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full border-t border-alignment-accent/[0.06] bg-alignment-surfaceSoft/90">
          <div className={`${pageWidth} py-12 sm:py-16`}>
            <ul className="max-w-xl space-y-8">
              {benefits.map((b) => (
                <li key={b.title}>
                  <h2 className={type.h3}>{b.title}</h2>
                  <p className={`mt-2 ${type.body}`}>{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="apply">
          <div className={`${pageWidth} py-12 sm:py-16`}>
            <div className="max-w-lg">
              {done ? (
                <>
                  <p className={type.kicker}>You’re in</p>
                  <h2 className={`mt-4 ${type.h2}`}>Welcome to the Founding Circle.</h2>
                  <p className={`mt-4 ${type.body}`}>
                    Create your account to save your assessment, open My Plan, and begin the day.
                  </p>
                  <Link to="/signup?returnTo=/plan" className={`${pillPrimary} mt-10`}>
                    Create Your Account →
                  </Link>
                </>
              ) : (
                <>
                  <p className={type.kicker}>Application</p>
                  <h2 className={`mt-4 ${type.h2}`}>Apply for the Founding Circle</h2>
                  <form onSubmit={submit} className="mt-8 space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-alignment-accent/65 mb-2">
                        First name
                      </label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3.5 text-sm text-alignment-accent focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-alignment-accent/65 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3.5 text-sm text-alignment-accent focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-alignment-accent/65 mb-2">
                        What is your current season?
                      </label>
                      <select
                        required
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3.5 text-sm text-alignment-accent focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
                      >
                        <option value="">Choose one</option>
                        {seasons.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-alignment-accent/65 mb-2">
                        Why are you interested?
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        className="w-full rounded-xl border border-alignment-accent/12 bg-apple-surface-muted px-4 py-3.5 text-sm text-alignment-accent focus:outline-none focus:ring-2 focus:ring-alignment-accent/10"
                      />
                    </div>
                    {error ? <p className="text-sm text-red-700">{error}</p> : null}
                    <button type="submit" disabled={submitting} className={`${pillPrimary} disabled:opacity-50`}>
                      {submitting ? 'Submitting…' : 'Submit Application →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <SitePageFooter />
    </div>
  );
}
