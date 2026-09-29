/**
 * One loop for signed-in people: Plan names the focus, Daily holds it, Review adjusts.
 * Dashboard remains the record (score + history).
 */
export const JUST_PAID_KEY = 'alignment_os_just_paid';

export function markJustPaid() {
  try {
    sessionStorage.setItem(JUST_PAID_KEY, '1');
  } catch (_) {}
}

export function isJustPaid() {
  try {
    return sessionStorage.getItem(JUST_PAID_KEY) === '1';
  } catch (_) {
    return false;
  }
}

export function clearJustPaid() {
  try {
    sessionStorage.removeItem(JUST_PAID_KEY);
  } catch (_) {}
}

export const LOOP_PLACES = [
  {
    to: '/plan',
    label: 'My Plan',
    body: 'Your focus and priorities from the assessment.',
  },
  {
    to: '/practice',
    label: 'Daily',
    body: 'Today’s rooms. Hold one practice from your plan.',
  },
  {
    to: '/reflect',
    label: 'Review',
    body: 'A weekly pause to notice what is helping.',
  },
];

export const SAVED_TO_RECORD = 'This is saved to your record.';
export const MAP_LIVES_ON_DASHBOARD = 'The map fills from the diagnostic. It lives on your Dashboard.';

export const FRESH_RESULT_KEY = 'alignment_os_fresh_result';
export const SNAPSHOT_SEEN_KEY = 'alignment_os_snapshot_seen';

/** After the Assessment — what Alignment OS is for, before the whole product. */
export const OS_OFFERS = [
  { label: 'Alignment Map', body: 'Understand the pattern.' },
  { label: 'Personal Plan', body: 'Decide what matters now.' },
  { label: 'Daily Practice', body: 'Hold one change in the day.' },
  { label: 'Weekly Review', body: 'See what is actually helping.' },
];

export function markSnapshotContinued() {
  try {
    sessionStorage.setItem(SNAPSHOT_SEEN_KEY, '1');
  } catch (_) {}
  try {
    localStorage.setItem('alignment_os_dashboard_welcome_dismissed', '1');
  } catch (_) {}
}

export function sawSnapshotContinue() {
  try {
    return sessionStorage.getItem(SNAPSHOT_SEEN_KEY) === '1';
  } catch (_) {
    return false;
  }
}

/** After claim/signup — open Snapshot when a fresh handoff is waiting. */
export function preferSnapshotIfFresh(path) {
  try {
    if (sessionStorage.getItem(FRESH_RESULT_KEY)) return '/snapshot';
  } catch (_) {}
  return path;
}

export function storeFreshResultHandoff(data) {
  if (!data || typeof data !== 'object') return;
  try {
    sessionStorage.setItem(FRESH_RESULT_KEY, JSON.stringify({ ...data, _freshSubmission: true }));
  } catch (_) {}
}
