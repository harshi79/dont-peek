import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const RESERVED_CODES = new Set([
  "docs",
  "api",
  "_next",
  "favicon.ico",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "public",
  "static",
  "assets",
  "images",
  "about",
  "terms",
  "privacy",
  "contact",
  "login",
  "signup",
  "admin",
  "dashboard",
  "user",
  "users",
  "help",
  "support",
  "status",
  "health",
  "healthz",
  "null",
  "undefined",
  "void",
  "test",
]);

const SHORT_CODE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a URL-safe compact code of the specified length.
 * Excludes reserved application routes.
 */
export function generateShortCode(length: number = 6): string {
  let code = "";
  do {
    code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * SHORT_CODE_CHARS.length);
      code += SHORT_CODE_CHARS.charAt(randomIndex);
    }
  } while (RESERVED_CODES.has(code.toLowerCase()));

  return code;
}

/**
 * Derives the base URL of the deployment dynamically from request headers or environment.
 */
export function getBaseUrlFromHeaders(headersList: Headers): string {
  const forwardedHost = headersList.get("x-forwarded-host");
  const host = forwardedHost || headersList.get("host");

  if (host) {
    const proto =
      headersList.get("x-forwarded-proto") ||
      (host.includes("localhost") || host.includes("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const cleanUrl = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return cleanUrl.replace(/\/$/, "");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
