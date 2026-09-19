import { Link } from 'react-router-dom';
import { siteLegalLinks, siteMarketingFooter, siteSecondaryFooter } from '../config/footerNav';

const linkClass =
  'hover:text-alignment-accent transition-colors duration-200 whitespace-normal break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 rounded-sm';

function FooterItem({ item }) {
  const className = `${linkClass} text-alignment-accent/65`;
  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link to={item.to} className={className}>
      {item.label}
    </Link>
  );
}

function FooterLinkRow({ links, className, ariaLabel }) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      {links.map((item, index) => (
        <span key={`${item.to || item.href}-${item.label}`} className="inline-flex items-center">
          {index > 0 ? (
            <span aria-hidden className="mx-2.5 sm:mx-3 text-alignment-accent/35">
              ·
            </span>
          ) : null}
          <FooterItem item={item} />
        </span>
      ))}
    </nav>
  );
}

/** Landing page marketing links */
export function SiteMarketingFooterNav({ className = '' }) {
  return <FooterLinkRow links={siteMarketingFooter} className={className} ariaLabel="Navigate" />;
}

export function SiteLegalFooterNav({ className = '' }) {
  return <FooterLinkRow links={siteLegalLinks} className={className} ariaLabel="Legal" />;
}

const secondaryLinkClass =
  'text-sm text-alignment-accent/90 hover:text-alignment-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 rounded-sm';

/** Compact row: Home, Platform, About, Shop, Begin free, Privacy, Terms */
export function SiteSecondaryFooterNav({ className = '' }) {
  return (
    <nav className={className} aria-label="Site">
      {siteSecondaryFooter.map((item) => (
        <Link key={`${item.to}-${item.label}`} to={item.to} className={secondaryLinkClass}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
