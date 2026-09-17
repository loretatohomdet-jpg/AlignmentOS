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
