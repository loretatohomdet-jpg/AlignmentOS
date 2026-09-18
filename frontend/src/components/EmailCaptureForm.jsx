import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';

/**
 * POST /api/lead — homepage sends the Alignment Reset guide; other sources save the email quietly.
 */
export default function EmailCaptureForm({
  source = 'lander',
  redirectTo = '/assessment',
  buttonText = 'Subscribe',
  placeholder = 'your@email.com',
  helperText = 'No spam. Unsubscribe any time.',
  successText = 'Check your inbox.',
  layout = 'stacked',
  className = '',
  onSuccess,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter your email');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/lead`, { email: trimmed, source });
      setDone(true);
      onSuccess?.();
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'min-w-0 flex-1 rounded-sm border border-alignment-accent/15 bg-alignment-surface px-4 py-3.5 text-sm text-alignment-accent placeholder-alignment-accent/40 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/10 outline-none transition-all';
  const buttonClass = `shrink-0 inline-flex items-center justify-center rounded-full bg-alignment-primary text-white text-[15px] font-medium px-8 py-3.5 min-h-12 transition-colors hover:bg-alignment-primary/90 disabled:opacity-50 ${focusRing}`;

  if (done && !redirectTo) {
    return <p className="text-sm text-alignment-accent/90">{successText}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && (
        <p className="mb-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
          {error}
        </p>
      )}
      {layout === 'inline' ? (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            autoComplete="email"
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? '…' : buttonText}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            autoComplete="email"
            className={`w-full ${inputClass}`}
          />
          <button type="submit" disabled={loading} className={`w-full ${buttonClass}`}>
            {loading ? 'Sending…' : buttonText}
          </button>
        </div>
      )}
      {helperText && <p className="mt-3 text-[11px] sm:text-xs text-alignment-accent/65">{helperText}</p>}
    </form>
  );
}
