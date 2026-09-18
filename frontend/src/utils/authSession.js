import { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiBase';

const TOKEN_KEY = 'accessToken';
const AUTH_EVENT = 'alignment-auth';

export function getAccessToken() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/** True when the value looks like a JWT that has not expired. */
export function isPlausibleAccessToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  if (typeof payload.exp === 'number') return payload.exp * 1000 > Date.now() + 5000;
  return true;
}

export function hasUnexpiredAccessToken() {
  return isPlausibleAccessToken(getAccessToken());
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function discardInvalidToken() {
  const token = getAccessToken();
  if (token && !isPlausibleAccessToken(token)) {
    clearSession();
    return true;
  }
  return false;
}

let verifyInFlight = null;

/** Confirms a stored JWT with the API. 401/403 drop the session; network errors keep it. */
export async function verifySessionWithApi() {
  if (verifyInFlight) return verifyInFlight;
  verifyInFlight = (async () => {
    const token = getAccessToken();
    if (!token || !isPlausibleAccessToken(token)) {
      if (token) clearSession();
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        clearSession();
        return false;
      }
      return res.ok;
    } catch {
      return hasUnexpiredAccessToken();
    }
  })().finally(() => {
    verifyInFlight = null;
  });
  return verifyInFlight;
}

export function useAuthSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasUnexpiredAccessToken);

  useEffect(() => {
    let cancelled = false;

    const syncFromStorage = () => {
      discardInvalidToken();
      setIsLoggedIn(hasUnexpiredAccessToken());
    };

    syncFromStorage();
    verifySessionWithApi().then((ok) => {
      if (!cancelled) setIsLoggedIn(hasUnexpiredAccessToken() && ok);
    });

    window.addEventListener(AUTH_EVENT, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_EVENT, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  return isLoggedIn;
}
