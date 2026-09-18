import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import { API_BASE } from '../config/apiBase';
import { type } from '../config/siteType';
import { clearSession, getAccessToken } from '../utils/authSession';
import { usePageTitle } from '../hooks/usePageTitle';

function AdminGate({ children }) {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-20">
      <p className={type.kicker}>Admin</p>
      <h1 className={`mt-4 ${type.h1}`}>Operators.</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/**
 * Ensures the user is signed in and has ADMIN role before rendering children.
 * Stays on /admin so this URL is always a real page.
 */
export default function RequireAdmin({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  usePageTitle('Admin — Alignment OS');

  useEffect(() => {
    const check = () => {
      const token = getAccessToken();
      if (!token) {
        setStatus('no-auth');
        return;
      }
      setStatus('loading');
      fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(async (res) => {
          if (res.status === 401) {
            clearSession();
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
    };

    check();
    window.addEventListener('alignment-auth', check);
    return () => window.removeEventListener('alignment-auth', check);
  }, [location.pathname]);

  if (status === 'ok') return children;

  if (status === 'loading') {
    return (
      <AdminGate>
        <p className={type.body}>Loading…</p>
      </AdminGate>
    );
  }

  if (status === 'no-auth') {
    return (
      <AdminGate>
        <LoginForm
          returnTo="/admin/overview"
          lead="Sign in with an operator account to open the dashboard."
          showSignup={false}
          showGuest={false}
        />
      </AdminGate>
    );
  }

  if (status === 'suspended') {
    return (
      <AdminGate>
        <p className={type.body}>This account has been suspended. Contact support if you believe this is an error.</p>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <p className={type.body}>
        This area is for Alignment OS operators. The account you are using does not have admin access.
      </p>
      <Link to="/dashboard" className="mt-8 inline-block text-sm text-alignment-accent underline underline-offset-4">
        Back to the product
      </Link>
    </AdminGate>
  );
}
