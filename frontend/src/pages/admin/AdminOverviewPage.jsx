import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { ADMIN_NAV, TONE, adminHeaders } from './adminShared';

const STAT_TONES = ['olive', 'clay', 'teal', 'gold', 'olive', 'clay', 'teal'];

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/analytics/overview`, { headers: adminHeaders() })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load overview');
      });
  }, [navigate]);

  if (error) {
    return <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p>;
  }

  if (!data) {
    return <p className="text-alignment-accent/80">Loading the desk…</p>;
  }

  const cards = [
    { label: 'People', value: data.userCount, to: '/admin/users' },
    { label: 'New this week', value: data.signupsLast7Days, to: '/admin/users' },
    { label: 'Inbox leads', value: data.leadCount, to: '/admin/leads' },
    { label: 'Answers', value: data.responseCount, to: '/admin/assessments' },
    { label: 'Profiles', value: data.profileCount, to: '/admin/users' },
    { label: 'Scores', value: data.scoreCount, to: '/admin/assessments' },
    { label: 'Suspended', value: data.suspendedCount, to: '/admin/users' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl text-alignment-accent">Today</h2>
      <p className="mt-1 text-sm text-alignment-accent/75">Tap a card to go work on it.</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const tone = TONE[STAT_TONES[i]];
          return (
            <li key={c.label}>
              <Link to={c.to} className={`block rounded-2xl ${tone.soft} p-5 hover:-translate-y-0.5 transition-transform`}>
                <p className={`text-[11px] uppercase tracking-wider ${tone.text}`}>{c.label}</p>
                <p className="mt-2 font-display text-3xl tabular-nums text-alignment-accent">{c.value}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-10 font-display text-xl text-alignment-accent">Jump in</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_NAV.filter((item) => item.to !== '/admin/overview').map((item) => {
          const tone = TONE[item.tone];
          return (
            <li key={item.to}>
              <Link to={item.to} className={`block rounded-2xl ${tone.bg} text-white p-5 hover:opacity-95`}>
                <p className="font-display text-xl">{item.label}</p>
                <p className="mt-1 text-sm text-white/85">{item.hint}</p>
                <p className="mt-4 text-sm font-medium">Open →</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
