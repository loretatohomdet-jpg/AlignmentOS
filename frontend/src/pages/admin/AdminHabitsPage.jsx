import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnPrimary, confirmDelete, fieldClass, PILLAR_CHIP } from './adminShared';

const PILLARS = ['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'];

const blank = { title: '', description: '', pillar: 'IDENTITY', level: 1 };

export default function AdminHabitsPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState(blank);

  const load = () => {
    axios
      .get(`${API_BASE}/admin/habits`, { headers: adminHeaders() })
      .then((res) => setList(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load habits');
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
      const res = await axios.post(`${API_BASE}/admin/habits`, { ...form, level: Number(form.level) || 1 }, { headers: adminHeaders() });
      setList((prev) => [...prev, { ...res.data, _count: { activeHabits: 0 } }]);
      setForm(blank);
      setShowCreate(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create habit');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setEdit({
      title: habit.title,
      description: habit.description || '',
      pillar: habit.pillar,
      level: habit.level,
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/habits/${editingId}`,
        { ...edit, level: Number(edit.level) || 1 },
        { headers: adminHeaders() }
      );
      setList((prev) => prev.map((h) => (h.id === editingId ? { ...h, ...res.data } : h)));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save habit');
    }
  };

  const remove = async (habit) => {
    if (!confirmDelete(`“${habit.title}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/habits/${habit.id}`, { headers: adminHeaders() });
      setList((prev) => prev.filter((h) => h.id !== habit.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete habit');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#3F5C6B]">Practice</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">Create, edit, or remove habits used in the rooms.</p>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
          {showCreate ? 'Close' : 'New habit'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={create} className="mt-6 rounded-2xl bg-[#5A7A8C]/12 p-5 space-y-3 max-w-xl">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#3F5C6B]">Title</span>
            <input required className={`${fieldClass} mt-1`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#3F5C6B]">Description</span>
            <textarea className={`${fieldClass} mt-1`} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#3F5C6B]">Domain</span>
              <select className={`${fieldClass} mt-1`} value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })}>
                {PILLARS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#3F5C6B]">Level</span>
              <input type="number" min="1" max="9" className={`${fieldClass} mt-1`} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            </label>
          </div>
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
          {list.map((habit) => (
            <li key={habit.id} className="rounded-2xl bg-white p-5 shadow-apple">
              {editingId === habit.id ? (
                <form onSubmit={saveEdit} className="space-y-3">
                  <input required className={fieldClass} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                  <textarea className={fieldClass} rows={2} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <select className={fieldClass} value={edit.pillar} onChange={(e) => setEdit({ ...edit, pillar: e.target.value })}>
                      {PILLARS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <input type="number" min="1" max="9" className={fieldClass} value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className={btnPrimary}>Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-sm text-alignment-accent/70">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-alignment-accent">{habit.title}</p>
                    <p className="mt-1 text-xs text-alignment-accent/70">
                      <span className={`rounded-full px-2 py-0.5 ${PILLAR_CHIP[habit.pillar] || ''}`}>{habit.pillar}</span>
                      <span className="ml-2">Level {habit.level}</span>
                      {habit._count?.activeHabits ? ` · ${habit._count.activeHabits} assigned` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => startEdit(habit)} className={btnPrimary}>
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(habit)} className={btnDanger}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
