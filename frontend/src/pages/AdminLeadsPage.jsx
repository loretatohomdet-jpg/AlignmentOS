import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    Promise.all([
      axios.get(`${API_BASE}/admin/leads`, { headers: getAuthHeaders() }),
      axios.get(`${API_BASE}/admin/leads/count`, { headers: getAuthHeaders() }),
    ])
      .then(([leadsRes, countRes]) => {
        setLeads(leadsRes.data);
        setCount(countRes.data.count);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else setError(err.response?.data?.message || 'Failed to load leads');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/leads/export`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-alignment-accent/70">Loading...</p>
      </div>
    );
  }

  if (error && error.includes('Admin')) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-alignment-accent">
          {error}
        </div>
        <p className="mt-4 text-sm text-alignment-accent/70">
          Sign in with an admin account to view leads.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-alignment-accent tracking-tight">
            Leads
          </h2>
          <p className="mt-1 text-alignment-accent/70">
            {count} lead{count !== 1 ? 's' : ''} captured from the start lander and other sources.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || count === 0}
          className="shrink-0 rounded-full bg-alignment-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {error && !error.includes('Admin') && (
        <div className="mt-6 rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-alignment-accent/10 bg-alignment-surface overflow-hidden">
        {leads.length === 0 ? (
          <div className="px-6 py-12 text-center text-alignment-accent/70">
            No leads yet. They will appear here once someone submits the start lander or another capture form.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-alignment-accent/10 bg-alignment-surface/30">
                  <th className="px-4 py-3 font-medium text-alignment-accent">Email</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Source</th>
                  <th className="px-4 py-3 font-medium text-alignment-accent">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-alignment-accent/5 hover:bg-alignment-accent/[0.02]">
                    <td className="px-4 py-3 text-alignment-accent">{lead.email}</td>
                    <td className="px-4 py-3 text-alignment-accent/70">{lead.source || '—'}</td>
                    <td className="px-4 py-3 text-alignment-accent/70">
                      {new Date(lead.createdAt).toLocaleString()}
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
