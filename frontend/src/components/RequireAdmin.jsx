import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE } from '../config/apiBase';

/**
 * Ensures the user is signed in and has ADMIN role before rendering children.
 */
export default function RequireAdmin({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setStatus('no-auth');
      return;
    }
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (res.status === 401) {
          setStatus('no-auth');
          return null;
        }
        if (res.status === 403) {
          let msg = '';
          try {
            const errBody = await res.json();
            msg = errBody?.message || '';
          } catch (_) {}
          setStatus(msg === 'Account suspended.' ? 'suspended' : 'forbidden');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.role === 'ADMIN') setStatus('ok');
        else setStatus('forbidden');
      })
      .catch(() => setStatus('forbidden'));
  }, [location.pathname]);

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-alignment-accent/70">Loading…</p>
      </div>
    );
  }

  if (status === 'no-auth') {
    const returnTo = encodeURIComponent(location.pathname || '/admin');
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  if (status === 'suspended') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-5 py-4 text-alignment-accent">
          This account has been suspended. Contact support if you believe this is an error.
        </div>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-5 py-4 text-alignment-accent">
          Admin access required.
        </div>
      </div>
    );
  }

  return children;
}
