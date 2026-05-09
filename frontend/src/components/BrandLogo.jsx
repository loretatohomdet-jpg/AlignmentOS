import { Link } from 'react-router-dom';

/**
 * Horizontal wordmark — full “Alignment OS” logo asset (PNG).
 * File: `public/alignment-os-wordmark.png` (transparent background).
 */
export default function BrandLogo({
  to = '/',
  className = '',
  /** Logo bar height in px. Ignored when `compact` is true. */
  iconHeightPx = 44,
  /** Narrow screens: responsive height + max-width (better for mobile headers). */
  compact = false,
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center min-w-0 shrink max-w-full hover:opacity-90 transition-opacity ${className}`}
      aria-label="Alignment OS home"
    >
      <img
        src="/alignment-os-wordmark.png"
        alt=""
        width={1024}
        height={171}
        style={compact ? undefined : { height: iconHeightPx, width: 'auto' }}
        className={`block w-auto max-w-full object-contain object-left select-none pointer-events-none ${
          compact ? 'h-7 sm:h-8 md:h-9 max-h-9' : ''
        }`}
        decoding="async"
        draggable={false}
      />
    </Link>
  );
}
