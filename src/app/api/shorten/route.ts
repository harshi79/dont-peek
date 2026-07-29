import { NextResponse } from "next/server";
import { createShortenedUrl } from "@/lib/shorten";
import { getBaseUrlFromHeaders } from "@/lib/utils";
import { shortenRateLimiter, getClientIp } from "@/lib/rate-limit";
import type { ShortenRequest, ShortenErrorResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Check rate limit
    const clientIp = getClientIp(req.headers);
    const rateCheck = shortenRateLimiter.check(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json<ShortenErrorResponse>(
        { error: "Too many requests. Please try again in a minute." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "40",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Parse JSON body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<ShortenErrorResponse>(
        { error: "Invalid JSON request body. Expected { \"url\": \"https://...\" }" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || !("url" in body)) {
      return NextResponse.json<ShortenErrorResponse>(
        { error: "Missing required 'url' field in JSON request body" },
        { status: 400 }
      );
    }

    const { url } = body as ShortenRequest;

    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json<ShortenErrorResponse>(
        { error: "Please provide a valid URL string" },
        { status: 400 }
      );
    }

    // 3. Determine current host to prevent self-shortening loops
    const forwardedHost = req.headers.get("x-forwarded-host");
    const currentHost = forwardedHost || req.headers.get("host") || undefined;

    // 4. Shorten URL (with deduplication and safe collision retry)
    const result = await createShortenedUrl(url, {
      currentHost,
    });

    if (!result.success) {
      return NextResponse.json<ShortenErrorResponse>(
        { error: result.error },
        { status: result.status }
      );
    }

    // 5. Construct short_url dynamically using current deployment origin
    const baseUrl = getBaseUrlFromHeaders(req.headers);
    const short_url = `${baseUrl}/${result.data.code}`;

    const status = result.data.existing ? 200 : 201;

    return NextResponse.json(
      {
        code: result.data.code,
        short_url,
        url: result.data.url,
      },
      {
        status,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error in POST /api/shorten:", error);
    return NextResponse.json<ShortenErrorResponse>(
      { error: "An unexpected server error occurred while creating the short link" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json<ShortenErrorResponse>(
    { error: "Method Not Allowed. Use POST /api/shorten to create a short link." },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );
}

export async function PUT() {
  return NextResponse.json<ShortenErrorResponse>(
    { error: "Method Not Allowed. Use POST /api/shorten to create a short link." },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function DELETE() {
  return NextResponse.json<ShortenErrorResponse>(
    { error: "Method Not Allowed. Use POST /api/shorten to create a short link." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
