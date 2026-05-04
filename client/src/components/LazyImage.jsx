export function LazyLoadImage({ src, alt, className }) {
  return (
    <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />
  );
}
