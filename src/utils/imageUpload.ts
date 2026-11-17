import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

const DEFAULT_MAX_WIDTH = 900;
const DEFAULT_QUALITY = 0.8;
const STORAGE_UPLOAD_TIMEOUT_MS = 8000;
const MAX_FIRESTORE_SAFE_BASE64_LEN = 240_000; // ~180KB binary so arrays fit cleanly inside 1MB Firestore docs

export interface CompressedImageResult {
  blob: Blob;
  dataUrl: string;
  contentType: string;
  extension: string;
}

export interface UploadedImageResult {
  url: string;
  source: "storage" | "base64";
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error("Não foi possível ler o arquivo de imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => resolve(img);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function encodeCanvasAtSize(
  img: HTMLImageElement,
  maxWidth: number,
  quality: number,
  preferWebp: boolean
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    let { width, height } = img;
    if (width > maxWidth) {
      height = Math.max(1, Math.round((height * maxWidth) / width));
      width = maxWidth;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas indisponível neste navegador."));
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);

    const webpCandidate = preferWebp
      ? canvas.toDataURL("image/webp", quality)
      : "";
    const supportsWebp = webpCandidate.startsWith("data:image/webp");
    const outputMime = supportsWebp ? "image/webp" : "image/jpeg";
    const extension = supportsWebp ? "webp" : "jpg";
    const dataUrl = supportsWebp
      ? webpCandidate
      : canvas.toDataURL("image/jpeg", quality);

    void canvasToBlob(canvas, outputMime, quality).then((blob) => {
      if (!blob) {
        reject(new Error("Falha ao gerar arquivo comprimido."));
        return;
      }
      resolve({
        blob,
        dataUrl,
        contentType: outputMime,
        extension,
      });
    });
  });
}

/**
 * Redimensiona e comprime automaticamente a imagem no navegador via <canvas>
 * (largura máxima padrão 900px, qualidade 0.8 em WebP/JPEG).
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = DEFAULT_MAX_WIDTH,
  quality = DEFAULT_QUALITY
): Promise<string> {
  const result = await compressImage(file, maxWidth, quality);
  return result.dataUrl;
}

export async function compressImage(
  file: File,
  maxWidth = DEFAULT_MAX_WIDTH,
  quality = DEFAULT_QUALITY
): Promise<CompressedImageResult> {
  const img = await loadImageFromFile(file);
  const preferWebp =
    file.type === "image/png" || file.type === "image/webp" || true;

  let result = await encodeCanvasAtSize(img, maxWidth, quality, preferWebp);

  // Garante tamanho seguro para fallback em Base64 no Cloud Firestore
  if (result.dataUrl.length > MAX_FIRESTORE_SAFE_BASE64_LEN) {
    result = await encodeCanvasAtSize(img, 720, 0.72, preferWebp);
  }
  if (result.dataUrl.length > MAX_FIRESTORE_SAFE_BASE64_LEN) {
    result = await encodeCanvasAtSize(img, 560, 0.65, preferWebp);
  }

  return result;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Tempo limite excedido no upload ao Firebase Storage."));
    }, ms);
    promise
      .then((res) => {
        window.clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Faz compressão automática (max 900px, qualidade 0.8), tenta upload real para
 * Firebase Storage (site-imagens/) e, em qualquer erro de permissão/CORS/rede,
 * retorna automaticamente a imagem comprimida em Base64 para persistir direto no Firestore.
 */
export async function uploadSiteImage(
  file: File,
  folder = "geral"
): Promise<UploadedImageResult> {
  const compressed = await compressImage(
    file,
    DEFAULT_MAX_WIDTH,
    DEFAULT_QUALITY
  );

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "geral";
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const storagePath = `site-imagens/${safeFolder}/${Date.now()}-${randomSuffix}.${compressed.extension}`;

  try {
    const storageRef = ref(storage, storagePath);
    await withTimeout(
      uploadBytes(storageRef, compressed.blob, {
        contentType: compressed.contentType,
        cacheControl: "public, max-age=31536000",
      }),
      STORAGE_UPLOAD_TIMEOUT_MS
    );

    const downloadURL = await withTimeout(
      getDownloadURL(storageRef),
      STORAGE_UPLOAD_TIMEOUT_MS
    );

    return {
      url: downloadURL,
      source: "storage",
    };
  } catch (err) {
    console.warn(
      "Firebase Storage indisponível (permissão/CORS/rede); aplicando fallback em Base64 no Firestore.",
      err
    );
    return {
      url: compressed.dataUrl,
      source: "base64",
    };
  }
}
