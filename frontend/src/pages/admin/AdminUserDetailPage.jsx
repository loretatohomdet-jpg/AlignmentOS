import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';

function headers() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [postingNote, setPostingNote] = useState(false);

  const [role, setRole] = useState('USER');
  const [plan, setPlan] = useState('FREE');
  const [suspended, setSuspended] = useState(false);

  const load = () => {
    setError(null);
    Promise.all([
      axios.get(`${API_BASE}/admin/users/${userId}`, { headers: headers() }),
      axios.get(`${API_BASE}/admin/users/${userId}/notes`, { headers: headers() }),
    ])
      .then(([uRes, nRes]) => {
        const u = uRes.data;
        setUser(u);
        setRole(u.role);
        setPlan(u.plan);
        setSuspended(!!u.suspendedAt);
        setNotes(nRes.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else if (err.response?.status === 403) setError('Admin access required.');
        else if (err.response?.status === 404) setError('User not found.');
        else setError(err.response?.data?.message || 'Failed to load user');
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
      const body = { role, plan };
      if (suspended !== !!user.suspendedAt) {
        body.suspended = suspended;
      }
      const res = await axios.patch(`${API_BASE}/admin/users/${userId}`, body, { headers: headers() });
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
      const res = await axios.post(
        `${API_BASE}/admin/users/${userId}/notes`,
        { body: trimmed },
        { headers: headers() }
      );
      setNotes((prev) => [res.data, ...prev]);
      setNoteBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add note');
    } finally {
      setPostingNote(false);
    }
  };

  if (error && !user) {
    return (
      <div>
        <Link to="/admin/users" className="text-sm text-alignment-primary hover:underline">
          ← Back to users
        </Link>
        <div className="mt-6 rounded-2xl border border-alignment-accent/15 bg-alignment-surface px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-alignment-accent/70">Loading…</p>;
  }

  return (
    <div>
      <Link to="/admin/users" className="text-sm text-alignment-primary hover:underline">
        ← Back to users
      </Link>

      <h2 className="mt-6 text-lg font-semibold text-alignment-accent">User detail</h2>
      <p className="mt-1 font-mono text-xs text-alignment-accent/50 break-all">{user.id}</p>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/50 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-5">
          <h3 className="text-sm font-semibold text-alignment-accent">Account & subscription</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-alignment-accent/50">Email</dt>
              <dd className="text-alignment-accent">{user.email}</dd>
            </div>
            <div>
              <dt className="text-alignment-accent/50">Name</dt>
              <dd className="text-alignment-accent">{user.name}</dd>
            </div>
            <div>
              <dt className="text-alignment-accent/50">Joined</dt>
              <dd className="text-alignment-accent">{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
            {user._count && (
              <>
                <div>
                  <dt className="text-alignment-accent/50">Responses</dt>
                  <dd className="text-alignment-accent tabular-nums">{user._count.responses}</dd>
                </div>
                <div>
                  <dt className="text-alignment-accent/50">Profiles</dt>
                  <dd className="text-alignment-accent tabular-nums">{user._count.alignmentProfiles}</dd>
                </div>
                <div>
                  <dt className="text-alignment-accent/50">Scores</dt>
                  <dd className="text-alignment-accent tabular-nums">{user._count.scores}</dd>
                </div>
              </>
            )}
          </dl>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-alignment-accent/55">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-alignment-accent/55">Plan</span>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mt-1 w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent"
              >
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="TEAM">TEAM</option>
              </select>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={suspended}
                onChange={(e) => setSuspended(e.target.checked)}
                className="rounded border-alignment-accent/30 text-alignment-primary focus:ring-alignment-primary"
              />
              <span className="text-sm text-alignment-accent">Suspended (cannot sign in)</span>
            </label>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="mt-6 rounded-full bg-alignment-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </section>

        <section className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-5">
          <h3 className="text-sm font-semibold text-alignment-accent">Support & moderation notes</h3>
          <p className="mt-1 text-xs text-alignment-accent/55">
            Internal-only. Visible to admins. Use for escalations, billing context, or abuse review.
          </p>

          <div className="mt-4">
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              rows={4}
              placeholder="Add a note…"
              className="w-full rounded-xl border border-alignment-accent/15 bg-alignment-foundation px-3 py-2 text-sm text-alignment-accent placeholder:text-alignment-accent/35 focus:border-alignment-primary/40 focus:outline-none focus:ring-2 focus:ring-alignment-primary/15"
            />
            <button
              type="button"
              onClick={addNote}
              disabled={postingNote || !noteBody.trim()}
              className="mt-2 rounded-full border border-alignment-accent/20 px-4 py-2 text-sm font-medium text-alignment-accent hover:bg-alignment-accent/5 disabled:opacity-50 transition-colors"
            >
              {postingNote ? 'Adding…' : 'Add note'}
            </button>
          </div>

          <ul className="mt-6 space-y-4 max-h-[420px] overflow-y-auto">
            {notes.length === 0 ? (
              <li className="text-sm text-alignment-accent/50">No notes yet.</li>
            ) : (
              notes.map((n) => (
                <li key={n.id} className="border-t border-alignment-accent/10 pt-4 first:border-0 first:pt-0">
                  <p className="text-xs text-alignment-accent/50">
                    {n.author?.name || n.author?.email || 'Admin'} ·{' '}
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-alignment-accent whitespace-pre-wrap">{n.body}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
