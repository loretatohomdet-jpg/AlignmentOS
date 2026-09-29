/**
 * Extra CMS fields (SitePage.sections) for marketing pages beyond the hero.
 * Each path maps to defaults + admin field groups.
 * Keep keys in sync with the live page components.
 */
import { HOME_COPY_DEFAULTS, HOME_SECTION_FIELDS } from './homeCopy';

export const HOW_IT_WORKS_SECTION_DEFAULTS = {
  heroImage: '/images/how-it-works/hero.jpg',
  heroImageAlt:
    'Alignment OS on a laptop — Alignment Map, today’s practice, My Plan, and Weekly Review.',
  heroMeta: 'Free · 12 minutes · No account',
  seeKicker: 'See',
  seeHeading: 'See the whole picture.',
  seeBody: 'Your Map brings six areas of life into one view.',
  chooseKicker: 'Choose',
  chooseHeading: 'Choose what matters now.',
  chooseBody: 'One focus. A few priorities. Let the rest wait.',
  liveKicker: 'Live',
  liveHeading: 'Make one change.',
  liveBody: 'Practice it. Notice what happens. Adjust when you need to.',
  closeKicker: 'That’s it',
  closeHeading: 'See the pattern. Choose what matters. Make one change.',
  closeBody: 'Then go live it.',
  closeMeta: 'Free · 12 minutes · No account',
};

export const HOW_IT_WORKS_SECTION_FIELDS = [
  { group: 'Hero', key: 'heroImage', altKey: 'heroImageAlt', label: 'Hero photo', kind: 'image' },
  { group: 'Hero', key: 'heroMeta', label: 'Line under the button' },
  { group: 'See', key: 'seeKicker', label: 'Kicker' },
  { group: 'See', key: 'seeHeading', label: 'Heading' },
  { group: 'See', key: 'seeBody', label: 'Body', multiline: true },
  { group: 'Choose', key: 'chooseKicker', label: 'Kicker' },
  { group: 'Choose', key: 'chooseHeading', label: 'Heading' },
  { group: 'Choose', key: 'chooseBody', label: 'Body', multiline: true },
  { group: 'Live', key: 'liveKicker', label: 'Kicker' },
  { group: 'Live', key: 'liveHeading', label: 'Heading' },
  { group: 'Live', key: 'liveBody', label: 'Body', multiline: true },
  { group: 'Close', key: 'closeKicker', label: 'Kicker' },
  { group: 'Close', key: 'closeHeading', label: 'Heading', multiline: true },
  { group: 'Close', key: 'closeBody', label: 'Body', multiline: true },
  { group: 'Close', key: 'closeMeta', label: 'Line under the button' },
];

export const ABOUT_SECTION_DEFAULTS = {
  heroImage: '/images/about/hero.jpg',
  heroImageAlt:
    'A quiet room with a woven chair by the window, looking out over green hills — book, mug, and olive plant on the table.',
  heroAccent: 'Clarity today. A more human tomorrow.',
  problemHeading: 'The problem',
  problemBody1:
    'Most of us do not lack information. We live inside competing responsibilities, changing seasons, limited time, habits, relationships, environments, and expectations.',
  problemBody2: 'Eventually, what matters can become difficult to see.',
  problemBody3: 'Alignment OS was created to help make it visible again.',
  problemAside: 'Same human questions. A brighter way forward.',
  beliefsHeading: 'The view of the person behind the work',
  belief1Title: 'The whole person',
  belief1Body:
    'A Catholic understanding of the human person — dignity, freedom, and the call to become who you are.',
  belief2Title: 'Inherent dignity',
  belief2Body: 'You are more than your productivity. Your life has worth beyond what you achieve.',
  belief3Title: 'True freedom',
  belief3Body: 'Freedom is not endless option. It is the capacity to choose what is good and stay with it.',
  belief4Title: 'Habits shape a life',
  belief4Body: 'What you repeatedly do forms who you become. Attention, practice, and review matter.',
  belief5Title: 'One life, many parts',
  belief5Body: 'Identity, purpose, mindset, habits, environment, and follow-through belong together.',
  belief6Title: 'Lived in community',
  belief6Body: 'Truth, virtue, and relationship are not private projects. A fuller life is shared.',
  quote: 'Your life belongs outside the app.',
  openHeading: 'Open to anyone.',
  openBody:
    'You do not need a perfect week, a new identity, or another system to manage. Alignment OS is for people who want to see clearly, choose carefully, and live what matters — whatever your season.',
  techHeading: 'Technology should serve the person.',
  techBody:
    'We don’t think you need to optimize everything. Your life is not a performance dashboard. Technology should support attention, formation, and ordinary faithfulness — not compete with them.',
  techAccent: 'Tools for a fuller life. Not a longer scroll.',
  storyKicker: 'Ordinary life changes everything.',
  storyHeading: 'Built from ordinary life.',
  storyBody1:
    'Alignment OS grew from work around identity, formation, purpose, habits, and the ordinary structures that shape a life.',
  storyBody2:
    'It also grew from something practical: trying to make the different parts of life work together without reducing life to productivity. The planner came first. Then the questions became larger.',
  storyBody3: 'Alignment OS is what grew from them.',
  storySignoff: '— Monica Anyango',
  storyCta: 'Read Monica’s story',
  storyAside: 'Different experiences. A more whole life.',
  closeHeading: 'Start where you are.',
  closeBody: 'Take the free Alignment Assessment.',
  closeMeta: 'Free · 12 minutes · No account',
  closeAccent: 'A more aligned you. A brighter world.',
  closeSecondary: 'See how it works',
};

