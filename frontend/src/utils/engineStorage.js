export function utcDayStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function ritualStorageKey(day) {
  return `alignment_engine_rituals_${day}`;
}

export function loadRituals(day) {
  try {
    const raw = localStorage.getItem(ritualStorageKey(day));
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      midday: Boolean(parsed.midday),
      close: Boolean(parsed.close),
    };
  } catch (_) {
    return { midday: false, close: false };
  }
}

export function saveRituals(day, next) {
  try {
    localStorage.setItem(ritualStorageKey(day), JSON.stringify(next));
  } catch (_) {}
}

export function markRitualHeld(day, key) {
  const current = loadRituals(day);
  saveRituals(day, { ...current, [key]: true });
}

function filledText(value) {
  const t = String(value || '').trim();
  return t || null;
}

function firstFilled(obj, keys) {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    const t = filledText(obj[key]);
    if (t) return t;
  }
  return null;
}

export function collectLocalArchive() {
  const items = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      const morning = key.match(/^alignment_morning_anchor_(\d{4}-\d{2}-\d{2})$/);
      const midday = key.match(/^alignment_midday_pause_(\d{4}-\d{2}-\d{2})$/);
      const close = key.match(/^alignment_evening_close_(\d{4}-\d{2}-\d{2})$/);
      const match = morning || midday || close;
      if (!match) continue;
      let parsed = null;
      try {
        parsed = JSON.parse(localStorage.getItem(key) || 'null');
      } catch (_) {
        parsed = null;
      }
      const excerpt = morning
        ? firstFilled(parsed, ['faithful', 'focus', 'oneThing', 'practice'])
        : midday
          ? firstFilled(parsed, ['adjustment', 'notice'])
          : firstFilled(parsed, ['gratitude', 'life', 'tomorrow', 'carrying', 'drift']);
      if (!excerpt) continue;
      items.push({
        id: key,
        day: match[1],
        kind: morning ? 'Morning anchor' : midday ? 'Midday pause' : 'Evening close',
        excerpt,
      });
    }
  } catch (_) {}
  return items;
}

export function formatArchiveDay(day) {
  try {
    return new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  } catch (_) {
    return day;
  }
}
