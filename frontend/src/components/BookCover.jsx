/**
 * Book-cover stills for the paper/digital companions.
 */
export default function BookCover({ src, alt, className = '' }) {
  return (
    <figure className={`overflow-hidden bg-alignment-foundation ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" decoding="async" />
    </figure>
  );
}
