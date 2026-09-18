import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnGhost, btnPrimary, confirmDelete, fieldClass } from './adminShared';

const empty = {
  title: '',
  path: '',
  pageGroup: 'custom',
  eyebrow: '',
  headline: '',
  subhead: '',
  body: '',
  ctaLabel: '',
  ctaHref: '',
  isPublished: true,
};

export default function AdminPageEditPage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/pages/${pageId}`, { headers: adminHeaders() })
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title || '',
          path: p.path || '',
          pageGroup: p.pageGroup || 'custom',
          eyebrow: p.eyebrow || '',
          headline: p.headline || '',
          subhead: p.subhead || '',
          body: p.body || '',
          ctaLabel: p.ctaLabel || '',
          ctaHref: p.ctaHref || '',
          isPublished: p.isPublished,
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load page');
      })
      .finally(() => setLoaded(true));
  }, [pageId, navigate]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE}/admin/pages/${pageId}`, form, { headers: adminHeaders() });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save page');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete(`“${form.title}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/pages/${pageId}`, { headers: adminHeaders() });
      navigate('/admin/pages');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete page');
    }
  };

  if (!loaded) return <p className="text-alignment-accent/80">Loading…</p>;

  return (
    <div>
      <Link to="/admin/pages" className="text-sm text-[#5A4A78] hover:underline">
        ← All pages
      </Link>
      <h2 className="mt-4 font-display text-2xl text-[#5A4A78]">Edit page</h2>

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      <form onSubmit={save} className="mt-6 rounded-2xl bg-white p-5 space-y-3 max-w-2xl">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Title</span>
          <input required className={`${fieldClass} mt-1`} value={form.title} onChange={set('title')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">URL path</span>
          <input required className={`${fieldClass} mt-1`} value={form.path} onChange={set('path')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Eyebrow</span>
          <input className={`${fieldClass} mt-1`} value={form.eyebrow} onChange={set('eyebrow')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Headline</span>
          <input className={`${fieldClass} mt-1`} value={form.headline} onChange={set('headline')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Subhead</span>
          <input className={`${fieldClass} mt-1`} value={form.subhead} onChange={set('subhead')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Body</span>
          <textarea className={`${fieldClass} mt-1`} rows={5} value={form.body} onChange={set('body')} />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Button label</span>
            <input className={`${fieldClass} mt-1`} value={form.ctaLabel} onChange={set('ctaLabel')} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">Button link</span>
            <input className={`${fieldClass} mt-1`} value={form.ctaHref} onChange={set('ctaHref')} />
          </label>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} />
          <span className="text-sm">Published (visible on the site)</span>
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : 'Save page'}
          </button>
          <a href={form.path} className={btnGhost} target="_blank" rel="noreferrer">
            View live
          </a>
          <button type="button" onClick={remove} className={btnDanger}>
            Delete page
          </button>
        </div>
      </form>
    </div>
  );
}
