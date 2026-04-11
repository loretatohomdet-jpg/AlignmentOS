import { useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { authHeadingClass, authLeadClass } from '../constants/authPageTheme';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing reset link. Request a new one from the sign-in page.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="min-h-screen bg-alignment-surface flex flex-col items-center justify-center px-6 py-16 font-sans antialiased">
        <div className="w-full max-w-[400px] text-center">
          <h1 className={authHeadingClass}>
            Invalid reset link
          </h1>
          <p className={`${authLeadClass} max-w-md mx-auto`}>
            This link is missing or invalid. Request a new one from the sign-in page.
          </p>
          <NavLink
            to="/forgot-password"
            className="mt-6 inline-block text-sm font-medium text-alignment-accent hover:underline"
          >
            Forgot password
          </NavLink>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-alignment-surface flex flex-col items-center justify-center px-6 py-16 font-sans antialiased">
        <div className="w-full max-w-[400px] text-center">
          <h1 className={authHeadingClass}>
            Password updated
          </h1>
          <p className={`${authLeadClass} max-w-md mx-auto`}>
            You can now sign in with your new password.
          </p>
          <NavLink
            to="/login"
            className="mt-6 inline-block rounded-full bg-alignment-primary text-white px-6 py-3 text-sm font-medium hover:bg-alignment-primary/90"
          >
            Sign in
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alignment-surface flex flex-col items-center justify-center px-6 py-16 font-sans antialiased">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <h1 className={authHeadingClass}>
            Set new password
          </h1>
          <p className={`${authLeadClass} max-w-md mx-auto`}>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-alignment-accent mb-2">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-alignment-accent mb-2">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3.5 font-sans text-sm text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="Same as above"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-alignment-primary text-white py-3.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-alignment-accent/70">
          <NavLink to="/login" className="font-medium text-alignment-accent hover:underline">
            Back to sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
