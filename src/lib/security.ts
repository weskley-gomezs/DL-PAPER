const DEFAULT_WHATSAPP_PHONE = "5561998889577";
const MAX_URL_LENGTH = 2048;

// Regex for invisible control characters & Unicode bidi overrides
const UNSAFE_TEXT_CHARS_RE = /[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;
const UNSAFE_TEXT_CHARS_CHECK_RE = /[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069]/;
const SAFE_LOCAL_ASSET_RE = /^\/src\/assets\/images\/[a-zA-Z0-9._-]+$/;
const SAFE_PUBLIC_ASSET_RE = /^\/[a-zA-Z0-9._/-]+\.(png|jpg|jpeg|webp|gif)$/i;
const SAFE_RASTER_DATA_URL_RE =
  /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i;
const MAX_DATA_URL_LENGTH = 900_000;

/**
 * Validates that an external URL uses strictly the https:// protocol.
 * Blocks javascript:, data:, vbscript:, http:, relative injections, and credentialed URLs.
 * Returns the normalized URL string or "" if invalid.
 */
export function isStrictHttpsUrl(value: unknown): string {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return "";
  if (UNSAFE_TEXT_CHARS_CHECK_RE.test(trimmed) || /\s/.test(trimmed)) return "";

  // Case-insensitive fast guard before URL parsing
  if (!/^https:\/\//i.test(trimmed)) return "";

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return "";
    if (!parsed.hostname || parsed.username || parsed.password) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Validates safe image sources:
 * - Strict https:// URLs (e.g. Firebase Storage downloadURLs)
 * - Safe compressed raster Base64 data URLs (jpeg/png/webp only; blocks svg+xml, html, javascript:)
 * - Optionally safe local static assets inside /src/assets/images/ or /public/
 */
export function isSafeImageSource(
  value: unknown,
  allowLocalAssets = false
): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (
    trimmed.length <= MAX_DATA_URL_LENGTH &&
    SAFE_RASTER_DATA_URL_RE.test(trimmed)
  ) {
    return trimmed;
  }

  if (
    allowLocalAssets &&
    (SAFE_LOCAL_ASSET_RE.test(trimmed) || SAFE_PUBLIC_ASSET_RE.test(trimmed))
  ) {
    return trimmed;
  }

  return isStrictHttpsUrl(trimmed);
}

/**
 * Allows strict https:// URLs, safe raster Base64 fallbacks, or local static assets.
 */
export function getSafeImageUrl(value: unknown): string {
  return isSafeImageSource(value, true);
}

/**
 * Sanitizes untrusted plain text for safe JSX rendering and enforces a maximum character limit.
 * Never interprets or outputs HTML.
 */
export function sanitizePlainText(
  value: unknown,
  maxLength: number,
  fallback = ""
): string {
  if (typeof value !== "string") return fallback;

  const cleaned = value
    .replace(UNSAFE_TEXT_CHARS_RE, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return fallback;
  if (maxLength <= 0) return "";
  if (cleaned.length <= maxLength) return cleaned;

  return `${cleaned.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

/**
 * Normalizes a WhatsApp phone number to digits only, falling back to the store default if invalid.
 */
export function sanitizePhoneDigits(
  rawPhone: unknown,
  fallback = DEFAULT_WHATSAPP_PHONE
): string {
  if (typeof rawPhone !== "string") return fallback;
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return fallback;
  return digits;
}

/**
 * Builds a safe https://wa.me URL ensuring phone digits are sanitized and message is URI-encoded.
 */
export function buildSafeWhatsAppUrl(
  rawPhone: unknown,
  message?: string
): string {
  const phone = sanitizePhoneDigits(rawPhone);
  if (!message) {
    return `https://wa.me/${phone}`;
  }
  const cleanMessage = message.replace(UNSAFE_TEXT_CHARS_RE, " ").trim();
  return `https://wa.me/${phone}?text=${encodeURIComponent(cleanMessage)}`;
}

/**
 * Checks that a Firestore product price is strictly a finite positive number.
 */
export function isValidPositivePrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
