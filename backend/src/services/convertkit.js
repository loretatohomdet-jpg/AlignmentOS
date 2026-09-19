/**
 * ConvertKit (Kit) — collect emails only.
 * Welcome, Reset guide, and diagnostic results are sent by Resend, never by Kit.
 *
 * Never POST to a Kit form. Forms send the Reset-guide confirmation (n.convertkit.com).
 * Never apply CONVERTKIT_TAG_LEAD on a homepage capture — that tag is wired to the same
 * incentive / double-opt-in letter. List add is v4 create-subscriber with state active.
 */

const V3_BASE = 'https://api.convertkit.com/v3';
const V4_BASE = 'https://api.kit.com/v4';

function apiKey() {
  return (process.env.CONVERTKIT_API_KEY || '').trim();
}

function isConfigured() {
  return Boolean(apiKey());
}

async function postV3(path, body) {
  const key = apiKey();
  if (!key) return null;
  const res = await fetch(`${V3_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ api_key: key, ...body }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ConvertKit ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json().catch(() => ({}));
}

async function createSubscriberV4({ email, firstName, source }) {
  const key = apiKey();
  if (!key) return false;
  const res = await fetch(`${V4_BASE}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': key,
    },
    body: JSON.stringify({
      email_address: email,
      first_name: firstName || undefined,
      state: 'active',
      fields: source ? { source } : undefined,
    }),
  });
  if (res.ok || res.status === 200) return true;
  const text = await res.text().catch(() => '');
  throw new Error(`Kit v4 ${res.status}: ${text.slice(0, 200)}`);
}

async function subscribeTag(tagId, email, { firstName, source } = {}) {
  if (!tagId || !email) return false;
  try {
    await postV3(`/tags/${tagId}/subscribe`, {
      email,
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
 * Add or update a subscriber on the list. Never uses a Kit form (forms send Kit email).
 */
async function collectOnConvertKit({ email, firstName, source, tagId } = {}) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !isConfigured()) return false;

  let saved = false;
  try {
    saved = await createSubscriberV4({ email: normalized, firstName, source });
  } catch (err) {
    console.error('Kit v4 list collect failed:', err.message);
    try {
      await postV3('/subscribers', {
        email: normalized,
        first_name: firstName || undefined,
        fields: source ? { source } : undefined,
      });
      saved = true;
    } catch (v3Err) {
      console.error('Kit v3 list collect failed:', v3Err.message);
    }
  }

  if (tagId) {
    const tagged = await subscribeTag(tagId, normalized, { firstName, source });
    saved = saved || tagged;
  }

  return saved;
}

function subscribeLeadQuietly(email, source = 'diagnostic-report') {
  return collectOnConvertKit({
    email,
    source,
  });
}

/** Same as quiet collect — kept so scripts do not hit a Kit form. */
function subscribeLead(email, source = 'lander') {
  return subscribeLeadQuietly(email, source);
}

function subscribeRegistered(email, firstName) {
  const tagId = process.env.CONVERTKIT_TAG_REGISTERED || process.env.CONVERTKIT_TAG_LEAD;
  return collectOnConvertKit({
    email,
    firstName,
    source: 'signup',
    tagId,
  });
}

function subscribePaid(email) {
  const tagId =
    process.env.CONVERTKIT_TAG_PAID ||
    process.env.CONVERTKIT_TAG_REGISTERED ||
    process.env.CONVERTKIT_TAG_LEAD;
  return collectOnConvertKit({
    email,
    source: 'paid',
    tagId,
  });
}

module.exports = {
  collectOnConvertKit,
  subscribeLead,
  subscribeLeadQuietly,
  subscribeRegistered,
  subscribePaid,
  isConfigured,
};
