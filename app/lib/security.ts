/**
 * Client-side defense helpers. These complement the Next.js security headers;
 * they do not replace server-side validation, which must be added when a backend
 * is wired in.
 */

const FORBIDDEN_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

export function sanitizeInput(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026#39;")
    .trim();
}

export function looksLikeInjection(value: string): boolean {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(value));
}

export function validatePassword(password: string): { ok: boolean; reason?: string } {
  if (password.length < 10) return { ok: false, reason: "At least 10 characters required." };
  if (!/[A-Z]/.test(password)) return { ok: false, reason: "Include an uppercase letter." };
  if (!/[a-z]/.test(password)) return { ok: false, reason: "Include a lowercase letter." };
  if (!/[0-9]/.test(password)) return { ok: false, reason: "Include a number." };
  if (!/[^A-Za-z0-9]/.test(password)) return { ok: false, reason: "Include a symbol." };
  return { ok: true };
}

export function hashPassword(password: string): string {
  // Placeholder for a real PBKDF2/Argon2 hash. Never ship this.
  // Salt is read from env so it is not hardcoded in source.
  const salt = process.env.NEXT_PUBLIC_DEMO_SALT || "";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  return btoa(String.fromCharCode(...new Uint8Array(data.slice(0, 16))));
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}

/**
 * Generate a demo OTP for the email verification step.
 * In production this must be replaced by a server-side code sent via SMS/email.
 */
export function generateOtp(email: string): string {
  const demoCode = process.env.NEXT_PUBLIC_DEMO_OTP || "";
  if (demoCode) return demoCode;
  // Fallback deterministic demo OTP derived from email so tests are reproducible.
  const seed = email.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash % 1_000_000).toString().padStart(6, "0");
  return code;
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Generate a secure-ish random token for audit/session use.
 * Production should use crypto.randomUUID or a backend-issued JWT.
 */
export function generateSessionToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked = local.length > 2 ? `${local.slice(0, 2)}***${local.slice(-1)}` : "***";
  return `${masked}@${domain}`;
}
