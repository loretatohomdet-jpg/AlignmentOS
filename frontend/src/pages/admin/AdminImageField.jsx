import { useRef, useState } from 'react';
import { fieldClass, btnGhost } from './adminShared';

const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.72;

/**
 * Image URL / path / uploaded data-URL editor with live preview.
 * Pass `onChangeAlt` to edit alt text; omit it for path-only (e.g. shop products).
 * Uploads are resized/compressed so Admin saves stay within API body limits.
 */
export default function AdminImageField({ label, src, alt, onChangeSrc, onChangeAlt }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const showAlt = typeof onChangeAlt === 'function';
  const pathOnly = Boolean(src && !String(src).startsWith('data:'));

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      setError('Use JPEG, PNG, WebP, or GIF');
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError('Image is too large (max 8MB). Try a smaller file.');
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      onChangeSrc(dataUrl);
    } catch (err) {
      setError(err?.message || 'Could not process that file');
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
        <span className="text-[11px] text-alignment-accent/70">
          {pathOnly ? 'Image path or URL (or upload below to replace)' : 'Image path, URL, or uploaded file'}
        </span>
        <input
          className={`${fieldClass} mt-1 font-mono text-xs`}
          value={src?.startsWith('data:') ? '(uploaded image — save the page to publish)' : src || ''}
          onChange={(e) => onChangeSrc(e.target.value)}
          placeholder="/images/… or https://…"
          disabled={Boolean(src?.startsWith('data:'))}
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
          {busy ? 'Compressing…' : 'Upload image'}
        </button>
        {src?.startsWith('data:') ? (
          <button type="button" className={btnGhost} onClick={() => onChangeSrc('')}>
            Clear upload
          </button>
        ) : null}
        <span className="text-[11px] text-alignment-accent/55">Auto-compressed for the site · JPEG/PNG/WebP/GIF</span>
      </div>
      {error ? <p className="text-sm text-[#C45C4A]">{error}</p> : null}
    </div>
  );
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not process image'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      if (dataUrl.length > 380000) {
        reject(new Error('Image is still too large after compression. Try a simpler photo.'));
        return;
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}
