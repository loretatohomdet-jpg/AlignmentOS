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
      <header className="sticky top-0 z-50 w-full border-b border-alignment-accent/[0.06] bg-alignment-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-alignment-surface/80 relative overflow-visible">
        {/*
          Portrait phones are narrower than landscape — flex row was clipping the menu control.
          Reserve right padding on <lg and pin the menu button so it is always visible.
        */}
        <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 min-h-14 sm:min-h-16 py-1.5 sm:py-0 flex items-center justify-between gap-2 min-w-0 pr-14 lg:pr-10">
          <BrandLogo
            compact
            className="min-w-0 shrink max-w-[min(100%,46vw)] lg:max-w-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2"
          />
          <nav className="hidden lg:flex items-center gap-5 lg:gap-8 flex-1 justify-center min-w-0" aria-label="Primary">
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
          <div className="flex items-center justify-end gap-1 sm:gap-2 min-w-0 flex-1 lg:flex-initial lg:shrink-0">
            <Link
              to="/assessment"
              className={`${beginFreeHeaderButtonClass} shrink min-w-0 touch-manipulation max-lg:px-2 max-lg:py-1.5`}
            >
              <span className="lg:hidden">Start</span>
              <span className="hidden lg:inline">Begin free</span>{' '}
              <span aria-hidden className="ml-0.5 sm:ml-1">
                →
              </span>
            </Link>
            {appendDesktop}
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden absolute right-3 top-1/2 z-[60] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-md border border-alignment-accent/25 bg-alignment-surface text-alignment-accent shadow-sm hover:bg-alignment-accent/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 touch-manipulation"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
