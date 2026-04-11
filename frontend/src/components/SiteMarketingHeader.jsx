import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import MobileDrawer from './MobileDrawer';
import {
  siteNavMainLinks,
  siteNavLinkClass,
  siteNavDrawerRowClass,
  beginFreeHeaderButtonClass,
} from '../config/siteNav';

/**
 * Shared marketing header: logo, centered Pricing / About / Dashboard, Begin free, mobile drawer.
 * Use `appendDesktop` for Sign in / account controls (e.g. app shell).
 * When `authDrawer` is set (app shell), Account drawer shows Sign up + Sign in or Log out.
 */
export default function SiteMarketingHeader({ appendDesktop = null, authDrawer }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-alignment-accent/[0.06] bg-alignment-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-alignment-surface/80">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2">
            <BrandLogo iconHeightPx={48} />
          </Link>
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 flex-1 justify-center" aria-label="Primary">
            {siteNavMainLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${siteNavLinkClass}${isActive ? ' text-alignment-accent' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/assessment"
              className={beginFreeHeaderButtonClass}
            >
              Begin free <span aria-hidden className="ml-0.5 sm:ml-1">→</span>
            </Link>
            {appendDesktop}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 text-alignment-accent hover:bg-alignment-accent/5 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <p className="px-4 pt-2 pb-1 text-xs font-medium text-alignment-accent/70 uppercase tracking-wider">Navigate</p>
        {siteNavMainLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={siteNavDrawerRowClass}
            onClick={() => setDrawerOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <Link
          to="/assessment"
          className={siteNavDrawerRowClass}
          onClick={() => setDrawerOpen(false)}
        >
          Begin free
        </Link>
        <p className="px-4 pt-4 pb-1 text-xs font-medium text-alignment-accent/70 uppercase tracking-wider">Account</p>
        {authDrawer?.isLoggedIn ? (
          <a
            href="/"
            className={siteNavDrawerRowClass}
            onClick={(e) => {
              e.preventDefault();
              setDrawerOpen(false);
              authDrawer.onLogout();
            }}
          >
            Log out
          </a>
        ) : authDrawer ? (
          <>
            <Link to="/signup" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
              Sign up
            </Link>
            <Link to="/login" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
              Sign in
            </Link>
          </>
        ) : (
          <Link to="/login" className={siteNavDrawerRowClass} onClick={() => setDrawerOpen(false)}>
            Sign in
          </Link>
        )}
      </MobileDrawer>
    </>
  );
}
