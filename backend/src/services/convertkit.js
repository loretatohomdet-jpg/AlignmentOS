/**
 * ConvertKit (Kit) subscriber API — v3.
 * https://developers.kit.com/v3
 *
 * Set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID. Optional tag IDs per event.
 */

const API_BASE = 'https://api.convertkit.com/v3';

function isConfigured() {
  return Boolean(process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID);
}

async function postJson(path, body) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  if (!apiKey) return null;
  const url = `${API_BASE}${path}?api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ConvertKit ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json().catch(() => ({}));
}

async function subscribeTag(tagId, email) {
  if (!tagId || !email) return;
  try {
    await postJson(`/tags/${tagId}/subscribe`, { email });
  } catch (err) {
    console.error('ConvertKit tag subscribe failed:', err.message);
  }
}

/**
 * Add or update a subscriber on the default form, optionally apply tag IDs.
 * @param {{ email: string, firstName?: string, tags?: string[], source?: string }} opts
 */
async function subscribeToConvertKit({ email, firstName, tags = [], source }) {
  if (!isConfigured()) return;
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return;

  const formId = process.env.CONVERTKIT_FORM_ID;
  const fields = {};
  if (source) fields.source = source;

  try {
    await postJson(`/forms/${formId}/subscribe`, {
      email: normalized,
      first_name: firstName || undefined,
      fields: Object.keys(fields).length ? fields : undefined,
    });
  } catch (err) {
    console.error('ConvertKit form subscribe failed:', err.message);
    return;
  }

  const tagIds = [...new Set(tags.filter(Boolean))];
  for (const tagId of tagIds) {
    await subscribeTag(tagId, normalized);
  }
}

/** Lead capture (lander, diagnostic email gate, etc.) */
function subscribeLead(email, source = 'lander') {
  return subscribeToConvertKit({
    email,
    tags: process.env.CONVERTKIT_TAG_LEAD ? [process.env.CONVERTKIT_TAG_LEAD] : [],
    source,
  });
}

/** New account registration */
function subscribeRegistered(email, firstName) {
  return subscribeToConvertKit({
    email,
    firstName,
    tags: process.env.CONVERTKIT_TAG_REGISTERED ? [process.env.CONVERTKIT_TAG_REGISTERED] : [],
    source: 'signup',
  });
}

/** Successful Habit Engine / paid checkout */
function subscribePaid(email) {
  return subscribeToConvertKit({
    email,
    tags: process.env.CONVERTKIT_TAG_PAID ? [process.env.CONVERTKIT_TAG_PAID] : [],
    source: 'paid',
  });
}

module.exports = {
  subscribeToConvertKit,
  subscribeLead,
  subscribeRegistered,
  subscribePaid,
  isConfigured,
};
