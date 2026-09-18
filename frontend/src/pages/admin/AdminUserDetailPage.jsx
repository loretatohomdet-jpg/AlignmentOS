import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnGhost, btnPrimary, confirmDelete, fieldClass } from './adminShared';

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [postingNote, setPostingNote] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [plan, setPlan] = useState('FREE');
  const [suspended, setSuspended] = useState(false);

  const load = () => {
    setError(null);
    Promise.all([
      axios.get(`${API_BASE}/admin/users/${userId}`, { headers: adminHeaders() }),
      axios.get(`${API_BASE}/admin/users/${userId}/notes`, { headers: adminHeaders() }),
    ])
      .then(([uRes, nRes]) => {
        const u = uRes.data;
        setUser(u);
        setName(u.name || '');
        setRole(u.role);
        setPlan(u.plan);
        setSuspended(!!u.suspendedAt);
        setNotes(nRes.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 404) setError('Person not found.');
        else setError(err.response?.data?.message || 'Could not load this person');
      });
  };

  useEffect(() => {
    load();
  }, [userId, navigate]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const body = { name, role, plan };
      if (suspended !== !!user.suspendedAt) body.suspended = suspended;
      const res = await axios.patch(`${API_BASE}/admin/users/${userId}`, body, { headers: adminHeaders() });
      setUser(res.data);
      setSuspended(!!res.data.suspendedAt);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    const trimmed = noteBody.trim();
    if (!trimmed) return;
    setPostingNote(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/users/${userId}/notes`, { body: trimmed }, { headers: adminHeaders() });
      setNotes((prev) => [res.data, ...prev]);
      setNoteBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add note');
    } finally {
      setPostingNote(false);
    }
  };

  const removeNote = async (noteId) => {
    if (!confirmDelete('this note')) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${userId}/notes/${noteId}`, { headers: adminHeaders() });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete note');
    }
  };

  const removeUser = async () => {
    if (!confirmDelete(`${user.email}`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${userId}`, { headers: adminHeaders() });
      navigate('/admin/users', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this person');
    }
  };

  if (error && !user) {
    return (
      <div>
        <Link to="/admin/users" className="text-sm text-[#9A4F38] hover:underline">
          ← People
        </Link>
        <p className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p>
      </div>
    );
  }

  if (!user) return <p className="text-alignment-accent/80">Loading…</p>;

  return (
    <div>
      <Link to="/admin/users" className="text-sm text-[#9A4F38] hover:underline">
        ← People
      </Link>
      <h2 className="mt-4 font-display text-2xl text-[#9A4F38]">{user.name || user.email}</h2>
      <p className="mt-1 text-sm text-alignment-accent/70">{user.email}</p>

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-apple">
          <h3 className="font-medium text-alignment-accent">Account</h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Name</span>
              <input className={`${fieldClass} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Role</span>
              <select className={`${fieldClass} mt-1`} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#9A4F38]">Plan</span>
              <select className={`${fieldClass} mt-1`} value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="TEAM">TEAM</option>
              </select>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={suspended} onChange={(e) => setSuspended(e.target.checked)} />
              <span className="text-sm">Suspended (cannot sign in)</span>
            </label>
          </div>
          {user._count ? (
            <p className="mt-4 text-xs text-alignment-accent/70">
              {user._count.responses} answers · {user._count.alignmentProfiles} profiles · {user._count.scores} scores
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={saveProfile} disabled={saving} className={btnPrimary}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={removeUser} className={btnDanger}>
              Delete person
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-[#C4785A]/10 p-5">
          <h3 className="font-medium text-alignment-accent">Notes</h3>
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            rows={3}
            placeholder="Add a note…"
            className={`${fieldClass} mt-4`}
          />
          <button type="button" onClick={addNote} disabled={postingNote || !noteBody.trim()} className={`${btnGhost} mt-2`}>
            {postingNote ? 'Adding…' : 'Add note'}
          </button>
          <ul className="mt-6 space-y-4 max-h-[420px] overflow-y-auto">
            {notes.length === 0 ? (
              <li className="text-sm text-alignment-accent/70">No notes yet.</li>
            ) : (
              notes.map((n) => (
                <li key={n.id} className="border-t border-[#C4785A]/20 pt-3">
                  <p className="text-xs text-alignment-accent/65">
                    {n.author?.name || n.author?.email || 'Admin'} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{n.body}</p>
                  <button type="button" onClick={() => removeNote(n.id)} className="mt-2 text-xs text-[#C45C4A] hover:underline">
                    Delete note
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
