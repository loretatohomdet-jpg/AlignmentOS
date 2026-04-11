import { Link } from 'react-router-dom';

/**
 * Official horizontal lockup — organic ring icon + “Alignment OS” wordmark.
 * Source: `public/alignment-brand-logo.png` (transparent background, works on light surfaces).
 * Height is controlled via `iconHeightPx`; width follows intrinsic aspect ratio.
 */
export default function BrandLogo({
  to = '/',
  className = '',
  /** Logo bar height in px (header/footer tune this). Ignored when `compact` is true. */
  iconHeightPx = 44,
  /** Narrow screens: responsive height + max-width (better for mobile headers). */
  compact = false,
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center min-w-0 shrink max-w-full hover:opacity-85 transition-opacity ${className}`}
      aria-label="Alignment OS home"
    >
      <img
        src="/alignment-brand-logo.png"
        alt="Alignment OS"
        style={compact ? undefined : { height: iconHeightPx, width: 'auto' }}
        className={`w-auto object-contain object-left select-none pointer-events-none ${
          compact
            ? 'h-7 w-auto max-w-[9rem] sm:h-10 sm:max-w-[13rem] md:h-11 md:max-w-[16rem]'
            : 'max-w-[min(100%,min(280px,58vw))] sm:max-w-[min(100%,320px)]'
        }`}
        decoding="async"
        draggable={false}
      />
    </Link>
  );
}
