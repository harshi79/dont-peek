export interface ValidationResult {
  valid: boolean;
  url?: string;
  error?: string;
}

const PRIVATE_IP_PATTERNS = [
  /^127\./, // 127.0.0.0/8 loopback
  /^10\./, // 10.0.0.0/8 RFC1918
  /^192\.168\./, // 192.168.0.0/16 RFC1918
  /^169\.254\./, // 169.254.0.0/16 link-local / cloud metadata
  /^0\./, // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // 100.64.0.0/10 CGNAT
  /^192\.0\.0\./, // 192.0.0.0/24
  /^198\.1[89]\./, // 198.18.0.0/15
];

const FORBIDDEN_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
]);

const FORBIDDEN_TLDS = [
  ".local",
  ".internal",
  ".test",
  ".example",
  ".invalid",
  ".localhost",
];

/**
 * Validates and normalizes a destination URL, protecting against dangerous schemes,
 * localhost/private IP SSFR, and infinite redirect loops.
 */
export function validateAndNormalizeUrl(
  input: string,
  currentHost?: string
): ValidationResult {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Please enter a URL to shorten" };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter a URL to shorten" };
  }

  if (trimmed.length > 4096) {
    return {
      valid: false,
      error: "URL exceeds maximum allowed length of 4096 characters",
    };
  }

  // Auto-prepend https:// if the user forgot the protocol scheme
  let urlToParse = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    urlToParse = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlToParse);
  } catch {
    return {
      valid: false,
      error: "Invalid URL format. Must be a valid http:// or https:// URL",
    };
  }

  // Scheme verification
  const scheme = parsed.protocol.toLowerCase();
  if (scheme !== "http:" && scheme !== "https:") {
    return {
      valid: false,
      error:
        "Only http:// and https:// URLs are allowed. Dangerous schemes are prohibited.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check forbidden exact hostnames
  if (FORBIDDEN_HOSTS.has(hostname)) {
    return {
      valid: false,
      error:
        "URLs pointing to localhost or internal network addresses are not allowed",
    };
  }

  // Check forbidden TLD extensions
  if (FORBIDDEN_TLDS.some((tld) => hostname.endsWith(tld))) {
    return {
      valid: false,
      error:
        "URLs pointing to localhost or internal network addresses are not allowed",
    };
  }

  // Check private IPv4 patterns
  if (PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname))) {
    return {
      valid: false,
      error:
        "URLs pointing to localhost or internal network addresses are not allowed",
    };
  }

  // Check 172.16.0.0/12 private range (172.16.x.x - 172.31.x.x)
  const rfc172Match = hostname.match(/^172\.(\d+)\./);
  if (rfc172Match) {
    const secondOctet = parseInt(rfc172Match[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return {
        valid: false,
        error:
          "URLs pointing to localhost or internal network addresses are not allowed",
      };
    }
  }

  // Check against our own application host to prevent infinite redirect loops
  if (currentHost) {
    const cleanCurrentHost = currentHost.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (hostname === cleanCurrentHost) {
      return {
        valid: false,
        error: "Cannot shorten a URL that already points to this shortener service",
      };
    }
  }

  return {
    valid: true,
    url: parsed.toString(),
  };
}
