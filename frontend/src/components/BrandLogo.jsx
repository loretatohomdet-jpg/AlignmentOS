import { Link } from 'react-router-dom';

/**
 * Horizontal lockup — organic ring mark (PNG) + wordmark (HTML for sharp text).
 * Mark: `public/alignment-brand-mark.png` (transparent; icon-only export).
 */
export default function BrandLogo({
  to = '/',
  className = '',
  /** Logo bar height in px — applies to mark image; wordmark scales with it. Ignored when `compact` is true. */
  iconHeightPx = 44,
  /** Narrow screens: responsive height + max-width (better for mobile headers). */
  compact = false,
}) {
  const textClass = compact
    ? 'text-[13px] sm:text-[0.95rem] font-semibold tracking-tight leading-none text-alignment-accent'
    : 'text-[0.95rem] sm:text-lg font-semibold tracking-tight leading-none text-alignment-accent';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 sm:gap-2.5 min-w-0 shrink max-w-full hover:opacity-90 transition-opacity ${className}`}
      aria-label="Alignment OS home"
    >
      <img
        src="/alignment-brand-mark.png"
        alt=""
        style={compact ? undefined : { height: iconHeightPx, width: 'auto' }}
        className={`w-auto object-contain object-left select-none pointer-events-none shrink-0 ${
          compact ? 'h-7 sm:h-10 md:h-11' : ''
        }`}
        decoding="async"
        draggable={false}
      />
      <span className={`${textClass} whitespace-nowrap font-sans`}>
        Alignment<span className="text-alignment-primary">OS</span>
      </span>
    </Link>
  );
}
