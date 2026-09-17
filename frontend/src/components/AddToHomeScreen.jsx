import { useEffect, useState } from 'react';
import { pillPrimary } from './HomeMarketingChrome';
import { type } from '../config/siteType';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    Boolean(window.navigator.standalone)
  );
}

function isIos() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function AddToHomeScreen() {
  const [hidden, setHidden] = useState(() => isStandalone());
  const [deferred, setDeferred] = useState(null);
  const [ios] = useState(() => isIos());
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true);
      return undefined;
    }
    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
    };
    const onInstalled = () => {
      setAdded(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (hidden) return null;

  const addFromBrowser = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      const result = await deferred.userChoice;
      if (result?.outcome === 'accepted') setAdded(true);
    } catch (_) {
      /* the browser handles this */
    }
    setDeferred(null);
  };

  return (
    <section className="rounded-2xl border border-alignment-accent/[0.08] bg-alignment-surface px-5 py-6 sm:px-6">
      <p className={type.kicker}>On your phone</p>
      <h2 className="mt-3 font-medium text-alignment-accent">Add to Home Screen</h2>
      <p className="mt-2 text-sm text-alignment-accent/60 leading-relaxed">
        It sits on the home screen like an app. No store. No download.
      </p>
      {added ? (
        <p className="mt-4 text-sm text-alignment-accent/70">Added. Look for Alignment OS on your home screen.</p>
      ) : ios ? (
        <p className="mt-4 text-sm text-alignment-accent/70 leading-relaxed">
          On iPhone: tap <span className="text-alignment-accent">Share</span>, then{' '}
          <span className="text-alignment-accent">Add to Home Screen</span>.
        </p>
      ) : deferred ? (
        <button type="button" onClick={addFromBrowser} className={`${pillPrimary} mt-5`}>
          Add to Home Screen
        </button>
      ) : (
        <p className="mt-4 text-sm text-alignment-accent/70 leading-relaxed">
          Open the browser menu and tap <span className="text-alignment-accent">Add to Home Screen</span> or{' '}
          <span className="text-alignment-accent">Install app</span>.
        </p>
      )}
      {!added && !deferred && !ios ? (
        <p className={`${type.muted} mt-3`}>Safari and Chrome on a phone work best.</p>
      ) : null}
    </section>
  );
}
