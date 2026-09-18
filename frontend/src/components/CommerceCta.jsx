import { Link } from 'react-router-dom';
import { trackCommerce } from '../config/commerce';

/**
 * Internal route or Shopify checkout. Shop buys never require an Alignment OS account.
 */
export default function CommerceCta({
  href,
  to,
  event,
  sku,
  className,
  children,
  external,
}) {
  const handleClick = () => {
    trackCommerce(event, { sku, product_sku: sku });
  };

  if (to) {
    return (
      <Link to={to} onClick={handleClick} className={className}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = external ?? /^https?:/i.test(href);
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={className} title={import.meta.env.DEV ? 'Set the product checkout URL in Vercel to enable this button' : undefined}>
      {children}
    </span>
  );
}