export const ABOUT_SECTION_FIELDS = [
  { group: 'Hero', key: 'heroImage', altKey: 'heroImageAlt', label: 'Hero photo', kind: 'image' },
  { group: 'Hero', key: 'heroAccent', label: 'Accent line under the subhead' },
  { group: 'The problem', key: 'problemHeading', label: 'Heading' },
  { group: 'The problem', key: 'problemBody1', label: 'Paragraph 1', multiline: true },
  { group: 'The problem', key: 'problemBody2', label: 'Paragraph 2', multiline: true },
  { group: 'The problem', key: 'problemBody3', label: 'Paragraph 3', multiline: true },
  { group: 'The problem', key: 'problemAside', label: 'Aside quote' },
  { group: 'Beliefs', key: 'beliefsHeading', label: 'Section heading' },
  { group: 'Beliefs', key: 'belief1Title', label: 'Belief 1 — title' },
  { group: 'Beliefs', key: 'belief1Body', label: 'Belief 1 — body', multiline: true },
  { group: 'Beliefs', key: 'belief2Title', label: 'Belief 2 — title' },
  { group: 'Beliefs', key: 'belief2Body', label: 'Belief 2 — body', multiline: true },
  { group: 'Beliefs', key: 'belief3Title', label: 'Belief 3 — title' },
  { group: 'Beliefs', key: 'belief3Body', label: 'Belief 3 — body', multiline: true },
  { group: 'Beliefs', key: 'belief4Title', label: 'Belief 4 — title' },
  { group: 'Beliefs', key: 'belief4Body', label: 'Belief 4 — body', multiline: true },
  { group: 'Beliefs', key: 'belief5Title', label: 'Belief 5 — title' },
  { group: 'Beliefs', key: 'belief5Body', label: 'Belief 5 — body', multiline: true },
  { group: 'Beliefs', key: 'belief6Title', label: 'Belief 6 — title' },
  { group: 'Beliefs', key: 'belief6Body', label: 'Belief 6 — body', multiline: true },
  { group: 'Quote', key: 'quote', label: 'Quote band' },
  { group: 'Philosophy', key: 'openHeading', label: 'Left heading' },
  { group: 'Philosophy', key: 'openBody', label: 'Left body', multiline: true },
  { group: 'Philosophy', key: 'techHeading', label: 'Right heading' },
  { group: 'Philosophy', key: 'techBody', label: 'Right body', multiline: true },
  { group: 'Philosophy', key: 'techAccent', label: 'Right accent line' },
  { group: 'Story', key: 'storyKicker', label: 'Italic kicker' },
  { group: 'Story', key: 'storyHeading', label: 'Heading' },
  { group: 'Story', key: 'storyBody1', label: 'Paragraph 1', multiline: true },
  { group: 'Story', key: 'storyBody2', label: 'Paragraph 2', multiline: true },
  { group: 'Story', key: 'storyBody3', label: 'Paragraph 3', multiline: true },
  { group: 'Story', key: 'storySignoff', label: 'Sign-off' },
  { group: 'Story', key: 'storyCta', label: 'Story button label' },
  { group: 'Story', key: 'storyAside', label: 'Aside line' },
  { group: 'Close', key: 'closeHeading', label: 'Heading' },
  { group: 'Close', key: 'closeBody', label: 'Body' },
  { group: 'Close', key: 'closeMeta', label: 'Line under the button' },
  { group: 'Close', key: 'closeAccent', label: 'Accent line' },
  { group: 'Close', key: 'closeSecondary', label: 'Secondary link label' },
];

