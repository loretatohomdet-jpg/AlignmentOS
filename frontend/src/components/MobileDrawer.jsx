import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MobileDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const drawer = (
    <>
      <div
        role="presentation"
        aria-hidden={!open}
        className={`fixed inset-0 z-[500] bg-alignment-deep/25 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-[510] h-[100dvh] max-h-[100dvh] w-full max-w-sm bg-alignment-surface shadow-apple-lg flex flex-col transition-transform duration-300 ease-out lg:hidden pt-[env(safe-area-inset-top)] ${
          open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between h-14 px-4 sm:px-6 border-b border-alignment-accent/[0.06]">
          <span className="text-lg font-semibold tracking-tight text-alignment-accent">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-alignment-accent/70 hover:bg-alignment-accent/5 hover:text-alignment-accent transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </nav>
      </aside>
    </>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(drawer, document.body);
}
