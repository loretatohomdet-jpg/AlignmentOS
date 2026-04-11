/**
 * Base URL for API calls (includes `/api` path segment).
 * - Dev: same-origin `/api` → proxied to the Express server (see vite.config.js).
 * - Prod: set VITE_API_BASE_URL (e.g. https://your-api.com/api).
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');
