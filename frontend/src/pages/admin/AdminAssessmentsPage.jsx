import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnPrimary, confirmDelete, fieldClass } from './adminShared';

export default function AdminAssessmentsPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', isActive: true });

  const load = () => {
    axios
      .get(`${API_BASE}/admin/assessments`, { headers: adminHeaders() })
      .then((res) => setList(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load assessments');
      })
      .finally(() => setLoaded(true));
  };

  useEffect(() => {
    load();
  }, [navigate]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE}/admin/assessments`,
        { title: form.title, description: form.description || null, isActive: form.isActive },
        { headers: adminHeaders() }
      );
      setShowCreate(false);
      setForm({ title: '', description: '', isActive: true });
      navigate(`/admin/assessments/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create assessment');
    } finally {
      setCreating(false);
    }
  };

  const remove = async (assessment) => {
    if (!confirmDelete(`“${assessment.title}” and its questions`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/assessments/${assessment.id}`, { headers: adminHeaders() });
      setList((prev) => prev.filter((a) => a.id !== assessment.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete assessment');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#3A635C]">Assessment</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">Create a new one, open it to edit questions, or remove it.</p>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
          {showCreate ? 'Close' : 'New assessment'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={create} className="mt-6 rounded-2xl bg-[#4A7C73]/12 p-5 space-y-3 max-w-xl">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#3A635C]">Title</span>
            <input required className={`${fieldClass} mt-1`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#3A635C]">Description</span>
            <textarea className={`${fieldClass} mt-1`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
          <button type="submit" disabled={creating} className={btnPrimary}>
            {creating ? 'Creating…' : 'Create'}
          </button>
        </form>
      ) : null}

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      {!loaded ? (
        <p className="mt-8 text-alignment-accent/80">Loading…</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.length === 0 ? (
            <li className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-alignment-accent/70">No assessments yet.</li>
          ) : (
            list.map((a) => (
              <li key={a.id} className="rounded-2xl bg-white p-5 shadow-apple flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-alignment-accent">{a.title}</p>
                  <p className="mt-1 text-xs text-alignment-accent/70">
                    {a._count?.questions ?? 0} questions · {a._count?.responses ?? 0} answers ·{' '}
                    {a.isActive ? (
                      <span className="text-[#3A635C] font-medium">Active</span>
                    ) : (
                      <span>Inactive</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/assessments/${a.id}`} className={btnPrimary}>
                    Edit
                  </Link>
                  <button type="button" onClick={() => remove(a)} className={btnDanger}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
