import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';

function headers() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [submittedQ, setSubmittedQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);

  const load = (search) => {
    setLoading(true);
    setError(null);
    const params = { limit: 50, offset: 0 };
    if (search) params.q = search;
    axios
      .get(`${API_BASE}/admin/users`, { headers: headers(), params })
      .then((res) => setPayload(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else setError(err.response?.data?.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load('');
  }, [navigate]);

  const onSearch = (e) => {
    e.preventDefault();
    setSubmittedQ(q.trim());
    load(q.trim());
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-alignment-accent">Users</h2>
      <p className="mt-1 text-sm text-alignment-accent/65">
        Search by name or email. Open a user to change plan, role, suspension, and internal notes.
      </p>

      <form onSubmit={onSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className="flex-1 rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-4 py-2.5 text-sm text-alignment-accent placeholder:text-alignment-accent/35 focus:border-alignment-primary/40 focus:outline-none focus:ring-2 focus:ring-alignment-primary/15"
        />
        <button
          type="submit"
          className="rounded-full bg-alignment-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-alignment-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-alignment-accent/70">Loading…</p>
      ) : payload ? (
        <div className="mt-8 rounded-2xl border border-alignment-accent/10 bg-alignment-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-alignment-accent/10 text-xs text-alignment-accent/55">
            {payload.total} user{payload.total !== 1 ? 's' : ''}
            {submittedQ ? ` matching “${submittedQ}”` : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-alignment-accent/10 bg-alignment-surface/30">
                  <th className="px-4 py-3 font-medium text-alignment-accent">Email</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Name</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Plan</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Role</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Status</th>
                </tr>
              </thead>
              <tbody>
                {payload.users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-alignment-accent/60">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  payload.users.map((u) => (
                    <tr key={u.id} className="border-b border-alignment-accent/5 hover:bg-alignment-accent/[0.02]">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="font-medium text-alignment-primary hover:underline"
                        >
                          {u.email}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-alignment-accent">{u.name}</td>
                      <td className="px-4 py-3 text-alignment-accent/80">{u.plan}</td>
                      <td className="px-4 py-3 text-alignment-accent/80">{u.role}</td>
                      <td className="px-4 py-3">
                        {u.suspendedAt ? (
                          <span className="text-amber-800/90 text-xs font-medium uppercase tracking-wide">
                            Suspended
                          </span>
                        ) : (
                          <span className="text-alignment-accent/50 text-xs">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
