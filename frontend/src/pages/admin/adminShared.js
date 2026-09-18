export function adminHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ADMIN_NAV = [
  { to: '/admin/overview', label: 'Home', hint: 'Snapshot', end: true, tone: 'olive' },
  { to: '/admin/pages', label: 'Pages', hint: 'Every site page', tone: 'plum' },
  { to: '/admin/shop', label: 'Shop', hint: 'Products & prices', tone: 'rose' },
  { to: '/admin/users', label: 'People', hint: 'Create · edit · remove', tone: 'clay' },
  { to: '/admin/assessments', label: 'Assessment', hint: 'Questions & scoring', tone: 'teal' },
  { to: '/admin/habits', label: 'Practice', hint: 'Habits & rooms', tone: 'slate' },
  { to: '/admin/leads', label: 'Inbox', hint: 'Emails from the site', tone: 'gold' },
];

export const TONE = {
  olive: { bg: 'bg-[#6E7158]', soft: 'bg-[#6E7158]/15', text: 'text-[#6E7158]', chip: 'bg-[#6E7158] text-white' },
  clay: { bg: 'bg-[#C4785A]', soft: 'bg-[#C4785A]/15', text: 'text-[#9A4F38]', chip: 'bg-[#C4785A] text-white' },
  teal: { bg: 'bg-[#4A7C73]', soft: 'bg-[#4A7C73]/15', text: 'text-[#3A635C]', chip: 'bg-[#4A7C73] text-white' },
  gold: { bg: 'bg-[#C4A35A]', soft: 'bg-[#C4A35A]/20', text: 'text-[#8A7030]', chip: 'bg-[#C4A35A] text-[#2c2e26]' },
  plum: { bg: 'bg-[#6B5B8A]', soft: 'bg-[#6B5B8A]/15', text: 'text-[#5A4A78]', chip: 'bg-[#6B5B8A] text-white' },
  rose: { bg: 'bg-[#B56B6B]', soft: 'bg-[#B56B6B]/15', text: 'text-[#8E4A4A]', chip: 'bg-[#B56B6B] text-white' },
  slate: { bg: 'bg-[#5A7A8C]', soft: 'bg-[#5A7A8C]/15', text: 'text-[#3F5C6B]', chip: 'bg-[#5A7A8C] text-white' },
};

export const PILLAR_CHIP = {
  IDENTITY: 'bg-[#6E7158] text-white',
  PURPOSE: 'bg-[#C4785A] text-white',
  MINDSET: 'bg-[#7A8B6E] text-white',
  HABITS: 'bg-[#C4A35A] text-[#2c2e26]',
  ENVIRONMENT: 'bg-[#4A7C73] text-white',
  EXECUTION: 'bg-[#8B5E3C] text-white',
};

export const fieldClass =
  'w-full rounded-xl border border-alignment-accent/15 bg-white px-3 py-2.5 text-sm text-alignment-accent placeholder:text-alignment-accent/45 focus:border-alignment-primary/40 focus:outline-none focus:ring-2 focus:ring-alignment-primary/15';

export const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-alignment-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors';

export const btnDanger =
  'inline-flex items-center justify-center rounded-full bg-[#C45C4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#b04e3e] disabled:opacity-50 transition-colors';

export const btnGhost =
  'inline-flex items-center justify-center rounded-full border border-alignment-accent/20 px-4 py-2 text-sm font-medium text-alignment-accent hover:bg-alignment-accent/5 disabled:opacity-50 transition-colors';

export function confirmDelete(what) {
  return window.confirm(`Delete ${what}? This cannot be undone.`);
}
