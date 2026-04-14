/**
 * Base URL for API calls (includes `/api` path segment).
 * - Dev: same-origin `/api` → proxied to the Express server (see vite.config.js).
 * - Prod: set VITE_API_BASE_URL (e.g. https://your-api.com/api).
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

/** True when a production build was made without VITE_API_BASE_URL (API calls default to localhost and fail in the browser). */
export const isProdMissingViteApiBase =
  import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL;

/** User-facing copy for axios ERR_NETWORK (misconfigured deploy vs backend down / CORS). */
export function networkErrorUserMessage() {
  if (isProdMissingViteApiBase) {
    return 'Cannot reach the API. Set VITE_API_BASE_URL on your frontend host to your backend URL (including /api), then redeploy—for example https://your-app.up.railway.app/api.';
  }
  return 'Cannot reach the server. Make sure the backend is running and that it allows this site (CORS).';
}
