import axios from 'axios';
import { API_BASE } from '../config/apiBase';
import { loadRituals, saveRituals } from './engineStorage';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function emptyRituals() {
  return {
    morning: { answers: {}, held: false },
    midday: { answers: {}, held: false },
    close: { answers: {}, held: false },
  };
}

export async function fetchDayRituals(day) {
  const { data } = await axios.get(`${API_BASE}/me/rituals`, {
    params: { day },
    headers: authHeaders(),
  });
  return {
    day: data?.day || day,
    rituals: { ...emptyRituals(), ...(data?.rituals || {}) },
  };
}

export async function saveDayRitual({ day, kind, answers, held }) {
  const { data } = await axios.put(
    `${API_BASE}/me/rituals`,
    { day, kind, answers, held: Boolean(held) },
    { headers: authHeaders() }
  );
  return data;
}

export async function fetchRitualArchive() {
  const { data } = await axios.get(`${API_BASE}/me/rituals/archive`, { headers: authHeaders() });
  return Array.isArray(data) ? data : [];
}

export function cacheHeldRituals(day, rituals) {
  saveRituals(day, {
    midday: Boolean(rituals?.midday?.held),
    close: Boolean(rituals?.close?.held),
  });
}

/** If this device has a held room the server does not, push it once. */
export async function pushHeldLocalRituals(day) {
  const local = loadRituals(day);
  let server;
  try {
    ({ rituals: server } = await fetchDayRituals(day));
  } catch (_) {
    return loadRituals(day);
  }
  const kinds = ['midday', 'close'];
  await Promise.all(
    kinds.map(async (kind) => {
      if (!local[kind] || server[kind]?.held) return;
      try {
        await saveDayRitual({
          day,
          kind,
          answers: server[kind]?.answers || {},
          held: true,
        });
        server[kind] = { ...(server[kind] || {}), held: true };
      } catch (_) {}
    })
  );
  cacheHeldRituals(day, server);
  return {
    midday: Boolean(server.midday?.held || local.midday),
    close: Boolean(server.close?.held || local.close),
  };
}
