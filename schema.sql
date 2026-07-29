-- Crimson Blood Moon URL Shortener
-- Database Schema for Neon PostgreSQL
-- Run this SQL in your Neon SQL Editor or use the automatic setup script: `npm run db:init`

CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for fast destination URL deduplication queries
CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);

-- Index for fast short code lookups during redirection
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
