import { neon } from "@neondatabase/serverless";
import type { LinkRecord } from "@/types";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

function isPostgresUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.startsWith("postgres://") ||
    url.startsWith("postgresql://") ||
    url.startsWith("neon://")
  );
}

const POSTGRES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
`;

const SQLITE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
`;

/**
 * Initializes database schema.
 * Supports both Neon PostgreSQL (@neondatabase/serverless) and local SQLite fallback.
 */
export async function initDb(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const dbUrl = process.env.DATABASE_URL;

    if (isPostgresUrl(dbUrl)) {
      const sql = neon(dbUrl!);
      const statements = POSTGRES_SCHEMA_SQL.split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const statement of statements) {
        await sql.query(statement);
      }
      isInitialized = true;
      return;
    }

    // Local SQLite fallback for development and offline testing
    const filePath = dbUrl
      ? dbUrl.replace(/^file:/i, "").replace(/^sqlite:/i, "")
      : "./dev.db";
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(filePath);
    db.exec(SQLITE_SCHEMA_SQL);
    isInitialized = true;
  })();

  try {
    await initPromise;
  } finally {
    initPromise = null;
  }
}

export async function getLinkByCode(
  code: string
): Promise<LinkRecord | null> {
  await initDb();
  const dbUrl = process.env.DATABASE_URL;

  if (isPostgresUrl(dbUrl)) {
    const sql = neon(dbUrl!);
    const rows = (await sql.query(
      "SELECT id, code, url, created_at FROM links WHERE code = $1 LIMIT 1",
      [code]
    )) as unknown as LinkRecord[];
    return rows.length > 0 ? rows[0] : null;
  }

  const filePath = dbUrl
    ? dbUrl.replace(/^file:/i, "").replace(/^sqlite:/i, "")
    : "./dev.db";
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(filePath);
  const stmt = db.prepare(
    "SELECT id, code, url, created_at FROM links WHERE code = ? LIMIT 1"
  );
  const row = stmt.get(code) as Record<string, unknown> | undefined;
  if (!row) return null;

  return {
    id: Number(row.id),
    code: String(row.code),
    url: String(row.url),
    created_at: String(row.created_at),
  };
}

export async function getLinkByUrl(url: string): Promise<LinkRecord | null> {
  await initDb();
  const dbUrl = process.env.DATABASE_URL;

  if (isPostgresUrl(dbUrl)) {
    const sql = neon(dbUrl!);
    const rows = (await sql.query(
      "SELECT id, code, url, created_at FROM links WHERE url = $1 LIMIT 1",
      [url]
    )) as unknown as LinkRecord[];
    return rows.length > 0 ? rows[0] : null;
  }

  const filePath = dbUrl
    ? dbUrl.replace(/^file:/i, "").replace(/^sqlite:/i, "")
    : "./dev.db";
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(filePath);
  const stmt = db.prepare(
    "SELECT id, code, url, created_at FROM links WHERE url = ? LIMIT 1"
  );
  const row = stmt.get(url) as Record<string, unknown> | undefined;
  if (!row) return null;

  return {
    id: Number(row.id),
    code: String(row.code),
    url: String(row.url),
    created_at: String(row.created_at),
  };
}

export async function insertLink(
  code: string,
  url: string
): Promise<LinkRecord> {
  await initDb();
  const dbUrl = process.env.DATABASE_URL;

  if (isPostgresUrl(dbUrl)) {
    const sql = neon(dbUrl!);
    const rows = (await sql.query(
      "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING id, code, url, created_at",
      [code, url]
    )) as unknown as LinkRecord[];
    return rows[0];
  }

  const filePath = dbUrl
    ? dbUrl.replace(/^file:/i, "").replace(/^sqlite:/i, "")
    : "./dev.db";
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(filePath);
  const stmt = db.prepare(
    "INSERT INTO links (code, url) VALUES (?, ?) RETURNING id, code, url, created_at"
  );
  const row = stmt.get(code, url) as Record<string, unknown>;
  return {
    id: Number(row.id),
    code: String(row.code),
    url: String(row.url),
    created_at: String(row.created_at),
  };
}

/**
 * Helper to identify database unique constraint violations safely across drivers.
 */
export function isUniqueConstraintError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; message?: string; name?: string };

  // PostgreSQL unique violation error code
  if (e.code === "23505") return true;

  // Generic message checking for SQLite or PostgreSQL constraints
  const msg = (e.message || "").toLowerCase();
  if (
    msg.includes("unique constraint") ||
    msg.includes("sqlite_constraint_unique") ||
    msg.includes("duplicate key") ||
    msg.includes("unique")
  ) {
    return true;
  }

  return false;
}