export const PLATFORM_SECTION_DEFAULTS = {
  heroImage: '/images/platform/hero.jpg',
  heroImageAlt: 'Alignment OS on laptop and phone — today’s focus, practice, and alignment score.',
  heroMeta: 'Free · 12 minutes · No account',
  domainsKicker: 'One life. Six areas',
  domainsHeading: 'One life. Six areas.',
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
  loopSeeTitle: 'See',
  loopSeeBody: 'Your Map shows the whole picture.',
  loopChooseTitle: 'Choose',
  loopChooseBody: 'Your Plan names what matters now.',
  loopLiveTitle: 'Live',
  loopLiveBody: 'Daily + Review help you practice and adjust.',
  closeImage: '/images/planner/paper-lifestyle.png',
  closeImageAlt: 'Alignment OS planner on a wooden table.',
  outsideHeading: 'Your life belongs outside the app.',
  outsideBody: 'Get clear. Make the change. Then close it.',
  outsideMeta: 'Free · 12 minutes · No account',
};

export const PLATFORM_SECTION_FIELDS = [
  { group: 'Hero', key: 'heroImage', altKey: 'heroImageAlt', label: 'Hero photo', kind: 'image' },
  { group: 'Hero', key: 'heroMeta', label: 'Line under the button' },
  { group: 'Six areas', key: 'domainsKicker', label: 'Kicker' },
  { group: 'Six areas', key: 'domainsHeading', label: 'Heading' },
  { group: 'Six areas', key: 'domainsCta', label: 'Button label' },
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
  { group: 'How it works', key: 'loopSeeTitle', label: 'See — title' },
  { group: 'How it works', key: 'loopSeeBody', label: 'See — body', multiline: true },
  { group: 'How it works', key: 'loopChooseTitle', label: 'Choose — title' },
  { group: 'How it works', key: 'loopChooseBody', label: 'Choose — body', multiline: true },
  { group: 'How it works', key: 'loopLiveTitle', label: 'Live — title' },
  { group: 'How it works', key: 'loopLiveBody', label: 'Live — body', multiline: true },
  { group: 'Close', key: 'closeImage', altKey: 'closeImageAlt', label: 'Photo', kind: 'image' },
  { group: 'Close', key: 'outsideHeading', label: 'Heading' },
  { group: 'Close', key: 'outsideBody', label: 'Body', multiline: true },
  { group: 'Close', key: 'outsideMeta', label: 'Line under the button' },
];

export const SHOP_SECTION_DEFAULTS = {
  heroImage: '/images/shop/hero.jpg',
  heroImageAlt: 'Life of Purpose Planner with gift bag, box, and pen.',
  plannerCta: 'Explore the Planner',
  featuredImage: '/images/planner/paper-foil.png',
  featuredImageAlt: 'Life of Purpose Planner foil edition.',
  featuredHeading: 'One place for the life you’re actually living.',
  featuredBody:
    'The Life of Purpose Planner helps you decide what matters, make room for it, and carry those priorities into your day.',
  featuredCta: 'Explore the Planner',
  shelfHeading: 'Start with what you need.',
  shelfBody: 'Use the tools digitally, or print them at home. Each one does one job well.',
  collectionImage: '/images/shop/tools-collection.jpg',
  collectionImageAlt: 'Alignment OS tools — Clarity and Quarterly Review covers',
  collectionHeading: 'Not more to manage.',
  collectionBody: 'Simple tools for seeing clearly, practicing daily, and returning when life shifts.',
  collectionKicker: 'The Alignment Tools Collection',
  assessKicker: 'Alignment Assessment',
  assessBody: 'Not sure where to begin? Start with the free assessment.',
  assessCta: 'Take the Assessment',
  assessMeta: 'Free · 12 minutes · No account',
};

