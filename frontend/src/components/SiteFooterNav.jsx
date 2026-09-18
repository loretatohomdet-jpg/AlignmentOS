import { Link } from 'react-router-dom';
import { siteLegalLinks, siteMarketingFooter, siteSecondaryFooter } from '../config/footerNav';
import { extraMarketingFooterLinks } from '../config/externalLinks';

const linkClass =
  'hover:text-alignment-accent transition-colors duration-200 whitespace-normal break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 rounded-sm';

/** Landing page marketing grid + legal */
export function SiteMarketingFooterNav({ className = '' }) {
  const links = siteMarketingFooter;

  return (
    <nav className={className} aria-label="Site">
      {links.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            className={`${linkClass} text-alignment-accent/65`}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.label}
          </a>
        ) : (
          <Link key={`${item.to}-${item.label}`} to={item.to} className={`${linkClass} text-alignment-accent/65`}>
            {item.label}
          </Link>
        ),
      )}
      {extraMarketingFooterLinks.map((item) => (
        <a
          key={`ext-${item.label}-${item.href}`}
          href={item.href}
          className={`${linkClass} text-alignment-accent/65`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.label}
        </a>
      ))}
      {siteLegalLinks.map((item) => (
        <Link key={item.to} to={item.to} className={`${linkClass} text-alignment-accent/65`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const secondaryLinkClass =
  'text-sm text-alignment-accent/90 hover:text-alignment-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alignment-primary focus-visible:ring-offset-2 rounded-sm';

/** Compact row: Home, Pricing, About, Wholeness, Organizations, Privacy, Terms */
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
