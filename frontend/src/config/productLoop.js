/**
 * One loop for signed-in people. Practice does the day.
 * Dashboard holds the record (score + map). Review is the library.
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
    to: '/practice',
    label: 'Practice',
    body: 'Today’s three rooms. What you write is saved when you hold a room.',
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    body: 'Your record. Score, map, and history live here.',
  },
  {
    to: '/reflect',
    label: 'Review',
    body: 'A small library of lines, when you need one.',
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
  { label: 'Habit Engine', body: 'Make the change practical.' },
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
