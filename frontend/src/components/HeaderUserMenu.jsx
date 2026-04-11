import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

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
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    axios
      .get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem('accessToken');
    onLogout();
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (!isLoggedIn) {
    return null;
  }

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
      {dropdownOpen && (
        <div
          className="absolute right-0 top-full mt-1 py-1 w-56 rounded-2xl bg-alignment-surface border border-alignment-accent/10 shadow-apple-lg z-50 animate-fade-in"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-alignment-accent/5">
            <div className="flex items-center gap-3">
              <HeaderAvatar user={user} className="w-10 h-10" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-alignment-accent truncate">
                  {user?.name || 'Account'}
                </p>
                <p className="text-xs text-alignment-accent/70 truncate">{user?.email}</p>
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
        </div>
      )}
    </div>
  );
}
