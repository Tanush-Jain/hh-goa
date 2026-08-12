import heic2any from 'heic2any';

/**
 * Converts a File object to an HTMLImageElement + data URL.
 * Handles:
 *  - Standard JPG, PNG, WebP, GIF, AVIF
 *  - HEIC/HEIF (iPhone photos) via heic2any
 *  - Files with missing/empty MIME types (common on macOS device picker)
 */
export async function processImageFile(file) {
  if (!file) throw new Error('No file provided.');

  // Detect HEIC: check MIME type OR file extension (macOS sometimes reports empty type)
  const name = file.name ? file.name.toLowerCase() : '';
  const mimeType = file.type ? file.type.toLowerCase() : '';

  const isHeic =
    mimeType === 'image/heic' ||
    mimeType === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif');

  let processedBlob = file;

  if (isHeic) {
    try {
      const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9
      });
      processedBlob = Array.isArray(result) ? result[0] : result;
    } catch (err) {
      console.error('HEIC conversion error:', err);
      throw new Error('Could not convert this HEIC/iPhone photo. Try exporting it as JPG first in Photos app.');
    }
  }

  // Method 1: Try FileReader — works for all blob types
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        // Fallback to createObjectURL if FileReader gave us something bad
        loadViaObjectUrl(processedBlob, resolve, reject);
        return;
      }

      const img = new Image();
      img.onload = () => resolve({ img, dataUrl });
      img.onerror = () => {
        // FileReader data URL failed to decode — try object URL instead
        console.warn('FileReader img.onerror — falling back to createObjectURL');
        loadViaObjectUrl(processedBlob, resolve, reject);
      };
      img.src = dataUrl;
    };

    reader.onerror = () => {
      // FileReader itself failed — try object URL instead
      console.warn('FileReader.onerror — falling back to createObjectURL');
      loadViaObjectUrl(processedBlob, resolve, reject);
    };

    reader.readAsDataURL(processedBlob);
  });
}

/**
 * Fallback: Load image using URL.createObjectURL.
 * Converts the object URL back to a data URL for canvas drawing.
 */
function loadViaObjectUrl(blob, resolve, reject) {
  const objectUrl = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    // Convert object URL → data URL via a temp canvas (needed for canvas drawing later)
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth || img.width;
      tempCanvas.height = img.naturalHeight || img.height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
      URL.revokeObjectURL(objectUrl);
      resolve({ img, dataUrl });
    } catch (canvasErr) {
      // Canvas tainted or other error — still resolve with object URL as dataUrl
      console.warn('Canvas conversion failed, using objectUrl as dataUrl:', canvasErr);
      resolve({ img, dataUrl: objectUrl });
    }
  };

  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Could not load this image. Please try a different file (JPG or PNG works best).'));
  };

  // crossOrigin not needed for local object URLs
  img.src = objectUrl;
}
