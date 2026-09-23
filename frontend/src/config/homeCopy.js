/**
 * Default interface copy for the homepage.
 * Admin can override any of these via SitePage.sections (and the hero fields).
 */
export const HOME_COPY_DEFAULTS = {
  heroSecondaryCta: 'How it works',
  quote: 'You need structure beneath the effort — not more effort.',
  stepsHeading: 'Four steps. One system.',
  step1: 'Diagnostic',
  step2: 'Identity anchors',
  step3: 'Habit engine',
  step4: 'Weekly review',
  stepsCta: 'Start free',
  domainsHeading: 'Six domains',
  domainIdentity: 'Identity',
  domainPurpose: 'Purpose',
  domainMindset: 'Mindset',
  domainHabits: 'Habits',
  domainEnvironment: 'Environment',
  domainExecution: 'Execution',
  proofQuestions: 'Questions',
  proofDomains: 'Life domains',
  proofCycles: 'Day cycles',
  proofMinutes: 'Minutes',
  plannerKicker: 'The signature planner',
  plannerBody:
    'A thoughtfully designed planner for carrying what matters into the days and weeks of your actual life. Not more to manage. A clearer way to decide what deserves your time.',
  plannerCta: 'Explore the Planner',
  toolsKicker: 'The Alignment Tools',
  toolsHeading: 'Three tools. Three places to begin.',
  toolsBody: 'Focused guides for the moments you need them most.',
  resetKicker: 'Need a fresh start?',
  resetCta: 'Begin with Reset',
  shopCta: 'Explore all tools',
  emailKicker: 'The Alignment Reset',
  emailHeading: 'Get the guide.',
  emailBody: 'A short letter on where life holds, where it strains, and how to begin. We’ll send it to your inbox.',
  emailButton: 'Get the Alignment Reset guide',
  emailHelper: 'No spam. Unsubscribe any time.',
  emailSuccess: 'The Alignment Reset guide is on its way to your inbox.',
  preferDiagnostic: 'Prefer the diagnostic? Begin free',
  alreadyAccount: 'Already have an account? Dashboard',
};

export const HOME_SECTION_FIELDS = [
  { group: 'Hero', key: 'heroSecondaryCta', label: 'Second button (How it works)' },
  { group: 'Quote', key: 'quote', label: 'Quote under the marquee', multiline: true },
  { group: 'Four steps', key: 'stepsHeading', label: 'Section heading' },
  { group: 'Four steps', key: 'step1', label: 'Step 1' },
  { group: 'Four steps', key: 'step2', label: 'Step 2' },
  { group: 'Four steps', key: 'step3', label: 'Step 3' },
  { group: 'Four steps', key: 'step4', label: 'Step 4' },
  { group: 'Four steps', key: 'stepsCta', label: 'Link under the steps' },
  { group: 'Six domains', key: 'domainsHeading', label: 'Section heading' },
  { group: 'Six domains', key: 'domainIdentity', label: 'Identity' },
  { group: 'Six domains', key: 'domainPurpose', label: 'Purpose' },
  { group: 'Six domains', key: 'domainMindset', label: 'Mindset' },
  { group: 'Six domains', key: 'domainHabits', label: 'Habits' },
  { group: 'Six domains', key: 'domainEnvironment', label: 'Environment' },
  { group: 'Six domains', key: 'domainExecution', label: 'Execution' },
  { group: 'Proof numbers', key: 'proofQuestions', label: 'Label under 24' },
  { group: 'Proof numbers', key: 'proofDomains', label: 'Label under 6' },
  { group: 'Proof numbers', key: 'proofCycles', label: 'Label under 90' },
  { group: 'Proof numbers', key: 'proofMinutes', label: 'Label under 12' },
  { group: 'Planner & tools', key: 'plannerKicker', label: 'Planner kicker' },
  { group: 'Planner & tools', key: 'plannerBody', label: 'Planner body', multiline: true },
  { group: 'Planner & tools', key: 'plannerCta', label: 'Explore the Planner' },
  { group: 'Planner & tools', key: 'toolsKicker', label: 'Tools kicker' },
  { group: 'Planner & tools', key: 'toolsHeading', label: 'Tools heading' },
  { group: 'Planner & tools', key: 'toolsBody', label: 'Tools body', multiline: true },
  { group: 'Planner & tools', key: 'resetKicker', label: 'Reset kicker' },
  { group: 'Planner & tools', key: 'resetCta', label: 'Begin with Reset' },
  { group: 'Planner & tools', key: 'shopCta', label: 'Explore all tools' },
  { group: 'Email close', key: 'emailKicker', label: 'Kicker' },
  { group: 'Email close', key: 'emailHeading', label: 'Heading' },
  { group: 'Email close', key: 'emailBody', label: 'Body', multiline: true },
  { group: 'Email close', key: 'emailButton', label: 'Form button' },
  { group: 'Email close', key: 'emailHelper', label: 'Form helper' },
  { group: 'Email close', key: 'emailSuccess', label: 'Success message', multiline: true },
  { group: 'Email close', key: 'preferDiagnostic', label: 'Prefer the diagnostic link' },
  { group: 'Email close', key: 'alreadyAccount', label: 'Already have an account link' },
];

export function mergeHomeSections(sections) {
  const raw = sections && typeof sections === 'object' && !Array.isArray(sections) ? sections : {};
  const out = { ...HOME_COPY_DEFAULTS };
  for (const key of Object.keys(HOME_COPY_DEFAULTS)) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) out[key] = value.trim();
  }
  return out;
}
