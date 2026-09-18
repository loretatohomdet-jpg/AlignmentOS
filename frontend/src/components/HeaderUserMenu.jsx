import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { clearSession, getAccessToken, PROFILE_EVENT } from '../utils/authSession';

function HeaderAvatar({ user, className = 'w-8 h-8' }) {
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`rounded-full object-cover bg-alignment-surface ${className}`}
      />
    );
  }
  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div
      className={`rounded-full bg-alignment-accent/20 text-alignment-accent font-semibold flex items-center justify-center text-sm ${className}`}
    >
      {initials}
    </div>
  );
}

export default function HeaderUserMenu({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 8 });
  const menuRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return undefined;
    }
    const load = () => {
      const token = getAccessToken();
      if (!token) return;
      axios
        .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch((err) => {
          if (err.response?.status === 401 || err.response?.status === 403) {
            clearSession();
            setUser(null);
          }
        });
    };
    load();
    window.addEventListener(PROFILE_EVENT, load);
    return () => window.removeEventListener(PROFILE_EVENT, load);
  }, [isLoggedIn]);

  useLayoutEffect(() => {
    if (!dropdownOpen || !menuRef.current) return undefined;
    const place = () => {
      const r = menuRef.current.getBoundingClientRect();
      setPanelPos({
        top: Math.round(r.bottom + 6),
        right: Math.round(Math.max(8, window.innerWidth - r.right)),
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return undefined;
    function handlePointerDown(e) {
      if (menuRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setDropdownOpen(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    clearSession();
    onLogout?.();
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (!isLoggedIn) {
    return null;
  }

  const menu = dropdownOpen && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={panelRef}
          className="fixed z-[80] py-1 w-56 rounded-2xl bg-alignment-surface border border-alignment-accent/10 shadow-apple-lg animate-fade-in"
          style={{ top: panelPos.top, right: panelPos.right }}
          role="menu"
        >
          <div className="px-4 py-3 border-b border-alignment-accent/5">
            <div className="flex items-center gap-3">
              <HeaderAvatar user={user} className="w-10 h-10" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-alignment-accent truncate">
                  {user?.name || 'Account'}
                </p>
                <p className="text-xs text-alignment-accent/90 truncate">{user?.email}</p>
              </div>
            </div>
            <NavLink
              to="/profile"
              className="mt-2 block text-xs font-medium text-alignment-accent hover:underline"
              onClick={() => setDropdownOpen(false)}
            >
              Change name & photo →
            </NavLink>
          </div>
          <div className="py-1">
            <NavLink
              to="/dashboard"
              className="block px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
              onClick={() => setDropdownOpen(false)}
              role="menuitem"
            >
              Dashboard
            </NavLink>
            {user?.role === 'ADMIN' ? (
              <NavLink
                to="/admin/overview"
                className="block px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
                onClick={() => setDropdownOpen(false)}
                role="menuitem"
              >
                Admin
              </NavLink>
            ) : null}
            <NavLink
              to="/alignment-map"
              className="block px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
              onClick={() => setDropdownOpen(false)}
              role="menuitem"
            >
              Alignment map
            </NavLink>
            <NavLink
              to="/journey"
              className="block px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
              onClick={() => setDropdownOpen(false)}
              role="menuitem"
            >
              Archive
            </NavLink>
            <NavLink
              to="/profile"
              className="block px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
              onClick={() => setDropdownOpen(false)}
              role="menuitem"
            >
              Account settings
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
              role="menuitem"
            >
              Log out
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative flex items-center gap-2 ml-2" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-alignment-accent/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-alignment-accent/50"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <HeaderAvatar user={user} />
      </button>
      {menu}
    </div>
  );
}
