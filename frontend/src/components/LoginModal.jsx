import { useEffect } from 'react';
import LoginForm from './LoginForm';

/**
 * Sign-in as a modal with blurred backdrop (e.g. when opening Dashboard while logged out).
 */
export default function LoginModal({ open, onClose, returnTo = '/dashboard', onLoggedIn }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-alignment-deep/45 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-alignment-deep/30"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] max-h-[min(90vh,720px)] overflow-y-auto rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface shadow-apple-lg px-6 py-8 sm:px-8 sm:py-10 animate-fade-in font-sans antialiased"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-alignment-accent/50 hover:text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <LoginForm
          returnTo={returnTo}
          compact
          onSuccess={() => {
            onLoggedIn?.();
          }}
        />
      </div>
    </div>
  );
}
