const MAX_EDGE = 320;
const MAX_BYTES = 180_000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image. Use a JPEG or PNG.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Could not process image.'));
        else resolve(blob);
      },
      type,
      quality
    );
  });
}

function drawToCanvas(img, edge) {
  const scale = Math.min(1, edge / Math.max(img.width, img.height, 1));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');
  ctx.fillStyle = '#F7F5F0';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/** Shrink a photo so a typical camera file fits the avatar upload limit. */
export async function compressAvatarFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF.');
  }
  const img = await loadImage(file);
  let edge = MAX_EDGE;
  let quality = 0.84;
  let blob = await canvasToBlob(drawToCanvas(img, edge), 'image/jpeg', quality);
  while (blob.size > MAX_BYTES && quality > 0.45) {
    quality -= 0.12;
    blob = await canvasToBlob(drawToCanvas(img, edge), 'image/jpeg', quality);
  }
  if (blob.size > MAX_BYTES) {
    edge = 220;
    blob = await canvasToBlob(drawToCanvas(img, edge), 'image/jpeg', 0.7);
  }
  if (blob.size > MAX_BYTES) {
    throw new Error('That photo is still too large. Try a smaller image.');
  }
  return new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
}
