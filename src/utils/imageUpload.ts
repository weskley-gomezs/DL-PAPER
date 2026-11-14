/**
 * Compresses and resizes an uploaded image File into a lightweight Data URL
 * so it can be safely persisted in localStorage without exceeding storage quota.
 */
export function compressImageToDataUrl(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo de imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const isPng = file.type === "image/png";
        const targetMaxWidth = isPng ? Math.min(maxWidth, 900) : maxWidth;
        let { width, height } = img;

        if (width > targetMaxWidth) {
          height = Math.round((height * targetMaxWidth) / width);
          width = targetMaxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputMime = isPng ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(outputMime, quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
