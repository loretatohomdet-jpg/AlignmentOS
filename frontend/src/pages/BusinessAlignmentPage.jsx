import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/apiBase';

export default function BusinessAlignmentPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      setUserName(null);
      return;
    }
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUserName(data?.name?.trim() || null))
      .catch(() => setUserName(null));
  }, []);

  const firstName = userName?.split(/\s+/)[0] || null;

  return (
    <div className="min-h-screen w-full bg-alignment-surface">
      <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-12 sm:py-16">
        {/* Hero */}
        <section className="relative text-center overflow-hidden rounded-2xl bg-alignment-surface border border-alignment-accent/10 px-6 sm:px-10 py-14 sm:py-20">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/4 -left-16 w-56 h-56 rounded-full bg-alignment-accent/6" />
            <div className="absolute bottom-1/4 -right-16 w-72 h-72 rounded-full bg-alignment-accent/4" />
          </div>
          <div className="relative">
            {isLoggedIn && (
              <p className="text-sm font-medium text-alignment-accent uppercase tracking-wider">
                {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
              </p>
            )}
            <h1 className="text-display font-semibold text-alignment-accent tracking-tight mt-1">
              Business Alignment
            </h1>
            <p className="mt-5 text-xl sm:text-2xl text-alignment-accent/70 max-w-2xl mx-auto leading-relaxed">
              Align your team and company goals with the same clarity that drives individual performance.
            </p>
            {isLoggedIn && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-alignment-accent hover:underline"
                >
                  View Today
                </Link>
                <span className="text-alignment-accent/70">·</span>
                <Link
                  to="/results"
                  className="text-sm font-medium text-alignment-accent hover:underline"
                >
                  Your results
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Company goals */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-title font-semibold text-alignment-accent tracking-tight text-center">
            Goals that matter
          </h2>
          <p className="mt-3 text-lg text-alignment-accent/70 text-center max-w-2xl mx-auto">
            Use alignment as a shared language so strategy, daily work, and values stay connected.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Shared direction', desc: 'One framework so everyone knows how their work ties to company priorities.' },
              { title: 'Values in action', desc: 'Turn mission statements into measurable alignment across teams.' },
              { title: 'Retention & culture', desc: 'People stay when their work feels meaningful and aligned.' },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 text-center sm:text-left hover:shadow-apple-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-alignment-accent">{title}</h3>
                <p className="mt-2 text-sm text-alignment-accent/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-title font-semibold text-alignment-accent tracking-tight text-center">
            Why align as a business?
          </h2>
          <div className="mt-10 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
            <ul className="space-y-4">
              {[
                'Teams and leaders speak the same language about priorities and impact.',
                'Alignment OS gives a simple AQ metric to track over time—no extra complexity.',
                'Onboard new hires with a shared assessment so alignment is part of culture.',
                'Use results in reviews and planning without adding another tool.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-alignment-accent/5 text-alignment-accent flex items-center justify-center text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-alignment-accent">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Overview: Diagnostic & scoring */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-title font-semibold text-alignment-accent tracking-tight text-center">
            Business Alignment diagnostic and scoring
          </h2>
          <p className="mt-3 text-lg text-alignment-accent/70 text-center max-w-2xl mx-auto">
            We use the same proven Alignment Assessment at scale. Each person gets a 0–100 Index; your organization gets a clear picture of where alignment is strong and where it’s slipping.
          </p>
        </section>

        {/* The Journey: 5 steps */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-alignment-accent tracking-tight text-center">
            The Business Alignment Journey
          </h2>
          <p className="mt-2 text-alignment-accent/70 text-center max-w-xl mx-auto">
            A step-by-step path from diagnosis to sustained gap closure.
          </p>
          <div className="mt-10 space-y-6">
            {[
              {
                step: 1,
                title: 'Diagnostic',
                body: 'Your team completes the Alignment Assessment. Same questions, same 0–100 scale. We capture how closely daily work matches stated values and priorities across the organization.',
              },
              {
                step: 2,
                title: 'Score & Report',
                body: 'After the company completes the assessment, we generate a detailed alignment report. It highlights strengths (where alignment is high), gaps (where it’s low), and priority areas so you know exactly where to focus.',
              },
              {
                step: 3,
                title: 'Micro Habits',
                body: 'We introduce a structured micro-habit transformation plan tailored to close those gaps. Small, repeatable actions—not big initiatives—so teams can improve alignment without overwhelm.',
              },
              {
                step: 4,
                title: 'Quarterly Review',
                body: 'A quarterly reassessment process measures progress and tracks reduction of the misalignment gap. You see trends over time and adjust habits and priorities as needed.',
              },
              {
                step: 5,
                title: 'Gap Closure',
                body: 'Over quarters, the combination of targeted micro-habits and regular measurement drives sustained gap closure. Alignment becomes a habit, not a one-off project.',
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <span className="shrink-0 w-12 h-12 rounded-full bg-alignment-primary text-white flex items-center justify-center text-lg font-semibold">
                  {step}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-alignment-accent">{title}</h3>
                  <p className="mt-1 text-alignment-accent/70 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Short “How it works” summary */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-title font-semibold text-alignment-accent tracking-tight text-center">
            In practice
          </h2>
          <p className="mt-3 text-lg text-alignment-accent/70 text-center max-w-2xl mx-auto">
            Same assessment, scaled for your organization—aggregate results, act on the report, and revisit every quarter.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Assess', desc: 'Team members take the assessment; you get org-level and team-level scores.' },
              { title: 'Aggregate & report', desc: 'See strengths, gaps, and priority areas in one alignment report.' },
              { title: 'Act & review', desc: 'Micro-habits to close gaps; quarterly reassessment to track progress.' },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-5 text-center"
              >
                <h3 className="font-medium text-alignment-accent">{title}</h3>
                <p className="mt-1 text-sm text-alignment-accent/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 sm:mt-20 text-center">
          <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-8 sm:p-12">
            <h2 className="text-title font-semibold text-alignment-accent tracking-tight">
              {isLoggedIn ? 'Bring alignment to your team' : 'Ready to align your team?'}
            </h2>
            <p className="mt-3 text-lg text-alignment-accent/70 max-w-xl mx-auto">
              Get the Team plan for your organization. Shared dashboard, admin controls, and priority support.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="w-full sm:w-auto rounded-full bg-alignment-primary text-white px-8 py-4 text-base font-medium hover:bg-alignment-primary/90 transition-colors shadow-apple"
              >
                View Team plan
              </Link>
              <a
                href="https://simplicityandproductivity.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-full bg-alignment-surface text-alignment-accent px-8 py-4 text-base font-medium hover:bg-alignment-accent/5 transition-colors border border-alignment-accent/5"
              >
                Contact us
              </a>
            </div>
            <p className="mt-4 text-xs text-alignment-accent/50 max-w-lg mx-auto text-center">
              “Contact us” opens our partner channel (Simplicity & Productivity) for bespoke team and leadership formation —
              in addition to Alignment OS product plans above.
            </p>
            <p className="mt-6 text-sm text-alignment-accent/70">
              {isLoggedIn ? (
                <>
                  Or <Link to="/dashboard" className="text-alignment-accent font-medium hover:underline">go to Dashboard</Link>
                  {' · '}
                  <Link to="/results" className="text-alignment-accent font-medium hover:underline">view your results</Link>
                </>
              ) : (
                <>
                  Or <Link to="/assessment" className="text-alignment-accent font-medium hover:underline">take the individual assessment</Link> to see how it works.
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
