import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Terminal,
  Code2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "API Documentation | Crimson Blood Moon URL Shortener",
  description:
    "Developer documentation for creating short URLs via the Crimson Blood Moon REST API (POST /api/shorten).",
};

export default function DocsPage() {
  const reqExample = `{
  "url": "https://example.com/some/really/long/url"
}`;

  const resSuccessExample = `{
  "code": "K7xP2q",
  "short_url": "https://project-name.vercel.app/K7xP2q",
  "url": "https://example.com/some/really/long/url"
}`;

  const resErrorExample = `{
  "error": "Invalid URL format. Must be a valid http:// or https:// URL"
}`;

  const curlExample = `curl -X POST https://your-app.vercel.app/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/very/long/url"}'`;

  const fetchExample = `const response = await fetch("https://your-app.vercel.app/api/shorten", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com/very/long/url",
  }),
});

const data = await response.json();
console.log("Shortened URL:", data.short_url);`;

  const pythonExample = `import requests

url = "https://your-app.vercel.app/api/shorten"
payload = {"url": "https://example.com/very/long/url"}

response = requests.post(url, json=payload)
data = response.json()

print("Shortened URL:", data["short_url"])`;

  return (
    <div className="min-h-screen bg-blood-black text-gray-200 py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Blood Moon Glow in top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blood-moon-radial rounded-full pointer-events-none blur-3xl opacity-50" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back to Homepage Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-crimson-400 hover:text-crimson-300 transition-colors bg-blood-surface/80 border border-blood-border px-3.5 py-2 rounded-xl shadow-sm hover:shadow-crimson-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        {/* Docs Title & Intro */}
        <div className="border-b border-blood-border/80 pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-950/90 border border-crimson-700/40 text-crimson-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Crimson Blood Moon{" "}
            <span className="text-crimson-500">API Reference</span>
          </h1>

          <p className="text-sm sm:text-base text-blood-muted max-w-2xl leading-relaxed">
            Integrate URL shortening directly into your applications, scripts, or
            automation workflows. Our public JSON API is lightweight, fast, and
            requires no authentication.
          </p>
        </div>

        {/* Endpoint Header Card */}
        <div className="bg-blood-surface/85 backdrop-blur-md border border-blood-border rounded-2xl p-6 sm:p-8 shadow-crimson-md mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-crimson-600/20 border border-crimson-500/40 text-crimson-400 font-mono text-sm font-bold">
                POST
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-white tracking-tight">
                /api/shorten
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-blood-muted bg-blood-charcoal px-3 py-1.5 rounded-full border border-blood-border">
              <Server className="w-3.5 h-3.5 text-crimson-500" />
              <span>Host: Same origin as website</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            Creates a unique, permanent short URL mapping stored in Neon
            PostgreSQL. If the destination URL has already been shortened, the
            service returns the existing short link instead of creating a duplicate
            record.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-blood-border/60 pt-6">
            <div className="bg-blood-charcoal/60 rounded-xl p-4 border border-blood-border/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-crimson-400 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Authentication</span>
              </div>
              <p className="text-xs text-gray-400">
                None required. Public endpoint.
              </p>
            </div>

            <div className="bg-blood-charcoal/60 rounded-xl p-4 border border-blood-border/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-crimson-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Content-Type</span>
              </div>
              <p className="text-xs font-mono text-gray-400">
                application/json
              </p>
            </div>

            <div className="bg-blood-charcoal/60 rounded-xl p-4 border border-blood-border/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-crimson-400 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Rate Limiting</span>
              </div>
              <p className="text-xs text-gray-400">
                40 requests per minute per IP.
              </p>
            </div>
          </div>
        </div>

        {/* Request Body Table & Schema */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>Request Body</span>
          </h2>

          <div className="overflow-x-auto rounded-xl border border-blood-border bg-blood-surface/70 mb-4">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-blood-border bg-blood-charcoal text-gray-300">
                  <th className="py-3 px-4 font-semibold">Field</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Required</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blood-border/60">
                <tr>
                  <td className="py-3.5 px-4 font-mono text-crimson-400 font-semibold">
                    url
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">string</td>
                  <td className="py-3.5 px-4 text-crimson-400 font-semibold">
                    Yes
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">
                    The destination URL to shorten. Must start with{" "}
                    <code className="bg-blood-charcoal px-1.5 py-0.5 rounded text-crimson-300">
                      http://
                    </code>{" "}
                    or{" "}
                    <code className="bg-blood-charcoal px-1.5 py-0.5 rounded text-crimson-300">
                      https://
                    </code>{" "}
                    and cannot point to localhost or private network addresses.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={reqExample}
            language="json"
            title="Example Request Body"
          />
        </section>

        {/* Response Examples Section */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>Response Format</span>
          </h2>

          <p className="text-sm text-blood-muted mb-4">
            Successful requests return a JSON object with the generated 6-character{" "}
            <code className="text-crimson-300">code</code>, the full dynamic{" "}
            <code className="text-crimson-300">short_url</code>, and the original{" "}
            <code className="text-crimson-300">url</code>.
          </p>

          <CodeBlock
            code={resSuccessExample}
            language="json"
            title="Success Response (200 OK / 201 Created)"
          />

          <CodeBlock
            code={resErrorExample}
            language="json"
            title="Error Response (400 Bad Request)"
          />
        </section>

        {/* HTTP Status Codes Table */}
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>HTTP Status Codes</span>
          </h2>

          <div className="overflow-x-auto rounded-xl border border-blood-border bg-blood-surface/70">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-blood-border bg-blood-charcoal text-gray-300">
                  <th className="py-3 px-4 font-semibold">Status Code</th>
                  <th className="py-3 px-4 font-semibold">Meaning</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blood-border/60">
                <tr>
                  <td className="py-3.5 px-4 font-mono text-green-400 font-bold">
                    200 OK
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    Existing Link Returned
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    The URL was already shortened previously; its existing short
                    code mapping was returned.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-green-400 font-bold">
                    201 Created
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    New Link Created
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    A new unique short code was successfully generated and stored
                    in the database.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                    400 Bad Request
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    Validation Error
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    Missing or invalid URL, forbidden scheme (javascript:, data:),
                    or internal/localhost IP address.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                    405 Method Not Allowed
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    Invalid HTTP Method
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    Only POST requests are permitted on this endpoint.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-red-400 font-bold">
                    429 Too Many Requests
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    Rate Limit Exceeded
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    Client IP exceeded the maximum of 40 requests per minute.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-red-400 font-bold">
                    500 Internal Server Error
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300">
                    Server Error
                  </td>
                  <td className="py-3.5 px-4 text-blood-muted">
                    An unexpected server or database error occurred. No stack
                    traces or credentials are ever exposed.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Code Examples Snippets Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-crimson-500" />
            <span>Code Examples</span>
          </h2>

          <p className="text-sm text-blood-muted mb-6">
            Use these ready-made snippets to shorten URLs in your preferred language
            or tool.
          </p>

          <div className="flex flex-col gap-6">
            <CodeBlock
              code={curlExample}
              language="bash"
              title="cURL (Command Line)"
            />

            <CodeBlock
              code={fetchExample}
              language="typescript"
              title="JavaScript / TypeScript (fetch API)"
            />

            <CodeBlock
              code={pythonExample}
              language="python"
              title="Python (requests library)"
            />
          </div>
        </section>

        {/* Bottom CTA to Return Home */}
        <div className="border-t border-blood-border/60 pt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 border border-crimson-500/30 shadow-crimson-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to URL Shortener</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
