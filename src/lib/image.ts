/*
  Prepara la foto de un producto para guardarla en localStorage:
  la reduce a un máximo de 800 px por lado y la convierte a JPEG, así cada foto pesa unos 100 KB.
*/

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_SIDE = 800;

export type ImageResult = { ok: true; dataUrl: string } | { ok: false; error: string };

export function prepareImage(file: File): Promise<ImageResult> {
  if (!ACCEPTED.includes(file.type)) return Promise.resolve({ ok: false, error: 'Elige una imagen JPG, PNG o WebP.' });
  if (file.size > MAX_FILE_BYTES) return Promise.resolve({ ok: false, error: 'La imagen pesa más de 8 MB. Elige una más ligera.' });

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        resolve({ ok: false, error: 'Este navegador no pudo procesar la imagen.' });
        return;
      }
      // Fondo claro: las imágenes con transparencia no se ven negras en JPEG
      context.fillStyle = '#FFFDF6';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ ok: true, dataUrl: canvas.toDataURL('image/jpeg', 0.82) });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ ok: false, error: 'No pudimos leer esa imagen. Prueba con otra.' });
    };
    img.src = url;
  });
}
