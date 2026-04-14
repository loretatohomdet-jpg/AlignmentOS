import { useState } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, networkErrorUserMessage } from '../config/apiBase';
import SiteMarketingHeader from '../components/SiteMarketingHeader';
import { authHeadingClass, authLeadClass } from '../constants/authPageTheme';

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/assessment';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };
    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
      localStorage.setItem('accessToken', data.token);
      navigate(returnTo.startsWith('/') ? returnTo : `/${returnTo}`, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      const detail = Array.isArray(errors) && errors[0]?.message
        ? errors.map((e) => e.message).join('. ')
        : msg;
      setError(
        detail ||
          (err.code === 'ERR_NETWORK' ? networkErrorUserMessage() : err.message) ||
          'Sign up failed. Check your details or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col font-sans antialiased">
      <SiteMarketingHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <h1 className={authHeadingClass}>
            Get started
          </h1>
          <p className={`${authLeadClass} max-w-md mx-auto`}>
            Create an account to take the assessment and track your AQ score.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-alignment-accent mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-alignment-accent mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-alignment-accent mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-alignment-accent/70">
          Already have an account?{' '}
          <NavLink to="/login" className="font-medium text-alignment-accent hover:underline">
            Sign in
          </NavLink>
        </p>
      </div>
      </div>
    </div>
  );
}
