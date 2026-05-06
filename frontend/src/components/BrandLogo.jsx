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
  const labelClass = compact
    ? 'text-[0.9375rem] sm:text-[1.0625rem] md:text-[1.125rem] font-semibold tracking-tight text-alignment-accent font-sans leading-none'
    : 'text-[0.95rem] sm:text-[1.0625rem] md:text-lg font-semibold tracking-tight text-alignment-accent font-sans leading-none';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 sm:gap-3 min-w-0 shrink max-w-full hover:opacity-90 transition-opacity ${className}`}
      aria-label="Alignment OS home"
    >
      {/* Wrapper keeps the mark vertically centered with the wordmark (img is block to avoid inline baseline gap). */}
      <span className="flex shrink-0 items-center justify-center self-center">
        <img
          src="/alignment-brand-mark.png"
          alt=""
          width={210}
          height={180}
          style={compact ? undefined : { height: iconHeightPx, width: 'auto' }}
          className={`block w-auto max-h-full object-contain object-center select-none pointer-events-none ${
            compact ? 'h-8 sm:h-10 md:h-11' : ''
          }`}
          decoding="async"
          draggable={false}
        />
      </span>
      <span className={`inline-flex items-center self-center ${labelClass} whitespace-nowrap`}>
        Alignment<span className="text-alignment-primary">OS</span>
      </span>
    </Link>
  );
}
