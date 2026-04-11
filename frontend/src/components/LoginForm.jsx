import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import {
  authHeadingClass,
  authLeadClass,
  authLeadClassCompact,
  authPrimaryButtonMarketingClass,
  authPrimaryButtonCompactClass,
} from '../constants/authPageTheme';

/**
 * Shared sign-in form for full-page /login and LoginModal.
 */
export default function LoginForm({
  returnTo = '/dashboard',
  /** Called after token is stored (navigate or parent state update) */
  onSuccess,
  /** Smaller vertical spacing for modal */
  compact = false,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      localStorage.setItem('accessToken', data.token);
      window.dispatchEvent(new Event('alignment-auth'));
      const path = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
      if (onSuccess) {
        onSuccess(path);
      } else {
        navigate(path, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const gap = compact ? 'space-y-4' : 'space-y-5';
  const titleMb = compact ? 'mb-6' : 'mb-10';

  return (
    <div className="font-sans text-alignment-accent">
      <div className={`text-center ${titleMb}`}>
        <h1 className={authHeadingClass}>Sign in</h1>
        <p className={compact ? authLeadClassCompact : `${authLeadClass} max-w-md mx-auto`}>
          Take the assessment and track your AQ score.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={gap}>
        {error && (
          <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">{error}</div>
        )}
        <div>
          <label htmlFor="login-email" className="block font-sans text-sm font-medium text-alignment-accent mb-2">
            Email
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="block font-sans text-sm font-medium text-alignment-accent mb-2">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <div className="flex items-center justify-end">
          <NavLink to="/forgot-password" className="font-sans text-sm text-alignment-accent hover:underline">
            Forgot password?
          </NavLink>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={compact ? authPrimaryButtonCompactClass : authPrimaryButtonMarketingClass}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {!import.meta.env.PROD && (
        <p className="mt-8 text-center font-sans text-sm text-alignment-accent/70">
          Demo: <span className="font-medium text-alignment-accent">demo@alignment.local</span>
          {' / '}
          <span className="font-medium text-alignment-accent">password123</span>
        </p>
      )}

      <p className={`${compact ? 'mt-6' : 'mt-6'} text-center font-sans text-sm text-alignment-accent/70`}>
        Don&apos;t have an account?{' '}
        <NavLink to="/signup" className="font-medium text-alignment-accent hover:underline">
          Sign up
        </NavLink>
      </p>
      <p className="mt-3 text-center">
        <NavLink to="/diagnostic" className="font-sans text-sm text-alignment-accent hover:underline">
          Continue without signing in
        </NavLink>
      </p>
    </div>
  );
}
