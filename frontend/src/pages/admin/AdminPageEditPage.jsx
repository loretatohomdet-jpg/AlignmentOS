import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { HOME_COPY_DEFAULTS, HOME_SECTION_FIELDS } from '../../config/homeCopy';
import { adminHeaders, apiError, btnDanger, btnGhost, btnPrimary, confirmDelete, fieldClass } from './adminShared';

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
  isSystem: false,
  sections: { ...HOME_COPY_DEFAULTS },
};

function Field({ label, value, onChange, multiline = false }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">{label}</span>
      {multiline ? (
        <textarea className={`${fieldClass} mt-1`} rows={3} value={value} onChange={onChange} />
      ) : (
        <input className={`${fieldClass} mt-1`} value={value} onChange={onChange} />
      )}
    </label>
  );
}

export default function AdminPageEditPage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const isHome = form.path === '/';

  const sectionGroups = useMemo(() => {
    const groups = [];
    for (const field of HOME_SECTION_FIELDS) {
      const last = groups[groups.length - 1];
      if (!last || last.name !== field.group) groups.push({ name: field.group, fields: [field] });
      else last.fields.push(field);
    }
    return groups;
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/pages/${pageId}`, { headers: adminHeaders() })
      .then((res) => {
        const p = res.data;
        const savedSections = p.sections && typeof p.sections === 'object' ? p.sections : {};
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
          isSystem: Boolean(p.isSystem),
          sections: { ...HOME_COPY_DEFAULTS, ...savedSections },
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(apiError(err, 'Could not load page'));
      })
      .finally(() => setLoaded(true));
  }, [pageId, navigate]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const setSection = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { isSystem, sections, ...rest } = form;
      const payload = isHome
        ? {
            ...rest,
            sections: Object.fromEntries(
              Object.entries(sections).map(([key, value]) => [key, String(value ?? '').trim()])
            ),
          }
        : rest;
      await axios.patch(`${API_BASE}/admin/pages/${pageId}`, payload, { headers: adminHeaders() });
      setSaved(true);
    } catch (err) {
      setError(apiError(err, 'Could not save page'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (form.isSystem || form.path === '/') return;
    if (!confirmDelete(`“${form.title}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/pages/${pageId}`, { headers: adminHeaders() });
      navigate('/admin/pages');
    } catch (err) {
      setError(apiError(err, 'Could not delete page'));
    }
  };

  if (!loaded) return <p className="text-alignment-accent/80">Loading…</p>;

  return (
    <div>
      <Link to="/admin/pages" className="text-sm text-[#5A4A78] hover:underline">
        ← All pages
      </Link>
      <h2 className="mt-4 font-display text-2xl text-[#5A4A78]">{isHome ? 'Edit homepage' : 'Edit page'}</h2>
      <p className="mt-2 text-sm text-alignment-accent/75 max-w-2xl">
        {isHome
          ? 'Every visible word on the homepage lives here. Change it, save, then view live.'
          : 'These fields are the words on the public page: kicker, headline, subhead, body, and the button. Save, then view live.'}
      </p>

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}
      {saved ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#3A635C]">Saved. The live page will show this copy.</p> : null}

      <form onSubmit={save} className="mt-6 space-y-6 max-w-2xl">
        <div className="rounded-2xl bg-white p-5 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A4A78]">Admin</p>
          <Field label="Title in Admin" value={form.title} onChange={set('title')} />
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">URL path</span>
            <input
              required
              className={`${fieldClass} mt-1`}
              value={form.path}
              onChange={set('path')}
              disabled={form.isSystem}
            />
            {form.isSystem ? (
              <span className="mt-1 block text-xs text-alignment-accent/60">Core page URLs stay fixed so the site does not break.</span>
            ) : null}
          </label>
        </div>

        <div className="rounded-2xl bg-white p-5 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A4A78]">
            {isHome ? 'Hero' : 'Page copy'}
          </p>
          {!isHome ? <Field label="Kicker (small line above the headline)" value={form.eyebrow} onChange={set('eyebrow')} /> : null}
          <Field label="Headline" value={form.headline} onChange={set('headline')} />
          <Field label="Subhead" value={form.subhead} onChange={set('subhead')} />
          <Field
            label={isHome ? 'Line under the buttons' : 'Body'}
            value={form.body}
            onChange={set('body')}
            multiline={!isHome}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Primary button label" value={form.ctaLabel} onChange={set('ctaLabel')} />
            <Field label="Primary button link" value={form.ctaHref} onChange={set('ctaHref')} />
          </div>
        </div>

        {isHome
          ? sectionGroups.map((group) => (
              <div key={group.name} className="rounded-2xl bg-white p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A4A78]">{group.name}</p>
                {group.fields.map((field) => (
                  <Field
                    key={field.key}
                    label={field.label}
                    value={form.sections[field.key] ?? ''}
                    onChange={setSection(field.key)}
                    multiline={Boolean(field.multiline)}
                  />
                ))}
              </div>
            ))
          : null}

        <div className="rounded-2xl bg-white p-5 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} />
            <span className="text-sm">Published (visible on the site)</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? 'Saving…' : 'Save page'}
            </button>
            <a href={form.path || '/'} className={btnGhost} target="_blank" rel="noreferrer">
              View live
            </a>
            {form.isSystem || form.path === '/' ? null : (
              <button type="button" onClick={remove} className={btnDanger}>
                Delete page
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
