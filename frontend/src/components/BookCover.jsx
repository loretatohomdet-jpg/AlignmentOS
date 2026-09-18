/**
 * Book-cover stills for the paper/digital tools. Quiet panel when a cover is not ready yet.
 */
export default function BookCover({ src, alt, title, className = '' }) {
  if (!src) {
    return (
      <figure
        className={`aspect-[3/4] flex items-center justify-center bg-alignment-foundation ${className}`}
        aria-label={alt || title}
      >
        <span className="block h-8 w-px bg-alignment-primary/40" aria-hidden />
      </figure>
    );
  }
  return (
    <figure className={`overflow-hidden bg-alignment-foundation ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" decoding="async" />
    </figure>
  );
}
