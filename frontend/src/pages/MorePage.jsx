import { Link } from 'react-router-dom';
import {
  programHubUrl,
  courseLibraryUrl,
  bookingUrl,
  formationExploreUrl,
} from '../config/externalLinks';

const rowClass =
  'flex items-center justify-between px-6 py-4 border-b border-alignment-accent/5 last:border-0 hover:bg-alignment-accent/5 transition-colors';

const Section = ({ title, children }) => (
  <div className="mt-10 first:mt-0">
    <p className="px-1 text-xs font-medium text-alignment-accent/45 uppercase tracking-wider">{title}</p>
    <div className="mt-3 rounded-2.5xl bg-alignment-surface border border-alignment-accent/[0.06] shadow-apple overflow-hidden">{children}</div>
  </div>
);

export default function MorePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">More</h1>
      <p className="mt-2 text-alignment-accent/70">App shortcuts, story, and account.</p>

      <Section title="Your alignment">
        <Link to="/results" className={rowClass}>
          <span className="font-medium text-alignment-accent">Results</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/assessment" className={rowClass}>
          <span className="font-medium text-alignment-accent">Diagnostic</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/share" className={rowClass}>
          <span className="font-medium text-alignment-accent">Share</span>
          <span className="text-sm text-alignment-accent/45">Score card</span>
        </Link>
        <Link to="/progress" className={rowClass}>
          <span className="font-medium text-alignment-accent">Progress</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/alignment-map" className={rowClass}>
          <span className="font-medium text-alignment-accent">Alignment map</span>
          <span className="text-sm text-alignment-accent/45">Full map · preview</span>
        </Link>
      </Section>

      {(programHubUrl || courseLibraryUrl || bookingUrl) && (
        <Section title="Programs & formation">
          {programHubUrl && (
            <a href={programHubUrl} className={rowClass} target="_blank" rel="noopener noreferrer">
              <span className="font-medium text-alignment-accent">Program hub</span>
              <span className="text-alignment-accent/70">↗</span>
            </a>
          )}
          {courseLibraryUrl && (
            <a href={courseLibraryUrl} className={rowClass} target="_blank" rel="noopener noreferrer">
              <span className="font-medium text-alignment-accent">Course library</span>
              <span className="text-sm text-alignment-accent/45">Teachable</span>
            </a>
          )}
          {bookingUrl && (
            <a href={bookingUrl} className={rowClass} target="_blank" rel="noopener noreferrer">
              <span className="font-medium text-alignment-accent">Book a mentor call</span>
              <span className="text-alignment-accent/70">↗</span>
            </a>
          )}
        </Section>
      )}

      <Section title="Story & pricing">
        <Link to="/platform" className={rowClass}>
          <span className="font-medium text-alignment-accent">Platform</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/framework" className={rowClass}>
          <span className="font-medium text-alignment-accent">Framework</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/about" className={rowClass}>
          <span className="font-medium text-alignment-accent">About</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/ethics" className={rowClass}>
          <span className="font-medium text-alignment-accent">Wholeness</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/pricing" className={rowClass}>
          <span className="font-medium text-alignment-accent">Pricing</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/pricing#journey-tier" className={rowClass}>
          <span className="font-medium text-alignment-accent">Journey</span>
          <span className="text-sm text-alignment-accent/45">Journey to Purpose</span>
        </Link>
        <Link to="/start" className={rowClass}>
          <span className="font-medium text-alignment-accent">Becoming</span>
          <span className="text-sm text-alignment-accent/45">Start</span>
        </Link>
      </Section>

      <Section title="Organizations">
        <Link to="/leaders" className={rowClass}>
          <span className="font-medium text-alignment-accent">Leaders</span>
          <span className="text-sm text-alignment-accent/45">Hub coming · links inside</span>
        </Link>
        <Link to="/organizations" className={rowClass}>
          <span className="font-medium text-alignment-accent">Organizations</span>
          <span className="text-sm text-alignment-accent/45">Hub coming · links inside</span>
        </Link>
        <Link to="/institution" className={rowClass}>
          <span className="font-medium text-alignment-accent">Institutions</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/business" className={rowClass}>
          <span className="font-medium text-alignment-accent">Team alignment overview</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <a href="mailto:organizations@alignmentos.com" className={rowClass}>
          <span className="font-medium text-alignment-accent">Cohorts (email)</span>
          <span className="text-alignment-accent/70">→</span>
        </a>
      </Section>

      <Section title="Account & help">
        <Link to="/agent" className={rowClass}>
          <span className="font-medium text-alignment-accent">AI Agent</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/profile" className={rowClass}>
          <span className="font-medium text-alignment-accent">Account</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <Link to="/privacy" className={rowClass}>
          <span className="font-medium text-alignment-accent">Data & Privacy</span>
          <span className="text-alignment-accent/70">→</span>
        </Link>
        <a
          href="mailto:support@alignmentos.com"
          className={rowClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="font-medium text-alignment-accent">Support</span>
          <span className="text-alignment-accent/70">→</span>
        </a>
        <a href={formationExploreUrl()} className={rowClass} target="_blank" rel="noopener noreferrer">
          <span className="font-medium text-alignment-accent">Explore formation</span>
          <span className="text-alignment-accent/70">↗</span>
        </a>
      </Section>
    </div>
  );
}