export const SHOP_SECTION_FIELDS = [
  { group: 'Hero', key: 'heroImage', altKey: 'heroImageAlt', label: 'Hero photo', kind: 'image' },
  { group: 'Hero', key: 'plannerCta', label: 'Primary button label' },
  {
    group: 'Featured planner',
    key: 'featuredImage',
    altKey: 'featuredImageAlt',
    label: 'Photo',
    kind: 'image',
  },
  { group: 'Featured planner', key: 'featuredHeading', label: 'Heading' },
  { group: 'Featured planner', key: 'featuredBody', label: 'Body', multiline: true },
  { group: 'Featured planner', key: 'featuredCta', label: 'Button label' },
  { group: 'Tool shelf', key: 'shelfHeading', label: 'Heading' },
  { group: 'Tool shelf', key: 'shelfBody', label: 'Body', multiline: true },
  {
    group: 'Collection',
    key: 'collectionImage',
    altKey: 'collectionImageAlt',
    label: 'Photo',
    kind: 'image',
  },
  { group: 'Collection', key: 'collectionHeading', label: 'Heading' },
  { group: 'Collection', key: 'collectionBody', label: 'Body', multiline: true },
  { group: 'Collection', key: 'collectionKicker', label: 'Collection kicker' },
  { group: 'Assessment', key: 'assessKicker', label: 'Kicker' },
  { group: 'Assessment', key: 'assessBody', label: 'Body', multiline: true },
  { group: 'Assessment', key: 'assessCta', label: 'Button label' },
  { group: 'Assessment', key: 'assessMeta', label: 'Line under the button' },
];

/** Which top-level hero columns this path actually renders (admin form). */
export const HERO_FIELDS_BY_PATH = {
  '/': [
    { key: 'headline', label: 'Headline' },
    { key: 'subhead', label: 'Subhead', multiline: true },
    { key: 'body', label: 'Line under the button' },
    { key: 'ctaLabel', label: 'Primary button label' },
    { key: 'ctaHref', label: 'Primary button link' },
  ],
  '/how-it-works': [
    { key: 'eyebrow', label: 'Kicker (small line above the headline)' },
    { key: 'headline', label: 'Headline' },
    { key: 'body', label: 'Body', multiline: true },
    { key: 'ctaLabel', label: 'Primary button label' },
    { key: 'ctaHref', label: 'Primary button link' },
  ],
  '/about': [
    { key: 'eyebrow', label: 'Kicker (small line above the headline)' },
    { key: 'headline', label: 'Headline' },
    { key: 'subhead', label: 'Subhead', multiline: true },
    { key: 'ctaLabel', label: 'Close button label' },
    { key: 'ctaHref', label: 'Close button link' },
  ],
  '/platform': [
    { key: 'eyebrow', label: 'Kicker (small line above the headline)' },
    { key: 'headline', label: 'Headline' },
    { key: 'subhead', label: 'Subhead', multiline: true },
    { key: 'ctaLabel', label: 'Primary button label' },
    { key: 'ctaHref', label: 'Primary button link' },
  ],
  '/shop': [
    { key: 'eyebrow', label: 'Kicker (small line above the headline)' },
    { key: 'headline', label: 'Headline' },
    { key: 'body', label: 'Body', multiline: true },
  ],
};

export const DEFAULT_HERO_FIELDS = [
  { key: 'eyebrow', label: 'Kicker (small line above the headline)' },
  { key: 'headline', label: 'Headline' },
  { key: 'subhead', label: 'Subhead', multiline: true },
  { key: 'body', label: 'Body', multiline: true },
  { key: 'ctaLabel', label: 'Primary button label' },
  { key: 'ctaHref', label: 'Primary button link' },
];

export function heroFieldsForPath(path) {
  return HERO_FIELDS_BY_PATH[path] || DEFAULT_HERO_FIELDS;
}

/** path → { defaults, fields } */
export const PAGE_SECTION_CONFIG = {
  '/': { defaults: HOME_COPY_DEFAULTS, fields: HOME_SECTION_FIELDS },
  '/how-it-works': { defaults: HOW_IT_WORKS_SECTION_DEFAULTS, fields: HOW_IT_WORKS_SECTION_FIELDS },
  '/about': { defaults: ABOUT_SECTION_DEFAULTS, fields: ABOUT_SECTION_FIELDS },
  '/platform': { defaults: PLATFORM_SECTION_DEFAULTS, fields: PLATFORM_SECTION_FIELDS },
  '/shop': { defaults: SHOP_SECTION_DEFAULTS, fields: SHOP_SECTION_FIELDS },
};

export function sectionConfigForPath(path) {
  return PAGE_SECTION_CONFIG[path] || null;
}

export function mergePageSections(path, sections) {
  const config = sectionConfigForPath(path);
  if (!config) return {};
  const raw = sections && typeof sections === 'object' && !Array.isArray(sections) ? sections : {};
  const out = { ...config.defaults };
  for (const key of Object.keys(config.defaults)) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) out[key] = value.trim();
  }
  return out;
}
