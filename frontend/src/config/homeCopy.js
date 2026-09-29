/**
 * Homepage interface copy. Admin overrides via SitePage.sections on path `/`.
 * Keep keys in sync with the live LandingPage.
 */
export const HOME_COPY_DEFAULTS = {
  heroImage: '/images/home/hero.jpg',
  heroImageAlt:
    'Alignment OS on a laptop — Your Alignment Map, Alignment Score, and six areas of life.',
  domainsHeading: 'One life. Six areas.',
  domainsBody: 'A simple framework to see the whole picture, so you can focus on what matters now.',
  domainsCta: 'See Your Map',
  domainIdentity: 'Identity',
  domainIdentityTag: 'Who you are',
  domainPurpose: 'Purpose',
  domainPurposeTag: 'Why it matters',
  domainMindset: 'Mindset',
  domainMindsetTag: 'How you think',
  domainHabits: 'Habits',
  domainHabitsTag: 'What you do',
  domainEnvironment: 'Environment',
  domainEnvironmentTag: 'Where you live',
  domainExecution: 'Follow-through',
  domainExecutionTag: 'How it comes together',
  loopKicker: 'How it works',
  loopHeading: 'See. Choose. Live.',
  loopCta: 'Full walkthrough',
  loopSeeTitle: 'See',
  loopSeeBody: 'The assessment names the thin place across six areas of life.',
  loopChooseTitle: 'Choose',
  loopChooseBody: 'My Plan holds one focus and a few priorities. The rest can wait.',
  loopLiveTitle: 'Live',
  loopLiveBody: 'Daily carries the practice. Notice what helps. Adjust when you need to.',
  insightHeading: 'A clearer way forward.',
  insightLine1: 'You don’t need more information. You need to see what’s already there.',
  insightLine2: 'See the pattern. Choose what matters. Make one change.',
  insightLine3: '',
  insightCta: 'Explore Alignment OS',
  outsideImage: '/images/home/outside.jpg',
  outsideImageAlt:
    'A wooden table with a white mug and a stack of books in warm sunlight.',
  outsideHeading: 'Your life belongs outside the app.',
  outsideBody: 'Alignment OS is here to help you step back, get clear, and move forward. Then close it.',
  closeLeft: 'Less noise. More intention.',
  closeMid1: 'No endless tracking.',
  closeMid2: 'No perfect routines.',
  closeMid3: 'No optimizing everything.',
  closeRightHeading: 'Start where you are.',
  closeRightBody: 'You don’t have to change everything. Just start with what matters.',
  closeCtaLabel: 'Take the Assessment',
  closeMeta: 'Free · 12 minutes · No account',
  footerTagline: 'A more intentional life is possible.',
  footerCopyright: '© Alignment OS',
};

/** Hero column defaults (SitePage top-level fields). */
export const HOME_HERO_DEFAULTS = {
  headline: 'Know what matters. Make room for it.',
  subhead:
    'You have the list. You have the plan. But knowing what to do isn’t always knowing what matters.',
  body: 'Free · 12 minutes · No account',
  ctaLabel: 'Take the Free Alignment Assessment',
  ctaHref: '/assessment',
};

/**
 * Older homepage lines still stored in CMS. When these appear, use the current defaults instead.
 */
export const STALE_HOME_COPY = {
  headline: [
    'Know what matters. Know what to do next.',
    'See which part of your life is off, and start one practice for it.',
  ],
  subhead: [
    'A system for becoming whole.',
    'You do not have to turn a score into a plan.',
    'See where your life is holding, where it is thin, and what deserves your attention now.',
  ],
  body: [
    'Six domains. One Alignment Score. A clearer path forward.',
    'The assessment names the thin place. Alignment OS starts the practice.',
    'Free. 12 minutes. No account.',
  ],
  ctaLabel: [
    'Take the free assessment',
    'Take the Assessment',
    'Take the assessment',
    'Take the Free Assessment',
  ],
  domainsHeading: ['One life Six areas.', 'One life. Six areas'],
  domainIdentity: ['Who you are'],
  domainIdentityTag: ['Who you are'],
  domainPurpose: ['Why it matters'],
  domainPurposeTag: ['Why it matters'],
  domainMindset: ['How you think'],
  domainMindsetTag: ['How you think'],
  domainHabits: ['What you do'],
  domainHabitsTag: ['What you do'],
  domainEnvironment: ['Where you live'],
  domainEnvironmentTag: ['Where you live'],
  domainExecution: ['Follow-through. How it comes together', 'How it comes together'],
  domainExecutionTag: ['How it comes together'],
  insightHeading: [
    'You don’t need more information. You need to see what’s already there.',
    "You don't need more information. You need to see what's already there.",
  ],
  insightLine1: ['The pattern is already in your days.'],
  insightLine2: ['The assessment makes it visible.'],
  insightLine3: ['Then you choose one place to begin.'],
  outsideBody: [
    'Alignment OS helps you see clearly and choose carefully — then close the screen and live what matters.',
  ],
  closeMid2: ['No perfect streak required.'],
  closeMid3: ['No more system to manage.'],
  closeRightBody: ['Take the free Alignment Assessment and see the whole picture.'],
  footerTagline: ['See what is off. Start one practice.'],
};

