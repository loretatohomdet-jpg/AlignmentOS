import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';

function headers() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/analytics/overview`, { headers: headers() })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else setError(err.response?.data?.message || 'Failed to load analytics');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent">
        {error}
      </div>
    );
  }

  if (!data) {
    return <p className="text-alignment-accent/70">Loading metrics…</p>;
  }

  const cards = [
    { label: 'Registered users', value: data.userCount },
    { label: 'Sign-ups (7 days)', value: data.signupsLast7Days },
    { label: 'Leads captured', value: data.leadCount },
    { label: 'Question responses', value: data.responseCount },
    { label: 'Alignment profiles', value: data.profileCount },
    { label: 'Scores recorded', value: data.scoreCount },
    { label: 'Suspended accounts', value: data.suspendedCount },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-alignment-accent">Overview</h2>
      <p className="mt-1 text-sm text-alignment-accent/65">
        High-level counts for operations and growth checks.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li
            key={c.label}
            className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-5 py-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-alignment-accent/50">{c.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums text-alignment-accent">{c.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
