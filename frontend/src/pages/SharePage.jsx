import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/apiBase';

export default function SharePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    axios
      .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => setError('Could not load account.'))
      .finally(() => setLoading(false));
  }, []);

  const shareUrl =
    typeof window !== 'undefined' && user?.shareToken
      ? `${window.location.origin}/s/${user.shareToken}`
      : '';

  const createOrRotate = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setCreating(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_BASE}/me/share`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUser((u) => (u ? { ...u, shareToken: data.shareToken } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create link.');
    } finally {
      setCreating(false);
    }
  };

  const copy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard not available. Copy the link manually.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-alignment-accent/70">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 sm:py-20">
      <h1 className="font-display text-2xl font-medium text-alignment-accent">Share your alignment</h1>
      <p className="mt-4 text-sm text-alignment-accent/70 leading-relaxed">
        Create a public link that shows your latest AQ snapshot and archetype—no email or full name. Anyone with the
        link can view it.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      <div className="mt-10 space-y-4">
        {!user?.shareToken ? (
          <button
            type="button"
            onClick={createOrRotate}
            disabled={creating}
            className="rounded-full bg-alignment-primary text-white text-sm font-medium px-6 py-3 hover:bg-alignment-primary/90 disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create share link'}
          </button>
        ) : (
          <>
            <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-sm break-all text-alignment-accent">
              {shareUrl}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="rounded-full bg-alignment-primary text-white text-sm font-medium px-6 py-2.5 hover:bg-alignment-primary/90"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                onClick={createOrRotate}
                disabled={creating}
                className="rounded-full border border-alignment-accent/15 text-alignment-accent text-sm font-medium px-6 py-2.5 hover:bg-alignment-accent/[0.03] disabled:opacity-50"
              >
                {creating ? 'Working…' : 'New link (invalidates old)'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <Link
          to="/results"
          className="inline-flex items-center justify-center rounded-sm bg-alignment-surface border border-alignment-accent/15 text-alignment-accent text-xs font-medium uppercase tracking-[0.14em] px-6 py-3 hover:bg-alignment-accent/[0.03]"
        >
          View results
        </Link>
      </div>
    </div>
  );
}
