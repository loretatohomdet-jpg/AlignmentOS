import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { type } from '../config/siteType';
import AddToHomeScreen from '../components/AddToHomeScreen';
import { compressAvatarFile } from '../utils/compressAvatar';
import { clearSession, getAccessToken, notifyProfileUpdated } from '../utils/authSession';

function fieldClass(disabled) {
  return [
    'w-full rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all',
    disabled ? 'bg-alignment-accent/[0.04] text-alignment-accent/90 cursor-not-allowed' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Avatar({ user, className = '' }) {
  const sizeClass = className || 'w-24 h-24 sm:w-28 sm:h-28';
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [user?.avatarUrl]);

  if (user?.avatarUrl && !broken) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        onError={() => setBroken(true)}
        className={`rounded-full object-cover bg-alignment-surface ${sizeClass}`}
      />
    );
  }
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';
  return (
    <div
      className={`rounded-full bg-alignment-accent/20 text-alignment-accent font-semibold flex items-center justify-center text-xl sm:text-2xl ${sizeClass}`}
    >
      {initials}
    </div>
  );
}

function pastedAvatarValue(value) {
  const trimmed = (value || '').trim();
  if (!trimmed || trimmed.startsWith('data:')) return '';
  return trimmed;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [habitNudgeEnabled, setHabitNudgeEnabled] = useState(true);
  const [habitNudgeLocalHour, setHabitNudgeLocalHour] = useState(8);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  function utcHourToLocal(utcHour) {
    const d = new Date();
    d.setUTCHours(Number(utcHour) || 0, 0, 0, 0);
    return d.getHours();
  }

  function localHourToUtc(localHour) {
    const d = new Date();
    d.setHours(Number(localHour) || 0, 0, 0, 0);
    return d.getUTCHours();
  }

  function applyUser(next) {
    setUser(next);
    setName(next.name || '');
    setAvatarUrl(pastedAvatarValue(next.avatarUrl));
    setHabitNudgeEnabled(next.habitNudgeEnabled !== false);
    setHabitNudgeLocalHour(utcHourToLocal(next.habitNudgeHour ?? 8));
    notifyProfileUpdated();
  }

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login?returnTo=/profile', { replace: true });
      return;
    }
    axios
      .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name || '');
        setAvatarUrl(pastedAvatarValue(res.data.avatarUrl));
        setHabitNudgeEnabled(res.data.habitNudgeEnabled !== false);
        setHabitNudgeLocalHour(utcHourToLocal(res.data.habitNudgeHour ?? 8));
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login?returnTo=/profile', { replace: true });
        else setError(err.response?.data?.message || 'Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const pasted = avatarUrl.trim();
      const body = {
        name: name.trim() || undefined,
        habitNudgeEnabled,
        habitNudgeHour: localHourToUtc(habitNudgeLocalHour),
      };
      if (pasted) body.avatarUrl = pasted;
      const { data } = await axios.patch(`${API_BASE}/me`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      applyUser(data);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      const zod = err.response?.data?.errors;
      const detail =
        Array.isArray(zod) && zod.length
          ? zod.map((row) => row.message || row.path?.join('.')).filter(Boolean).join(' ')
          : null;
      setError(detail || msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const token = getAccessToken();
    if (!token) return;
    setAvatarUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const compressed = await compressAvatarFile(file);
      const fd = new FormData();
      fd.append('file', compressed);
      const { data } = await axios.post(`${API_BASE}/me/avatar`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setAvatarUrl(pastedAvatarValue(data.avatarUrl));
      notifyProfileUpdated();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not upload image.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const { data } = await axios.patch(
        `${API_BASE}/me`,
        { avatarUrl: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      applyUser(data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
        <p className="text-alignment-accent/90">Loading...</p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
        <p className="text-alignment-accent/90">Redirecting to sign in...</p>
      </div>
    );
  }

  if (!user) return null;

  const previewUser = { ...user, name, avatarUrl: user.avatarUrl };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
      <h1 className={type.h1}>Account</h1>
      <p className={`mt-2 max-w-2xl ${type.body}`}>Update your profile and preferences.</p>

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

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:gap-16">
        <form onSubmit={handleSubmit} className="min-w-0 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            <div className="shrink-0 flex flex-col items-center sm:items-start gap-3">
              <Avatar user={previewUser} />
              <p className="text-xs text-alignment-accent/90">Preview</p>
              <label className="inline-flex items-center justify-center rounded-full border border-alignment-accent/15 bg-alignment-surface px-4 py-2 text-sm font-medium text-alignment-accent cursor-pointer hover:bg-alignment-accent/[0.03]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleAvatarFile}
                  disabled={avatarUploading || saving}
                />
                {avatarUploading ? 'Uploading…' : 'Upload photo'}
              </label>
              {user.avatarUrl ? (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={saving || avatarUploading}
                  className="text-xs text-alignment-accent/80 hover:text-alignment-accent hover:underline disabled:opacity-50"
                >
                  Remove photo
                </button>
              ) : null}
              <p className="text-xs text-alignment-accent/80 text-center sm:text-left max-w-[11rem]">
                JPEG, PNG, WebP, or GIF
              </p>
            </div>

            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-alignment-accent mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass()}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-alignment-accent mb-2">
                  Email
                </label>
                <input id="email" type="email" value={user.email} disabled className={fieldClass(true)} />
                <p className="mt-1 text-xs text-alignment-accent/90">Email cannot be changed here.</p>
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-alignment-accent mb-2">
                  Or paste image URL
                </label>
                <input
                  id="avatarUrl"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className={fieldClass()}
                  placeholder="https://…"
                />
                <p className="mt-1 text-xs text-alignment-accent/90">
                  Direct <span className="whitespace-nowrap">https://</span> link to a{' '}
                  <span className="whitespace-nowrap">.jpg</span> / <span className="whitespace-nowrap">.png</span> file,
                  then Save changes.
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-alignment-accent">Plan</span>
                <p className="mt-1 text-sm text-alignment-accent/90 capitalize">{user.plan?.toLowerCase() ?? 'free'}</p>
                <Link to="/pricing" className="mt-1 inline-block text-sm text-alignment-accent hover:underline">
                  View plans
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-alignment-accent/10 bg-alignment-surface p-5 sm:p-6">
            <p className="text-sm font-medium text-alignment-accent">Daily follow-up</p>
            <p className="mt-1 text-sm text-alignment-accent/90 leading-relaxed max-w-xl">
              One email when a practice still needs holding. Same prompt as Practice. Paid plans only.
            </p>
            <label className="mt-4 flex items-start gap-3 text-sm text-alignment-accent">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-alignment-accent/30"
                checked={habitNudgeEnabled}
                onChange={(e) => setHabitNudgeEnabled(e.target.checked)}
              />
              <span>Send a follow-up on days I have not completed the hold</span>
            </label>
            <label htmlFor="nudge-hour" className="mt-4 block text-sm font-medium text-alignment-accent">
              Time
            </label>
            <select
              id="nudge-hour"
              value={habitNudgeLocalHour}
              onChange={(e) => setHabitNudgeLocalHour(Number(e.target.value))}
              disabled={!habitNudgeEnabled}
              className="mt-2 w-full max-w-xs rounded-xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent outline-none focus:ring-2 focus:ring-alignment-accent/20 disabled:opacity-50"
            >
              {Array.from({ length: 24 }, (_, hour) => {
                const label = new Date(2020, 0, 1, hour).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                });
                return (
                  <option key={hour} value={hour}>
                    {label}
                  </option>
                );
              })}
            </select>
            {!user.habitNudgeEmailReady && (
              <p className="mt-2 text-xs text-alignment-accent/80">
                Preference is saved. Emails start once transactional mail is connected on the server.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || avatarUploading}
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

        <aside className="lg:sticky lg:top-24">
          <AddToHomeScreen />
        </aside>
      </div>
    </div>
  );
}
