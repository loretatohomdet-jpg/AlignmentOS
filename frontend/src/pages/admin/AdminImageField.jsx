import { useRef, useState } from 'react';
import { fieldClass, btnGhost } from './adminShared';

const MAX_BYTES = 350 * 1024;

/**
 * Image URL / path / uploaded data-URL editor with live preview.
 * Pass `onChangeAlt` to edit alt text; omit it for path-only (e.g. shop products).
 */
export default function AdminImageField({ label, src, alt, onChangeSrc, onChangeAlt }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const showAlt = typeof onChangeAlt === 'function';

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      setError('Use JPEG, PNG, WebP, or GIF');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Keep the image under ${Math.round(MAX_BYTES / 1024)}KB`);
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      onChangeSrc(dataUrl);
    } catch {
      setError('Could not read that file');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-alignment-accent/10 bg-alignment-page/40 p-3">
      <span className="text-xs font-medium uppercase tracking-wide text-[#5A4A78]">{label}</span>
      {src ? (
        <div className="overflow-hidden rounded-lg bg-alignment-surfaceSoft aspect-[16/10] max-h-48">
          <img src={src} alt={alt || ''} className="h-full w-full object-cover object-center" />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-alignment-accent/20 px-4 py-8 text-center text-sm text-alignment-accent/60">
          No image yet
        </div>
      )}
      <label className="block">
        <span className="text-[11px] text-alignment-accent/70">Image path or URL</span>
        <input
          className={`${fieldClass} mt-1`}
          value={src || ''}
          onChange={(e) => onChangeSrc(e.target.value)}
          placeholder="/images/… or https://…"
        />
      </label>
      {showAlt ? (
        <label className="block">
          <span className="text-[11px] text-alignment-accent/70">Alt text (accessibility)</span>
          <input
            className={`${fieldClass} mt-1`}
            value={alt || ''}
            onChange={(e) => onChangeAlt(e.target.value)}
            placeholder="Describe the photo"
          />
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={pickFile}
        />
        <button
          type="button"
          className={btnGhost}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Reading…' : 'Upload image'}
        </button>
        <span className="text-[11px] text-alignment-accent/55">JPEG · PNG · WebP · GIF · max 350KB</span>
      </div>
      {error ? <p className="text-sm text-[#C45C4A]">{error}</p> : null}
    </div>
  );
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
