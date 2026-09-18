import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnPrimary, btnGhost, fieldClass } from './adminShared';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [submittedQ, setSubmittedQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'USER', plan: 'FREE' });

  const load = (search) => {
    setLoading(true);
    setError(null);
    const params = { limit: 50, offset: 0 };
    if (search) params.q = search;
    axios
      .get(`${API_BASE}/admin/users`, { headers: adminHeaders(), params })
      .then((res) => setPayload(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load people');
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

  const createUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/users`, form, { headers: adminHeaders() });
      setShowCreate(false);
      setForm({ email: '', name: '', password: '', role: 'USER', plan: 'FREE' });
      navigate(`/admin/users/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create this person');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#9A4F38]">People</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">Search, open a record to edit, or add someone new.</p>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
          {showCreate ? 'Close' : 'Add a person'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={createUser} className="mt-6 rounded-2xl bg-[#C4785A]/12 p-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Name</span>
            <input required className={`${fieldClass} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Email</span>
            <input required type="email" className={`${fieldClass} mt-1`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Password (min 6)</span>
            <input required type="password" minLength={6} className={`${fieldClass} mt-1`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Role</span>
              <select className={`${fieldClass} mt-1`} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Plan</span>
              <select className={`${fieldClass} mt-1`} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="TEAM">TEAM</option>
              </select>
            </label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={creating} className={btnPrimary}>
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      ) : null}

      <form onSubmit={onSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className={fieldClass}
        />
        <button type="submit" className={btnGhost}>
          Search
        </button>
      </form>

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-alignment-accent/80">Loading…</p>
      ) : payload ? (
        <div className="mt-6 rounded-2xl bg-white overflow-hidden shadow-apple">
          <div className="px-4 py-3 bg-[#C4785A]/15 text-xs text-[#9A4F38]">
            {payload.total} {payload.total === 1 ? 'person' : 'people'}
            {submittedQ ? ` matching “${submittedQ}”` : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-alignment-accent/10">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payload.users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-alignment-accent/70">
                      No people found.
                    </td>
                  </tr>
                ) : (
                  payload.users.map((u) => (
                    <tr key={u.id} className="border-b border-alignment-accent/5 hover:bg-[#C4785A]/5">
                      <td className="px-4 py-3">
                        <Link to={`/admin/users/${u.id}`} className="font-medium text-[#9A4F38] hover:underline">
                          {u.email}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.plan}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">
                        {u.suspendedAt ? (
                          <span className="rounded-full bg-[#C45C4A]/15 px-2 py-0.5 text-xs font-medium text-[#C45C4A]">
                            Suspended
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#4A7C73]/15 px-2 py-0.5 text-xs font-medium text-[#3A635C]">
                            Active
                          </span>
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
