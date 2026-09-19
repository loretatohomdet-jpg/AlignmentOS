import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import HeaderUserMenu from './HeaderUserMenu';
import MobileDrawer from './MobileDrawer';
import { SiteLegalFooterNav, SiteMarketingFooterNav } from './SiteFooterNav';
import { siteFooterCopyright, siteFooterTagline } from '../config/footerNav';
import { type } from '../config/siteType';
import { clearSession, useAuthSession } from '../utils/authSession';

export const hairline = 'border-alignment-accent/[0.10]';
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-alignment-foundation';
export const pillPrimary = `inline-flex items-center justify-center rounded-full bg-alignment-primary text-white text-[15px] font-medium px-8 py-3.5 hover:bg-alignment-primary/90 transition-colors min-h-12 ${focusRing}`;
export const pillGhost = `inline-flex items-center justify-center rounded-full border border-alignment-accent/15 bg-alignment-foundation text-alignment-accent text-[15px] px-8 py-3.5 hover:border-alignment-primary/40 hover:bg-alignment-surfaceSoft transition-colors min-h-12 ${focusRing}`;
export const pillOutline = `inline-flex items-center justify-center rounded-full border border-alignment-primary/40 bg-transparent text-alignment-primary text-[15px] font-medium px-8 py-3.5 hover:bg-alignment-primary/[0.06] transition-colors min-h-12 ${focusRing}`;
export const pillOnOlive = `inline-flex items-center justify-center rounded-full bg-alignment-foundation text-alignment-accent text-[15px] font-medium px-8 py-3.5 hover:bg-white transition-colors min-h-12 ${focusRing}`;
export const pillGhostOnOlive = `inline-flex items-center justify-center rounded-full border border-white/45 bg-transparent text-white text-[15px] px-8 py-3.5 hover:bg-white/10 transition-colors min-h-12 ${focusRing}`;
export const pillHeader = `inline-flex items-center justify-center rounded-full bg-alignment-primary text-white text-sm font-medium px-5 py-2 hover:bg-alignment-primary/90 transition-colors min-h-10 ${focusRing}`;
export const pageWidth = 'mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12';
export const copper = 'text-alignment-primary';

const homeNav = [
  { to: '/cohort', label: 'Cohort' },
  { href: '/#leaders', label: 'For Leaders' },
  { to: '/about', label: 'About' },
];

export function HomeHeader() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isLoggedIn = useAuthSession();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const cta = isLoggedIn
    ? { to: '/practice', label: 'Practice' }
    : { to: '/assessment', label: 'Begin free' };

  const navClass = (active) =>
    `text-[15px] transition-colors ${active ? 'text-alignment-accent' : 'text-alignment-accent/90 hover:text-alignment-accent'}`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-alignment-accent/[0.08] bg-alignment-foundation/95 backdrop-blur-md pt-[max(0px,env(safe-area-inset-top))]">
        <div className={`relative flex min-h-16 items-center justify-between gap-4 ${pageWidth}`}>
          <BrandLogo
            compact
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary/40"
          />
          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Primary">
            {homeNav.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} className={navClass(pathname === item.to)}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className={navClass(false)}>
                  {item.label}
                </a>
              )
            )}
            {!isLoggedIn ? (
              <Link to="/login" className="text-[15px] text-alignment-accent/90 hover:text-alignment-accent transition-colors">
                Sign in
              </Link>
            ) : null}
            <Link to={cta.to} className={pillHeader}>
              {cta.label}
            </Link>
            {isLoggedIn ? <HeaderUserMenu isLoggedIn onLogout={handleLogout} /> : null}
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <Link to={cta.to} className={`${pillHeader} text-[13px] px-4 py-1.5`}>
              {cta.label}
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-alignment-accent hover:bg-alignment-accent/[0.06]"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {homeNav.map((item) =>
          item.to ? (
            <Link
              key={item.label}
              to={item.to}
              className="block px-4 py-3.5 text-base text-alignment-accent"
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3.5 text-base text-alignment-accent"
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </a>
          )
        )}
        <Link to={cta.to} className="block px-4 py-3.5 text-base text-alignment-accent" onClick={() => setDrawerOpen(false)}>
          {cta.label}
        </Link>
        {isLoggedIn ? null : (
          <Link to="/login" className="block px-4 py-3.5 text-base text-alignment-accent" onClick={() => setDrawerOpen(false)}>
            Sign in
          </Link>
        )}
      </MobileDrawer>
    </>
  );
}

export function HomeFooter() {
  return <SitePageFooter />;
}

/** Same footer as the homepage. */
export function SitePageFooter({ extra = null }) {
  const linkRow =
    'flex flex-wrap items-center gap-y-2 min-w-0 text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.14em]';

  return (
    <footer className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-alignment-accent/[0.08] bg-alignment-surfaceSoft/95 backdrop-blur-[2px] pb-[max(1rem,env(safe-area-inset-bottom))] mt-auto">
      <div className="w-full min-w-0 max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-12">
        <BrandLogo iconHeightPx={44} />
        <p className={`mt-4 ${type.body} max-w-md`}>{siteFooterTagline}</p>
        <SiteMarketingFooterNav className={`${linkRow} mt-8`} />
        <SiteLegalFooterNav className={`${linkRow} mt-4`} />
        <p className={`mt-8 ${type.muted}`}>
          {siteFooterCopyright}
          {extra ? <span className="ml-4 inline-flex align-middle">{extra}</span> : null}
        </p>
      </div>
    </footer>
  );
}
