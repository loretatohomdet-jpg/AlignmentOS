import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Floating AI agent entry — drops in from above (see `animate-agent-pop` in tailwind.config).
 * Sits above the mobile tab bar when logged in.
 */
export default function AgentFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasToken, setHasToken] = useState(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false
  );

  useEffect(() => {
    const sync = () => setHasToken(!!localStorage.getItem('accessToken'));
    window.addEventListener('alignment-auth', sync);
    return () => window.removeEventListener('alignment-auth', sync);
  }, []);

  if (location.pathname === '/agent') return null;

  const go = () => {
    if (hasToken) navigate('/agent');
    else navigate('/login?returnTo=/agent');
  };

  const bottomClass = hasToken
    ? 'bottom-24 md:bottom-8'
    : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-8';

  return (
    <button
      type="button"
      onClick={go}
      className={`agent-fab fixed right-4 md:right-8 z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-alignment-primary text-white shadow-apple-lg ring-1 ring-alignment-primary/15 transition-transform hover:scale-105 active:scale-95 animate-agent-pop ${bottomClass}`}
      aria-label={hasToken ? 'Open AI agent' : 'Sign in to use the AI agent'}
      title="AI agent"
    >
      <span className="sr-only">AI agent</span>
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
