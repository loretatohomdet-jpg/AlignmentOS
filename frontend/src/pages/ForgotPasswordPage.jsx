import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { authHeadingClass, authLeadClass } from '../constants/authPageTheme';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col items-center justify-center px-6 py-16 font-sans antialiased">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <h1 className={authHeadingClass}>
            Forgot password
          </h1>
          <p className={`${authLeadClass} max-w-md mx-auto`}>
            Enter your email and we will send a link to set a new password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 px-4 py-6 text-center">
            <p className="text-alignment-accent font-medium">Check your email</p>
            <p className="mt-2 text-sm text-alignment-accent/70">
              If that email is registered, we sent a reset link. It expires in 1 hour.
            </p>
            <NavLink
              to="/login"
              className="mt-6 inline-block text-sm font-medium text-alignment-accent hover:underline"
            >
              Back to sign in
            </NavLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
                {error}
              </div>
            )}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-alignment-accent/70">
          <NavLink to="/login" className="font-medium text-alignment-accent hover:underline">
            Back to sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
