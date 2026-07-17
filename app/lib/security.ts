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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
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
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "REDACTED_DEMO_SALT");
  return btoa(String.fromCharCode(...new Uint8Array(data.slice(0, 16))));
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}
