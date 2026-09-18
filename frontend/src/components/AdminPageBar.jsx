import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { adminHeaders } from '../pages/admin/adminShared';
import { getAccessToken, useAuthSession } from '../utils/authSession';

export default function AdminPageBar() {
  const location = useLocation();
  const isLoggedIn = useAuthSession();
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(null);
  const [creating, setCreating] = useState(false);

  const onAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isLoggedIn || onAdmin) {
      setRole(null);
      return undefined;
    }
    const token = getAccessToken();
    if (!token) return undefined;
    let cancelled = false;
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setRole(data?.role ?? null);
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, onAdmin, location.pathname]);

  useEffect(() => {
    if (role !== 'ADMIN' || onAdmin) {
      setPage(null);
      return undefined;
    }
    let cancelled = false;
    axios
      .get(`${API_BASE}/public/pages/by-path`, { params: { path: location.pathname } })
      .then((res) => {
        if (!cancelled) setPage(res.data);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [role, onAdmin, location.pathname]);

  if (role !== 'ADMIN' || onAdmin) return null;

  const claimPage = async () => {
    setCreating(true);
    try {
      const title = location.pathname === '/' ? 'Home' : location.pathname.replace(/^\//, '');
      const res = await axios.post(
        `${API_BASE}/admin/pages`,
        { title, path: location.pathname, pageGroup: 'custom', isPublished: true },
        { headers: adminHeaders() }
      );
      window.location.href = `/admin/pages/${res.data.id}`;
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-40 border-b border-[#6B5B8A]/20 bg-[#6B5B8A] text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 py-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">Admin</span>
        <span className="text-white/75">This page</span>
        {page ? (
          <Link
            to={`/admin/pages/${page.id}`}
            className="rounded-full bg-white text-[#5A4A78] px-3 py-1 text-xs font-medium hover:bg-white/90"
          >
            Edit copy
          </Link>
        ) : (
          <button
            type="button"
            onClick={claimPage}
            disabled={creating}
            className="rounded-full bg-white text-[#5A4A78] px-3 py-1 text-xs font-medium hover:bg-white/90 disabled:opacity-50"
          >
            {creating ? 'Opening…' : 'Add to desk'}
          </button>
        )}
        <Link to="/admin/pages" className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium hover:bg-white/10">
          All pages
        </Link>
        <Link to="/admin/shop" className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium hover:bg-white/10">
          Shop
        </Link>
      </div>
    </div>
  );
}
