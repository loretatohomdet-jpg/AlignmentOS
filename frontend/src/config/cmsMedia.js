/**
 * Resolve CMS-stored image values for <img src>.
 * Uploaded assets are stored as `/public/media/:id` and must hit the API host.
 */
import { API_BASE } from './apiBase';

export function resolveCmsImageUrl(value) {
  const src = String(value || '').trim();
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/public/media/')) return `${API_BASE}${src}`;
  if (src.startsWith('/api/public/media/')) return `${API_BASE}${src.replace(/^\/api/, '')}`;
  return src;
}
