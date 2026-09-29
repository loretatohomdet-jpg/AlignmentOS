/** Guest assessment → account claim continuity */

const GUEST_EMAIL_KEY = 'alignment_guest_email';
const CLAIM_NOTE_KEY = 'alignment_claim_note';

export function rememberGuestEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  if (!value) return;
  try {
    sessionStorage.setItem(GUEST_EMAIL_KEY, value);
  } catch (_) {}
}

export function readGuestEmail() {
  try {
    return sessionStorage.getItem(GUEST_EMAIL_KEY) || '';
  } catch (_) {
    return '';
  }
}

export function clearGuestEmail() {
  try {
    sessionStorage.removeItem(GUEST_EMAIL_KEY);
  } catch (_) {}
}

const CLAIM_MESSAGES = {
  NO_PENDING:
    'We could not find a saved assessment for this email. Use the same email you entered for your report, or take the assessment again.',
  ALREADY_HAS_PROFILE:
    'This account already has an assessment on file. Open My Plan to continue, or retake the assessment to refresh it.',
  SAVE_FAILED: 'We could not attach your assessment to this account. Try signing in again, or retake the assessment.',
};

export function noteClaimOutcome({ claimed, reason, returnTo }) {
  if (claimed) {
    try {
      sessionStorage.removeItem(CLAIM_NOTE_KEY);
    } catch (_) {}
    clearGuestEmail();
    return;
  }
  if (!returnTo || !(String(returnTo).includes('/plan') || String(returnTo).includes('/snapshot'))) return;
  const message = CLAIM_MESSAGES[reason] || CLAIM_MESSAGES.NO_PENDING;
  try {
    sessionStorage.setItem(CLAIM_NOTE_KEY, message);
  } catch (_) {}
}

export function consumeClaimNote() {
  try {
    const message = sessionStorage.getItem(CLAIM_NOTE_KEY);
    if (message) sessionStorage.removeItem(CLAIM_NOTE_KEY);
    return message || '';
  } catch (_) {
    return '';
  }
}
