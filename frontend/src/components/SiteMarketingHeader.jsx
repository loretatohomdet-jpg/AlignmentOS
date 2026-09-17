import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import HeaderUserMenu from './HeaderUserMenu';
import MobileDrawer from './MobileDrawer';
import {
  siteNavMainLinks,
  siteNavSignedInLinks,
  siteNavLinkClass,
  siteNavDrawerRowClass,
  beginFreeHeaderButtonClass,
} from '../config/siteNav';

function readLoggedIn() {
  return typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
}

/**
 * Site header. Logged-in users always get Dashboard · Practice · Review
 * including on Home, Pricing, and other marketing pages. The olive button
 * stays the primary action: Begin free when logged out, Practice when in.
 */
export default function SiteMarketingHeader({ appendDesktop = null, authDrawer }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(readLoggedIn);

  useEffect(() => {
    const sync = () => setIsLoggedIn(readLoggedIn());
    sync();
    window.addEventListener('alignment-auth', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('alignment-auth', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const navLinks = isLoggedIn ? siteNavSignedInLinks : siteNavMainLinks;
  const primaryCta = isLoggedIn
    ? { to: '/practice', label: 'Practice' }
    : { to: '/assessment', label: 'Begin free' };

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
    } catch (_) {}
    window.dispatchEvent(new Event('alignment-auth'));
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const drawerAuth = authDrawer ?? { isLoggedIn, onLogout: handleLogout };

  const accountDesktop =
    appendDesktop ?? (
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-medium text-alignment-accent/90 hover:text-alignment-accent transition-colors"
          >
            Sign In
          </NavLink>
        ) : (
          <HeaderUserMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        )}
      </div>
    );

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-alignment-accent/[0.07] bg-alignment-foundation/88 backdrop-blur-md supports-[backdrop-filter]:bg-alignment-foundation/78 pt-[max(0px,env(safe-area-inset-top))]">
        <div className="flex w-full max-w-6xl mx-auto min-w-0 items-center gap-2 px-3 sm:px-6 lg:px-10 min-h-14 sm:min-h-16 py-1.5 sm:py-0">
          <BrandLogo
            compact
            className="min-w-0 shrink overflow-hidden max-w-[9.5rem] sm:max-w-[12rem] lg:max-w-[14rem] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2"
          />
          <nav className="hidden lg:flex items-center gap-5 lg:gap-8 flex-1 justify-center min-w-0" aria-label="Primary">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${siteNavLinkClass}${isActive ? ' text-alignment-accent' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center justify-end gap-1 sm:gap-2 shrink-0">
            <Link
              to={primaryCta.to}
              className={`${beginFreeHeaderButtonClass} shrink-0 touch-manipulation max-lg:px-3 max-lg:py-1.5`}
            >
              {primaryCta.label}{' '}
              <span aria-hidden className="ml-0.5 sm:ml-1">
                →
              </span>
            </Link>
            {accountDesktop}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-alignment-accent hover:bg-alignment-accent/[0.07] active:bg-alignment-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 touch-manipulation"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <p className="px-4 pt-2 pb-1 text-xs font-medium text-alignment-accent/65 uppercase tracking-wider">Navigate</p>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={siteNavDrawerRowClass}
            onClick={() => setDrawerOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        {!navLinks.some((link) => link.to === primaryCta.to) && (
          <Link
            to={primaryCta.to}
            className={siteNavDrawerRowClass}
            onClick={() => setDrawerOpen(false)}
          >
            {primaryCta.label}
          </Link>
        )}
        <p className="px-4 pt-4 pb-1 text-xs font-medium text-alignment-accent/65 uppercase tracking-wider">Account</p>
        {drawerAuth.isLoggedIn ? (
          <>
            <Link to="/profile" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
              Profile
            </Link>
            <a
              href="/"
              className={siteNavDrawerRowClass}
              onClick={(e) => {
                e.preventDefault();
                setDrawerOpen(false);
                drawerAuth.onLogout();
              }}
            >
              Log out
            </a>
          </>
        ) : (
          <>
            <Link to="/signup" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
              Sign up
            </Link>
            <Link to="/login" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
              Sign in
            </Link>
          </>
        )}
      </MobileDrawer>
    </>
  );
}
