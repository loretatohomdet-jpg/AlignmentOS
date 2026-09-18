import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { adminHeaders, btnDanger, btnPrimary, confirmDelete, fieldClass } from './admin/adminShared';

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: '', source: 'admin' });

  const load = () => {
    Promise.all([
      axios.get(`${API_BASE}/admin/leads`, { headers: adminHeaders() }),
      axios.get(`${API_BASE}/admin/leads/count`, { headers: adminHeaders() }),
    ])
      .then(([leadsRes, countRes]) => {
        setLeads(leadsRes.data);
        setCount(countRes.data.count);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load inbox');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [navigate]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/leads/export`, { headers: adminHeaders() });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const createLead = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/leads`, form, { headers: adminHeaders() });
      setLeads((prev) => [res.data, ...prev]);
      setCount((n) => n + 1);
      setForm({ email: '', source: 'admin' });
      setShowCreate(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add lead');
    } finally {
      setCreating(false);
    }
  };

  const removeLead = async (lead) => {
    if (!confirmDelete(lead.email)) return;
    try {
      await axios.delete(`${API_BASE}/admin/leads/${lead.id}`, { headers: adminHeaders() });
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setCount((n) => Math.max(0, n - 1));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete lead');
    }
  };

  if (loading) return <p className="text-alignment-accent/80">Loading inbox…</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#8A7030]">Inbox</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">
            {count} lead{count !== 1 ? 's' : ''} from the site. Add, export, or remove.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
            {showCreate ? 'Close' : 'Add a lead'}
          </button>
          <button type="button" onClick={handleExport} disabled={exporting || count === 0} className={btnPrimary}>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {showCreate ? (
        <form onSubmit={createLead} className="mt-6 rounded-2xl bg-[#C4A35A]/15 p-5 grid gap-3 sm:grid-cols-2 max-w-xl">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8A7030]">Email</span>
            <input required type="email" className={`${fieldClass} mt-1`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8A7030]">Source</span>
            <input className={`${fieldClass} mt-1`} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={creating} className={btnPrimary}>
              {creating ? 'Adding…' : 'Create'}
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      <div className="mt-6 rounded-2xl bg-white overflow-hidden shadow-apple">
        {leads.length === 0 ? (
          <div className="px-6 py-12 text-center text-alignment-accent/70">No leads yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#C4A35A]/20">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium"> </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-alignment-accent/5">
                    <td className="px-4 py-3">{lead.email}</td>
                    <td className="px-4 py-3 text-alignment-accent/75">{lead.source || '—'}</td>
                    <td className="px-4 py-3 text-alignment-accent/75">{new Date(lead.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => removeLead(lead)} className={btnDanger}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
