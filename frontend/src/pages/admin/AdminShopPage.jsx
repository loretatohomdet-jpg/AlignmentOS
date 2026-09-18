import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/apiBase';
import { adminHeaders, btnDanger, btnPrimary, confirmDelete, fieldClass } from './adminShared';

export default function AdminShopPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', path: '/shop/', digitalPrice: '', printPrice: '' });

  const load = () => {
    axios
      .get(`${API_BASE}/admin/shop`, { headers: adminHeaders() })
      .then((res) => setList(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login', { replace: true });
        else setError(err.response?.data?.message || 'Could not load shop');
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
        `${API_BASE}/admin/shop`,
        {
          name: form.name,
          path: form.path,
          digitalPrice: form.digitalPrice ? Number(form.digitalPrice) : null,
          printPrice: form.printPrice ? Number(form.printPrice) : null,
        },
        { headers: adminHeaders() }
      );
      setShowCreate(false);
      setForm({ name: '', path: '/shop/', digitalPrice: '', printPrice: '' });
      navigate(`/admin/shop/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create product');
    } finally {
      setCreating(false);
    }
  };

  const remove = async (offer) => {
    if (!confirmDelete(`“${offer.name}”`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/shop/${offer.id}`, { headers: adminHeaders() });
      setList((prev) => prev.filter((o) => o.id !== offer.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[#8E4A4A]">Shop</h2>
          <p className="mt-1 text-sm text-alignment-accent/75">Create, edit prices and copy, or remove a product.</p>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className={btnPrimary}>
          {showCreate ? 'Close' : 'New product'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={create} className="mt-6 rounded-2xl bg-[#B56B6B]/12 p-5 space-y-3 max-w-xl">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Name</span>
            <input required className={`${fieldClass} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">URL path</span>
            <input required className={`${fieldClass} mt-1`} value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Digital $</span>
              <input type="number" min="0" className={`${fieldClass} mt-1`} value={form.digitalPrice} onChange={(e) => setForm({ ...form, digitalPrice: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8E4A4A]">Print $</span>
              <input type="number" min="0" className={`${fieldClass} mt-1`} value={form.printPrice} onChange={(e) => setForm({ ...form, printPrice: e.target.value })} />
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
          {list.map((offer) => (
            <li key={offer.id} className="rounded-2xl bg-white p-5 shadow-apple flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-alignment-accent">{offer.name}</p>
                <p className="mt-1 text-xs text-alignment-accent/70">
                  {offer.path}
                  {offer.digitalPrice != null ? ` · Digital $${offer.digitalPrice}` : ''}
                  {offer.printPrice != null ? ` · Print $${offer.printPrice}` : ''}
                  {offer.isPublished ? '' : ' · Hidden'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/shop/${offer.id}`} className={btnPrimary}>
                  Edit
                </Link>
                <button type="button" onClick={() => remove(offer)} className={btnDanger}>
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
