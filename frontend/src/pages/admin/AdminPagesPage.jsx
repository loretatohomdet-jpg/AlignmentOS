import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnGhost, btnPrimary, confirmDelete, fieldClass } from './adminShared';

export default function AdminPagesPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', path: '', headline: '' });

  const load = () => {
    axios
      .get(`${API_BASE}/admin/pages`, { headers: adminHeaders() })
      .then((res) => setList(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load pages');
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
        `${API_BASE}/admin/pages`,
        { title: form.title, path: form.path || `/${form.title}`, headline: form.headline || form.title },
        { headers: adminHeaders() }
      );
      setShowCreate(false);
      setForm({ title: '', path: '', headline: '' });
      navigate(`/admin/pages/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create page');
    } finally {
      setCreating(false);
    }
  };

  const remove = async (page) => {
    if (!confirmDelete(`“${page.title}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/pages/${page.id}`, { headers: adminHeaders() });
      setList((prev) => prev.filter((p) => p.id !== page.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete page');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#5A4A78]">Pages</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">
            Edit the copy on every site page, create a new one, or remove it.
          </p>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
          {showCreate ? 'Close' : 'New page'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={create} className="mt-6 rounded-2xl bg-[#6B5B8A]/12 p-5 space-y-3 max-w-xl">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Title</span>
            <input required className={`${fieldClass} mt-1`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">URL path</span>
            <input className={`${fieldClass} mt-1`} placeholder="/my-page" value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Headline</span>
            <input className={`${fieldClass} mt-1`} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
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
          {list.map((page) => (
            <li key={page.id} className="rounded-2xl bg-white p-5 shadow-apple flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-alignment-accent">{page.title}</p>
                <p className="mt-1 text-xs text-alignment-accent/70">
                  {page.path} · {page.pageGroup}
                  {page.isPublished ? '' : ' · Hidden'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={page.path} className={btnGhost} target="_blank" rel="noreferrer">
                  View
                </a>
                <Link to={`/admin/pages/${page.id}`} className={btnPrimary}>
                  Edit
                </Link>
                <button type="button" onClick={() => remove(page)} className={btnDanger}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
