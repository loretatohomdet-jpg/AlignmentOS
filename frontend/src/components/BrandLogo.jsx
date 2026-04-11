import { Link } from 'react-router-dom';

/**
 * Official horizontal lockup — organic ring icon + “Alignment OS” wordmark.
 * Source: `public/alignment-brand-logo.png` (transparent background, works on light surfaces).
 * Height is controlled via `iconHeightPx`; width follows intrinsic aspect ratio.
 */
export default function BrandLogo({
  to = '/',
  className = '',
  /** Logo bar height in px (header/footer tune this) */
  iconHeightPx = 44,
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center shrink-0 hover:opacity-85 transition-opacity ${className}`}
      aria-label="Alignment OS home"
    >
      <img
        src="/alignment-brand-logo.png"
        alt="Alignment OS"
        style={{ height: iconHeightPx, width: 'auto' }}
        className="w-auto max-w-[min(100%,280px)] sm:max-w-[min(100%,320px)] object-contain object-left select-none pointer-events-none"
        decoding="async"
        draggable={false}
      />
    </Link>
  );
}
