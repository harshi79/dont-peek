import { getLinkByUrl, insertLink, isUniqueConstraintError } from "./db";
import { generateShortCode } from "./utils";
import { validateAndNormalizeUrl } from "./validation";
import type { ShortenResult } from "@/types";

export interface ShortenOptions {
  currentHost?: string;
  codeLength?: number;
}

/**
 * Core URL shortening logic with deduplication and safe collision retry handling.
 */
export async function createShortenedUrl(
  inputUrl: string,
  options: ShortenOptions = {}
): Promise<{ success: true; data: ShortenResult } | { success: false; error: string; status: number }> {
  // 1. Validate and normalize URL
  const validation = validateAndNormalizeUrl(inputUrl, options.currentHost);
  if (!validation.valid || !validation.url) {
    return {
      success: false,
      error: validation.error || "Invalid URL provided",
      status: 400,
    };
  }

  const normalizedUrl = validation.url;

  // 2. Check for existing shortened link (deduplication requirement 6)
  const existing = await getLinkByUrl(normalizedUrl);
  if (existing) {
    return {
      success: true,
      data: {
        code: existing.code,
        url: existing.url,
        short_url: "", // The caller will populate short_url with the dynamic base origin
        existing: true,
      },
    };
  }

  // 3. Generate short code and safely insert with collision retry loop (requirement 5)
  const MAX_RETRIES = 10;
  const codeLength = options.codeLength || 6;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = generateShortCode(codeLength);
    try {
      const inserted = await insertLink(code, normalizedUrl);
      return {
        success: true,
        data: {
          code: inserted.code,
          url: inserted.url,
          short_url: "", // Will be populated by caller
          existing: false,
        },
      };
    } catch (err: unknown) {
      if (isUniqueConstraintError(err)) {
        // Collision detected on code UNIQUE constraint; generate a new code and retry
        continue;
      }
      // Re-throw unexpected errors (e.g. database connectivity issues)
      throw err;
    }
  }

  return {
    success: false,
    error: "Could not generate a unique short code after multiple attempts. Please try again.",
    status: 500,
  };
}
