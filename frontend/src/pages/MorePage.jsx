import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AddToHomeScreen from '../components/AddToHomeScreen';
import { courseLibraryUrl } from '../config/externalLinks';
import { API_BASE } from '../config/apiBase';
import { getAccessToken } from '../utils/authSession';
import { usePageTitle } from '../hooks/usePageTitle';
import { type } from '../config/siteType';

const rowClass =
  'flex w-full items-center justify-between gap-4 py-4 text-left border-b border-alignment-accent/[0.08] last:border-0 hover:text-alignment-primary transition-colors';

function Row({ to, href, onClick, label, note }) {
  const inner = (
    <>
      <span className="text-[15px] text-alignment-accent">{label}</span>
      {note ? <span className="text-[13px] text-alignment-accent/70">{note}</span> : null}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {inner}
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} className={rowClass} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={rowClass}>
      {inner}
    </Link>
  );
}

export default function MorePage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  usePageTitle('More — Alignment OS');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return undefined;
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setIsAdmin(data?.role === 'ADMIN'))
      .catch(() => setIsAdmin(false));
    return undefined;
  }, []);

  const signOut = () => {
    try {
      localStorage.removeItem('accessToken');
    } catch (_) {}
    window.dispatchEvent(new Event('alignment-auth'));
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-10 sm:pt-12">
      <p className={type.kicker}>Account</p>
      <h1 className={`mt-4 ${type.h1}`}>
        More, quietly.
      </h1>
      <p className={`mt-3 ${type.body}`}>
        Settings, the record, and the door out.
      </p>

      <div className="mt-10 border-t border-alignment-accent/[0.08]">
        <Row to="/profile" label="Profile" note="Name & photo" />
        <Row to="/alignment-map" label="Alignment map" note="Six domains" />
        <Row to="/results" label="Results" note="Your score" />
        <Row to="/journey" label="Archive" note="What you have written" />
        <Row onClick={signOut} label="Sign out" />
      </div>

      <p className={`mt-10 ${type.kicker}`}>The system</p>
      <div className="mt-3 border-t border-alignment-accent/[0.08]">
        {isAdmin ? <Row to="/admin/overview" label="Admin" note="Operators" /> : null}
        <Row to="/planner" label="Planner" />
        <Row to="/shop" label="Tools" note="Reset, Clarity, Quarterly Review, planner" />
        <Row to="/pricing" label="Pricing" />
        <Row to="/cohort" label="The Charter Cohort" />
        {courseLibraryUrl ? <Row href={courseLibraryUrl} label="Courses" note="↗" /> : null}
        <Row to="/about" label="About" />
      </div>

      <div className="mt-10">
        <AddToHomeScreen />
      </div>
    </div>
  );
}