export const HOME_SECTION_FIELDS = [
  {
    group: 'Hero',
    key: 'heroImage',
    altKey: 'heroImageAlt',
    label: 'Hero photo',
    kind: 'image',
  },
  { group: 'Six areas', key: 'domainsHeading', label: 'Section heading' },
  { group: 'Six areas', key: 'domainsBody', label: 'Supporting line', multiline: true },
  { group: 'Six areas', key: 'domainsCta', label: 'Link to assessment' },
  { group: 'Six areas', key: 'domainIdentity', label: 'Identity label' },
  { group: 'Six areas', key: 'domainIdentityTag', label: 'Identity tag' },
  { group: 'Six areas', key: 'domainPurpose', label: 'Purpose label' },
  { group: 'Six areas', key: 'domainPurposeTag', label: 'Purpose tag' },
  { group: 'Six areas', key: 'domainMindset', label: 'Mindset label' },
  { group: 'Six areas', key: 'domainMindsetTag', label: 'Mindset tag' },
  { group: 'Six areas', key: 'domainHabits', label: 'Habits label' },
  { group: 'Six areas', key: 'domainHabitsTag', label: 'Habits tag' },
  { group: 'Six areas', key: 'domainEnvironment', label: 'Environment label' },
  { group: 'Six areas', key: 'domainEnvironmentTag', label: 'Environment tag' },
  { group: 'Six areas', key: 'domainExecution', label: 'Follow-through label' },
  { group: 'Six areas', key: 'domainExecutionTag', label: 'Follow-through tag' },
  { group: 'How it works', key: 'loopKicker', label: 'Kicker' },
  { group: 'How it works', key: 'loopHeading', label: 'Heading' },
  { group: 'How it works', key: 'loopCta', label: 'Link to full walkthrough' },
  { group: 'How it works', key: 'loopSeeTitle', label: 'See — title' },
  { group: 'How it works', key: 'loopSeeBody', label: 'See — body', multiline: true },
  { group: 'How it works', key: 'loopChooseTitle', label: 'Choose — title' },
  { group: 'How it works', key: 'loopChooseBody', label: 'Choose — body', multiline: true },
  { group: 'How it works', key: 'loopLiveTitle', label: 'Live — title' },
  { group: 'How it works', key: 'loopLiveBody', label: 'Live — body', multiline: true },
  { group: 'Insight', key: 'insightHeading', label: 'Heading', multiline: true },
  { group: 'Insight', key: 'insightLine1', label: 'Line 1', multiline: true },
  { group: 'Insight', key: 'insightLine2', label: 'Line 2', multiline: true },
  { group: 'Insight', key: 'insightLine3', label: 'Line 3', multiline: true },
  { group: 'Insight', key: 'insightCta', label: 'Button label' },
  {
    group: 'Outside the app',
    key: 'outsideImage',
    altKey: 'outsideImageAlt',
    label: 'Photo',
    kind: 'image',
  },
  { group: 'Outside the app', key: 'outsideHeading', label: 'Heading' },
  { group: 'Outside the app', key: 'outsideBody', label: 'Body', multiline: true },
  { group: 'Close', key: 'closeLeft', label: 'Left heading' },
  { group: 'Close', key: 'closeMid1', label: 'Middle line 1' },
  { group: 'Close', key: 'closeMid2', label: 'Middle line 2' },
  { group: 'Close', key: 'closeMid3', label: 'Middle line 3' },
  { group: 'Close', key: 'closeRightHeading', label: 'Right heading' },
  { group: 'Close', key: 'closeRightBody', label: 'Right body', multiline: true },
  { group: 'Close', key: 'closeCtaLabel', label: 'Button label' },
  { group: 'Close', key: 'closeMeta', label: 'Line under the button' },
  { group: 'Site footer', key: 'footerTagline', label: 'Footer tagline', multiline: true },
  { group: 'Site footer', key: 'footerCopyright', label: 'Footer copyright' },
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
