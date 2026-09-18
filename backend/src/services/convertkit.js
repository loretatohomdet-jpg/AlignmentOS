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
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ api_key: apiKey, ...body }),
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
/** @returns {Promise<boolean>} true when subscriber was added to the form */
async function subscribeToConvertKit({ email, firstName, tags = [], source }) {
  if (!isConfigured()) return false;
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;

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
    return false;
  }

  const tagIds = [...new Set(tags.filter(Boolean))];
  for (const tagId of tagIds) {
    await subscribeTag(tagId, normalized);
  }
  return true;
}

/** Form subscribe — sends Kit’s Reset-guide email. Do not also tag; the lead tag often fires a welcome sequence. */
function subscribeLead(email, source = 'lander') {
  return subscribeToConvertKit({
    email,
    source,
  });
}

/**
 * Add someone to the list by tag only. Does not trigger the Reset-guide form email.
 */
async function subscribeByTag(email, tagId, { firstName, source } = {}) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !apiKey || !tagId) return false;
  try {
    await postJson(`/tags/${tagId}/subscribe`, {
      email: normalized,
      first_name: firstName || undefined,
      fields: source ? { source } : undefined,
    });
    return true;
  } catch (err) {
    console.error('ConvertKit tag subscribe failed:', err.message);
    return false;
  }
}

/**
 * Add a diagnostic lead to the list without the form’s Reset-guide confirmation.
 */
async function subscribeLeadQuietly(email, source = 'diagnostic-report') {
  return subscribeByTag(email, process.env.CONVERTKIT_TAG_LEAD, { source });
}

/** New account — tag only, never the Reset-guide form. */
function subscribeRegistered(email, firstName) {
  const tagId = process.env.CONVERTKIT_TAG_REGISTERED || process.env.CONVERTKIT_TAG_LEAD;
  return subscribeByTag(email, tagId, { firstName, source: 'signup' });
}

/** Successful Habit Engine / paid checkout — tag only, never the Reset-guide form. */
function subscribePaid(email) {
  const tagId =
    process.env.CONVERTKIT_TAG_PAID ||
    process.env.CONVERTKIT_TAG_REGISTERED ||
    process.env.CONVERTKIT_TAG_LEAD;
  return subscribeByTag(email, tagId, { source: 'paid' });
}

module.exports = {
  subscribeToConvertKit,
  subscribeLead,
  subscribeLeadQuietly,
  subscribeRegistered,
  subscribePaid,
  isConfigured,
};
