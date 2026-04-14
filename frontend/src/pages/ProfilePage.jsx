import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

function Avatar({ user, className = '' }) {
  const sizeClass = className || 'w-20 h-20';
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`rounded-full object-cover bg-alignment-surface ${sizeClass}`}
      />
    );
  }
  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div
      className={`rounded-full bg-alignment-accent/20 text-alignment-accent font-semibold flex items-center justify-center ${sizeClass}`}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login?returnTo=/profile', { replace: true });
      return;
    }
    axios
      .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name || '');
        setAvatarUrl(res.data.avatarUrl || '');
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login?returnTo=/profile', { replace: true });
        else setError(err.response?.data?.message || 'Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const { data } = await axios.patch(
        `${API_BASE}/me`,
        { name: name.trim() || undefined, avatarUrl: avatarUrl.trim() || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      const zod = err.response?.data?.errors;
      const detail =
        Array.isArray(zod) && zod.length
          ? zod.map((e) => e.message || e.path?.join('.')).filter(Boolean).join(' ')
          : null;
      setError(detail || msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setAvatarUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await axios.post(`${API_BASE}/me/avatar`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setAvatarUrl(data.avatarUrl || '');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload image.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-alignment-accent/70">Loading...</p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="max-w-xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <p className="text-alignment-accent/70">Redirecting to sign in...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">
        Account
      </h1>
      <p className="mt-2 text-alignment-accent/70">
        Update your profile and preferences.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 rounded-2xl bg-alignment-surface border border-alignment-accent/15 px-4 py-3 text-sm text-alignment-accent">
          Profile updated.
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-8">
        <div className="shrink-0 flex flex-col items-center">
          <Avatar user={{ ...user, name, avatarUrl: avatarUrl.trim() || user.avatarUrl }} />
          <p className="mt-2 text-xs text-alignment-accent/70">Preview</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-alignment-accent mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-alignment-accent mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-accent/[0.04] px-4 py-3 text-alignment-accent/70 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-alignment-accent/70">Email cannot be changed here.</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-alignment-accent mb-2">Profile picture</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center justify-center rounded-full border border-alignment-accent/15 bg-alignment-surface px-4 py-2 text-sm font-medium text-alignment-accent cursor-pointer hover:bg-alignment-accent/[0.03]">
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleAvatarFile} disabled={avatarUploading || saving} />
                {avatarUploading ? 'Uploading…' : 'Upload photo'}
              </label>
              <span className="text-xs text-alignment-accent/60">JPEG, PNG, WebP, or GIF · max ~200KB</span>
            </div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-alignment-accent mb-2 mt-5">
              Or paste image URL
            </label>
            <input
              id="avatarUrl"
              type="text"
              inputMode="url"
              autoComplete="off"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all"
              placeholder="https://…"
            />
            <p className="mt-1 text-xs text-alignment-accent/70">
              Direct <span className="whitespace-nowrap">https://</span> link to a <span className="whitespace-nowrap">.jpg</span> /{' '}
              <span className="whitespace-nowrap">.png</span> file, then Save changes.
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-alignment-accent">Plan</span>
            <p className="mt-1 text-sm text-alignment-accent/70 capitalize">{user.plan?.toLowerCase() ?? 'free'}</p>
            <Link to="/pricing" className="mt-1 text-sm text-alignment-accent hover:underline">
              View plans
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-alignment-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-alignment-surface text-alignment-accent px-6 py-2.5 text-sm font-medium hover:bg-alignment-accent/5 transition-colors"
            >
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
