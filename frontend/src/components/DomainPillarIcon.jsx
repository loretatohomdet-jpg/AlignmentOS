/**
 * Minimal line icons for the six AQ domains (original SVGs — no external fetch).
 * stroke="currentColor" — set text color on parent (e.g. text-alignment-accent).
 */
const vb = '0 0 24 24';

function SvgWrap({ children, className, title }) {
  return (
    <svg
      className={className}
      viewBox={vb}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function IconIdentity({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <circle cx="12" cy="6.25" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="6.25" r="0.55" fill="currentColor" />
      <path
        d="M6.5 18.75c0-3.35 2.45-5.5 5.5-5.5s5.5 2.15 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </SvgWrap>
  );
}

function IconPurpose({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="0.55" fill="currentColor" />
      <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </SvgWrap>
  );
}

function IconMindset({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <path
        d="M12 18.5h-1.5a3 3 0 0 1-3-3v-1.5a4.25 4.25 0 1 1 8.5 0V15.5a3 3 0 0 1-3 3H12Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9 18.5v1M15 18.5v1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10 7.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </SvgWrap>
  );
}

function IconHabits({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <path
        d="M7.5 6.5h9a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V8a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9 6.5V5M15 6.5V5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9.5 13.5 11 15l3.5-3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </SvgWrap>
  );
}

function IconEnvironment({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <path
        d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect x="7" y="10.5" width="10" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M11 14.5h2v2.5H11z" fill="currentColor" />
    </SvgWrap>
  );
}

function IconExecution({ className, title }) {
  return (
    <SvgWrap className={className} title={title}>
      <path d="M6 6v12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 12h9.5l-2.5-2.5M17.5 12 15 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </SvgWrap>
  );
}

const BY_KEY = {
  IDENTITY: IconIdentity,
  PURPOSE: IconPurpose,
  MINDSET: IconMindset,
  HABITS: IconHabits,
  ENVIRONMENT: IconEnvironment,
  EXECUTION: IconExecution,
};

/**
 * @param {object} props
 * @param {keyof typeof BY_KEY} props.pillar
 * @param {string} [props.className] e.g. "w-6 h-6 shrink-0 text-alignment-accent/80"
 * @param {string} [props.label] — passed to <title> for a11y
 */
export default function DomainPillarIcon({ pillar, className = 'w-6 h-6 shrink-0', label }) {
  const Cmp = BY_KEY[pillar];
  if (!Cmp) return null;
  return <Cmp className={className} title={label} />;
}
