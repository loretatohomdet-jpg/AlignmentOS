import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnGhost, btnPrimary, confirmDelete, fieldClass } from './adminShared';

const empty = {
  name: '',
  path: '',
  kicker: '',
  tagline: '',
  body: '',
  image: '',
  digitalPrice: '',
  printPrice: '',
  digitalUrl: '',
  printUrl: '',
  isPublished: true,
  sortOrder: 100,
};

export default function AdminShopEditPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/shop/${offerId}`, { headers: adminHeaders() })
      .then((res) => {
        const o = res.data;
        setForm({
          name: o.name || '',
          path: o.path || '',
          kicker: o.kicker || '',
          tagline: o.tagline || '',
          body: o.body || '',
          image: o.image || '',
          digitalPrice: o.digitalPrice ?? '',
          printPrice: o.printPrice ?? '',
          digitalUrl: o.digitalUrl || '',
          printUrl: o.printUrl || '',
          isPublished: o.isPublished,
          sortOrder: o.sortOrder ?? 100,
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load product');
      })
      .finally(() => setLoaded(true));
  }, [offerId, navigate]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const payload = () => ({
    ...form,
    digitalPrice: form.digitalPrice === '' ? null : Number(form.digitalPrice),
    printPrice: form.printPrice === '' ? null : Number(form.printPrice),
    sortOrder: Number(form.sortOrder) || 100,
  });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE}/admin/shop/${offerId}`, payload(), { headers: adminHeaders() });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete(`“${form.name}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/shop/${offerId}`, { headers: adminHeaders() });
      navigate('/admin/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product');
    }
  };

  if (!loaded) return <p className="text-alignment-accent/80">Loading…</p>;

  return (
    <div>
      <Link to="/admin/shop" className="text-sm text-[#8E4A4A] hover:underline">
        ← All products
      </Link>
      <h2 className="mt-4 font-display text-2xl text-[#8E4A4A]">Edit product</h2>

      {error ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#C45C4A]">{error}</p> : null}

      <form onSubmit={save} className="mt-6 rounded-2xl bg-white p-5 space-y-3 max-w-2xl">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Name</span>
          <input required className={`${fieldClass} mt-1`} value={form.name} onChange={set('name')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">URL path</span>
          <input required className={`${fieldClass} mt-1`} value={form.path} onChange={set('path')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Kicker</span>
          <input className={`${fieldClass} mt-1`} value={form.kicker} onChange={set('kicker')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Tagline</span>
          <input className={`${fieldClass} mt-1`} value={form.tagline} onChange={set('tagline')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Body</span>
          <textarea className={`${fieldClass} mt-1`} rows={4} value={form.body} onChange={set('body')} />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Digital $</span>
            <input type="number" min="0" className={`${fieldClass} mt-1`} value={form.digitalPrice} onChange={set('digitalPrice')} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Print $</span>
            <input type="number" min="0" className={`${fieldClass} mt-1`} value={form.printPrice} onChange={set('printPrice')} />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Digital checkout URL</span>
          <input className={`${fieldClass} mt-1`} value={form.digitalUrl} onChange={set('digitalUrl')} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Print checkout URL</span>
          <input className={`${fieldClass} mt-1`} value={form.printUrl} onChange={set('printUrl')} />
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} />
          <span className="text-sm">Published (visible in the shop)</span>
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : 'Save product'}
          </button>
          <a href={form.path} className={btnGhost} target="_blank" rel="noreferrer">
            View live
          </a>
          <button type="button" onClick={remove} className={btnDanger}>
            Delete product
          </button>
        </div>
      </form>
    </div>
  );
}
